require('dotenv').config();
const {CartItem, Cart} = require('../models/cart');

const axios = require('axios');

const getProductById = async (productId) => {
 
  const response = await axios.get(
    `${process.env.PRODUCT_SERVICE_URL}/products/${productId}`
  );
  return response.data.data;
};

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    return res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error("Get Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


module.exports = {getCart};