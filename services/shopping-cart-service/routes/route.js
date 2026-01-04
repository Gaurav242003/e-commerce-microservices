const express = require('express');
const mongoose = require('../database/connectionDB');
const { authVerify } = require('../middlewares/auth');
const { getCart } = require('../controllers/cartController');
const router = express.Router();

router.get('/cart', authVerify, getCart);
router.get('/', (req, res) => {
    res.send('Shopping Cart Service is up and running');
})

module.exports = router;