const paymentService = require('./createPayment');
const paymentRepo = require('../repo/payment.repo');
const { PAYMENT_STATUS } = require('../models/payment.constants');
const createPayment = async (req, res) => {
  try {
 
    const payment = await paymentService.createPayment(req.body);

    return res.status(201).json({
      success: true,
      data: {
        paymentId: payment.id,
        status: payment.status
      }
    });
  } catch (error) {
    console.error("Create Payment Error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const cancelPayment = async (req, res) => {
  const payment = await paymentRepo.findById(req.params.paymentId);

  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  if (![PAYMENT_STATUS.INITIATED, PAYMENT_STATUS.PROCESSING].includes(payment.status)) {
    return res.status(400).json({ message: "Cannot cancel payment" });
  }

  await paymentRepo.updatePaymentStatus(
    payment.id,
    PAYMENT_STATUS.CANCELLED
  );

  return res.json({ success: true });
};

module.exports = {
  createPayment,
  cancelPayment
};