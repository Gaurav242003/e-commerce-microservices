const express = require("express");
const router = express.Router();
const mongoose = require("../database/connectiondb");
const {createProduct} = require("../controllers/productController");
const {authorizeAdmin, authVerify} = require("../middlewares/auth");

router.post("/products", authVerify, authorizeAdmin, createProduct );

router.get("/", (req, res) => {
    res.send("product catalog home");
});

router.get("/products", (req, res) => {
    res.send("product listing api");
});

module.exports = router;
 