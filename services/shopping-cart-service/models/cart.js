const mongoose = require('../database/connectionDB');
const { Schema } = mongoose;

const cartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    name: { type: String, required: true },
    priceSnapshot: { type: Number, required: true }, // price at time of add
    currency: { type: String, default: "INR" },
    imageUrl: String, // optional, for UI display
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false } // no separate _id for each item; optional
);

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true // one cart per user
    },
    items: {
      type: [cartItemSchema],
      default: []
    }
  },
  { timestamps: true }
);

const cartItem = mongoose.model("CartItem", cartItemSchema);
const cart = mongoose.model("Cart", cartSchema);

module.exports = {cart, cartItem};