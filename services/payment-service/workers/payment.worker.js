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

    if (!result.success) {
      await paymentRepo.updatePaymentStatus(
        payment.id,
        PAYMENT_STATUS.FAILED,
        { failure_reason: result.failureReason }
      );

      await saga.notifyPaymentFailed(payment);
      return;
    }

    await paymentRepo.updatePaymentStatus(
      payment.id,
      PAYMENT_STATUS.CAPTURED,
      {
        provider: result.provider,
        provider_payment_id: result.providerPaymentId
      }
    );

    await saga.notifyPaymentSuccess(payment);
  } catch (err) {
    console.error("Payment processing failed:", err);
  }
};

module.exports = {
  processPayment
};
