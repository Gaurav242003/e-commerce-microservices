const axios = require("axios");

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL;

const notifyPaymentSuccess = async (payment) => {
  await axios.post(
    `${ORDER_SERVICE_URL}/api/v1/orders/${payment.order_id}/payment-success`,
    {
      paymentId: payment.id
    }
  );
};

const notifyPaymentFailed = async (payment) => {
  await axios.post(
    `${ORDER_SERVICE_URL}/api/v1/orders/${payment.order_id}/payment-failed`,
    {
      paymentId: payment.id,
      reason: payment.failure_reason
    }
  );
};

module.exports = {
  notifyPaymentSuccess,
  notifyPaymentFailed
};
