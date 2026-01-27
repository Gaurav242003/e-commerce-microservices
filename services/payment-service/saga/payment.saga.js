const axios = require("axios");

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL;

const notifyPaymentSuccess = async (payment) => {
  try {
    await retrySagaCallback(async () => {
      await axios.post(
        `${ORDER_SERVICE_URL}/api/v1/orders/${payment.order_id}/payment-success`,
        { paymentId: payment.id }
      );
    });
  } catch (err) {
    console.error("Saga success notification failed:", err.message);
    // TODO: persist for retry (outbox / DLQ)
  }
};


const notifyPaymentFailed = async (payment) => {

  try {
    await retrySagaCallback(async () => {
      await axios.post(
    `${ORDER_SERVICE_URL}/api/v1/orders/${payment.order_id}/payment-failed`,
    {
      paymentId: payment.id,
      reason: payment.failure_reason
    }
  );
  });
} catch (err) {
  console.error("saga failure notification failed:", err.message);
}
};

const retrySagaCallback = async (fn, maxRetries = 3) => {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await fn();
      return;
    } catch (err) {
      attempt++;
      await new Promise(r => setTimeout(r, attempt * 1000));
    }
  }

  throw new Error("Saga callback failed after retries");
};


module.exports = {
  notifyPaymentSuccess,
  notifyPaymentFailed
};
