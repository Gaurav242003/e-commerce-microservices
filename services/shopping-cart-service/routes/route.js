const express = require('express');
const mongoose = require('../database/connectionDB');
const { authVerify } = require('../middlewares/auth');
const { getCart, addItemToCart, updateItemQuantity, removeItemFromCart, validateCart, clearCartByUserId } = require('../controllers/cartController');
const router = express.Router();

router.get('/cart', authVerify, getCart);
router.post('/cart/add', authVerify, addItemToCart);
router.put('/cart/update/:productId', authVerify, updateItemQuantity);
router.delete('/cart/remove/:productId', authVerify, removeItemFromCart);
router.get('/cart/validate', authVerify, validateCart);
router.delete('/cart/clear', authVerify, clearCartByUserId);

router.get('/', (req, res) => {
    res.send('Shopping Cart Service is up and running');
})



module.exports = router;