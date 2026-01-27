const express = require('express');
const paymentController = require('../controllers/payment.controller');
const { handleWebhook } = require('../controllers/payment.webhook.controller');
const router = express.Router();

router.get('/health', (req, res) => {
    res.send('Payment service is up and running');
})

router.post('/payments', paymentController.createPayment);
router.post('/payment/webhook', handleWebhook);


module.exports = router; 