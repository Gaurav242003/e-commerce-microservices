const express = require("express");
const router = express.Router();
const mongoose = require("../database/connectiondb");

router.get("/", (req, res) => {
    res.send("product catalog home");
});

router.get("/products", (req, res) => {
    res.send("product listing api");
});

module.exports = router;
 