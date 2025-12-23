const express = require("express");
const router = express.Router();
const mongoose = require("../database/connectiondb");
const {createProduct, getProductById, updateProduct, deleteProduct, listProducts} = require("../controllers/productController");
const {authorizeAdmin, authVerify} = require("../middlewares/auth");

router.post("/products", authVerify, authorizeAdmin, createProduct );
router.get("/products/:productId",getProductById);
router.put("/products/:productId", authVerify, authorizeAdmin, updateProduct);
router.delete("/products/:productId", authVerify, authorizeAdmin, deleteProduct);
router.get("/products", listProducts);

router.get("/", (req, res) => {
    res.send("product catalog home");
});

router.get("/productstesing", (req, res) => {
    res.send("product listing api");
});

module.exports = router;
 