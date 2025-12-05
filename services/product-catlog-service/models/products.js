const mongoose = require("../database/connectiondb");

const Products = mongoose.Schema({
     heading: String,
     description: String,
     price: Number
});

const Product = mongoose.model('Product', Products);

module.exports = Product;