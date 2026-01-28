const express = require('express');
const { placeOrder } = require('../controllers/orders.controller');
const { authVerify} = require('../middlewares/auth');
const router = express.Router();


router.get('/health', (req, res) =>{
    res.status(200).send('Order Service is healthy');
})

router.post('/orders', authVerify, placeOrder);


module.exports = router;
