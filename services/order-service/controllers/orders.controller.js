// controllers/order.controller.js
const orderRepo = require('../repo/orders.repo');
const cartService = require('../services/cart.service');

const paymentService = require('../services/payment.services');

//const { ORDER_STATUS } = require("../models/order.constants");
const { v4: uuidv4 } = require("uuid");

const placeOrder = async (req, res) => {
  const userId = req.user.id;
  const idempotencyKey = req.headers["idempotency-key"];

  if (!idempotencyKey) {
    return res.status(400).json({ message: "Idempotency-Key required" });
  }

  // 1. Fetch cart
  const cart = await cartService.getCart(req);
  console.log("Cart: ", cart.data.data.items);
  if (!cart.data.data.items || cart.data.data.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  // 2. Validate products
  const validatedItems = await cartService.validateCart(req);
  console.log("validatedItems: ", validatedItems.data);

  if(!validatedItems.data.valid){
    return res.status(400).json({message: "Cart validation failed", errors: validatedItems.data.issues});
  }
  // 3. Calculate total
  const totalAmount = cart.data.data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  console.log("totalAmount:", totalAmount);

  // 4. Create order (transactional)
  const order = await orderRepo.createOrder({
    id: uuidv4(),
    userId,
    status: ORDER_STATUS.PAYMENT_PENDING,
    totalAmount,
    currency: req.body.currency,
    items: cart.data.data.items,
    idempotencyKey
  });

   return res.status(200).json({message: "testing completion"});

  // 5. Start payment saga (async)
  await paymentService.createPayment({
    orderId: order.id,
    amount: totalAmount,
    currency: order.currency,

  });

  return res.status(201).json({
    orderId: order.id,
    status: order.status
  });
};

module.exports = { placeOrder };
