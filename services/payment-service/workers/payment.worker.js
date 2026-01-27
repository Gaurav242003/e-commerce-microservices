const paymentRepo = require("../repo/payment.repo");
const gateway = require("../gateway/payment.gateway");
const { PAYMENT_STATUS } = require("../models/payment.constants");
const saga = require("../saga/payment.saga");

const processPayment = async (payment) => {
  try {
    await paymentRepo.updatePaymentStatus(
      payment.id,
      PAYMENT_STATUS.PROCESSING
    );

    const result = await gateway.processPayment(payment);

    await paymentRepo.updatePaymentStatus(
      payment.id,
     
      {
        provider: result.provider,
        provider_payment_id: result.providerPaymentId
      }
    );

    
  } catch (err) {
    console.error("Payment processing failed:", err);
  }
};

module.exports = {
  processPayment
};
