const paymentService = require('./createPayment');

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

module.exports = {
  createPayment
};