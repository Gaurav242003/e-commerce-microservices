const Product = require("../models/products");
const mongoose = require("../database/connectiondb");
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


const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        currency: product.currency,
        category: product.category,
        status: product.status,
        brand: product.brand,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    });
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    // Whitelist allowed fields
    const allowedUpdates = [
      "name",
      "description",
      "price",
      "currency",
      "category",
      "stock",
      "status"
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update"
      });
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      { $set: updates },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: {
        id: product._id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        status: product.status,
        updatedAt: product.updatedAt
      }
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;


    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (product.status === "INACTIVE") {
      return res.status(409).json({
        success: false,
        message: "Product is already inactive"
      });
    }

    product.status = "INACTIVE";
    product.deletedAt = new Date();
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product disabled successfully",
      data: {
        id: product._id,
        status: product.status,
        updatedAt: product.updatedAt
      }
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


module.exports = {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct
};
