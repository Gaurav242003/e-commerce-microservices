// services/payment.service.js
const axios = require("axios");

const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL;

const createPayment = async ({ orderId, amount, currency }) => {
  await axios.post(`${PAYMENT_SERVICE_URL}/api/v1/payments`, {
    orderId,
    amount,
    currency
  });
};

module.exports = { createPayment };
