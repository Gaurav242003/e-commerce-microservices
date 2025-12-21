const mongoose = require("../database/connectiondb");

const Products = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    categoryId: { type: String, required: true },
    sku: { type: String, unique: true, required: true },
    brand: { type: String },
    status: {
      type: String,
      enum: ["DRAFT", "ACTIVE", "INACTIVE"],
      default: "DRAFT"
    }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', Products);

module.exports = Product;