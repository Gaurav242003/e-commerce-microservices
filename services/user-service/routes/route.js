const express = require("express");
const router = express.Router();
const mongoose = require("../database/connectionDB");
const registerUser = require("../controllers/userController");

router.post('/register', registerUser);

router.get('/',(req, res) => {
    res.send("Home");
});

router.get('/api/v1',(req, res) => {
    res.send("api/v1 API is working");
});

module.exports = router;