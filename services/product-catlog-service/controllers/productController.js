const Product = require("../models/products");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      currency,
      categoryId,
      sku,
      brand
    } = req.body;

    
    if (!name || !price || !categoryId || !sku) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      currency,
      categoryId,
      sku,
      brand
    });

    return res.status(201).json({
      productId: product._id,
      status: product.status
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "SKU already exists"
      });
    }

    console.error("Create Product Error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

module.exports = {
  createProduct
};
