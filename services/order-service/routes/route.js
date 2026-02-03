const express = require('express');
const { placeOrder, orderSucess, orderFailed, orderCompleted, orderCancelled } = require('../controllers/orders.controller');
const { authVerify} = require('../middlewares/auth');
const { route } = require('./route');
const router = express.Router();


router.get('/health', (req, res) =>{
    res.status(200).send('Order Service is healthy');
})

router.post('/orders', authVerify, placeOrder);
router.post('/orders/:orderId/payment-success', orderSucess);
router.post('/orders/:orderId/payment-failed', orderFailed);
router.post('/orders/:orderId/order-completed', orderCompleted);
router.post('/orders/:orderId/order-cancelled',orderCancelled);


module.exports = router;
