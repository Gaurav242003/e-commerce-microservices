const paymentRepo = require('../repo/payment.repo');
const { PAYMENT_STATUS} = require('../models/payment.constants');
const saga = require('../saga/payment.saga');
const crypto = require("crypto");
const handleWebhook = async (req, res) => {
  const {
    providerPaymentId,
    status,
    failureReason
  } = req.body;

 

  //verify signature
//   const signature = req.headers['x-webhook-signature'];
//   const secret = process.env.WEBHOOK;
//   if( !verifySignature(req.body, signature, secret)) {
//     return res.status(400).json({ message: "Invalid signature" });
//   }

  // 1. Find payment
  const payment = await paymentRepo.findByProviderPaymentId(
    providerPaymentId
  );



  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }
  

  // 2. Idempotency: ignore duplicate webhook
  if (
    [PAYMENT_STATUS.CAPTURED, PAYMENT_STATUS.FAILED].includes(payment.status)
  ) {
    return res.status(200).json({ message: "Already processed" });
  }

  // 3. Update state
  if (status === "SUCCESS") {
    await paymentRepo.updatePaymentStatus(
      payment.id,
      PAYMENT_STATUS.CAPTURED
    );

    await saga.notifyPaymentSuccess(payment);
  } else {
    await paymentRepo.updatePaymentStatus(
      payment.id,
      PAYMENT_STATUS.FAILED,
      { failure_reason: failureReason }
    );

    await saga.notifyPaymentFailed(payment);
  }

  return res.status(200).json({ received: true });
};



const verifySignature = (payload, signature, secret) => {
  const hash = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");

  return hash === signature;
};


module.exports = { handleWebhook };