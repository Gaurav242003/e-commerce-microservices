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


const addItemToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid productId or quantity"
      });
    }

    const product = await getProductById(productId);

    if (product.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Product is not available"
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        name: product.name,
        priceSnapshot: product.price,
        currency: product.currency,
        imageUrl: product.imageUrl,
        quantity
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart
    });
  } catch (error) {
    console.error("Add Item Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};



module.exports = {getCart, addItemToCart};