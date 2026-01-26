const {v4: uuidv4} = require('uuid');
const paymentRepo = require('../repo/payment.repo');
const { PAYMENT_STATUS } = require('../models/payment.constants');
const { getIdempotencyKey, acquireLock, setIdempotencyKey, releaseLock } = require('../database/connectionRedis');
const paymentWorker = require('../workers/payment.worker');


const createPayment = async (data) => {
  const {
    orderId,
    userId,
    amount,
    currency,
    paymentMethod,
    idempotencyKey
  } = data;

  // 1. Check idempotency
  const cachedPaymentId = await getIdempotencyKey(
    `payment:idempotency:${idempotencyKey}`
  );
  

  if (cachedPaymentId) {
   
    return paymentRepo.findById(cachedPaymentId);
  }

  // 2. Acquire order lock
  const lockKey = `payment:lock:${orderId}`;
  const lock = await acquireLock(lockKey);
   

  if (!lock) {
    throw new Error("Payment already in progress for this order");
  }

  try {
    // 3. Double-check DB idempotency
  
    const existingPayment =
      await paymentRepo.findByIdempotencyKey(idempotencyKey);

    if (existingPayment) {
      return existingPayment;
    }

    // 4. Create payment
    const payment = await paymentRepo.createPayment({
      id: uuidv4(),
      orderId,
      userId,
      amount,
      currency,
      paymentMethod,
      status: PAYMENT_STATUS.INITIATED,
      idempotencyKey
    });
   

    // Fire-and-forget async processing
    setImmediate(() => {
       paymentWorker.processPayment(payment);
    });
   

    // 5. Cache idempotency key
    await setIdempotencyKey(
      `payment:idempotency:${idempotencyKey}`,
      payment.id
    );

    return payment;
  } finally {
    // 6. Release lock
    await releaseLock(lockKey);
  }
};





module.exports = {
  createPayment
};
