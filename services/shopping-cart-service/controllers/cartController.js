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

const updateItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1"
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const item = cart.items.find(
      item => item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart"
      });
    }

    item.quantity = quantity;
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Quantity updated",
      data: cart
    });
  } catch (error) {
    console.error("Update Quantity Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart
    });
  } catch (error) {
    console.error("Remove Item Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


const validateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        valid: true,
        issues: []
      });
    }

    const issues = [];

    for (const item of cart.items) {
      const product = await getProductById(item.productId);

      if (product.status !== "ACTIVE") {
        issues.push({
          productId: item.productId,
          reason: "PRODUCT_INACTIVE"
        });
      }

      if (product.stock < item.quantity) {
        issues.push({
          productId: item.productId,
          reason: "OUT_OF_STOCK"
        });
      }

      if (product.price !== item.priceSnapshot) {
        issues.push({
          productId: item.productId,
          reason: "PRICE_CHANGED",
          oldPrice: item.priceSnapshot,
          newPrice: product.price
        });
      }
    }

    return res.status(200).json({
      success: true,
      valid: issues.length === 0,
      issues
    });
  } catch (error) {
    console.error("Validate Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};



module.exports = {getCart, addItemToCart, updateItemQuantity, removeItemFromCart, validateCart};