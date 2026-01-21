const express = require('express');
const paymentController = require('../controllers/payment.controller');
const router = express.Router();

router.get('/health', (req, res) => {
    res.send('Payment service is up and running');
})

router.post('/payments', paymentController.createPayment);


module.exports = router; 