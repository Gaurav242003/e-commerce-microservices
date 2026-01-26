const processPayment = async ({ amount, currency, paymentMethod }) => {
  // Simulated gateway delay
  await new Promise((res) => setTimeout(res, 1500));

  // Simulated success/failure
  const isSuccess = Math.random() > 0.2;

  if (!isSuccess) {
    return {
      success: false,
      failureReason: "INSUFFICIENT_FUNDS"
    };
  }

  return {
    success: true,
    provider: "MOCK_GATEWAY",
    providerPaymentId: "pg_" + Date.now()
  };
};

module.exports = {
  processPayment
};
