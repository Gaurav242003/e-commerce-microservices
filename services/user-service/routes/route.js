const express = require("express");
const router = express.Router();
const mongoose = require("../database/connectionDB");
const registerUser = require("../controllers/userController");
const { autheVerify, authSign } = require("../middlewares/auth");


// router.post('/register', registerUser);

router.post('/signup', authSign, registerUser);


router.get('/',(req, res) => {
    res.send("Home");
});

router.get('/api/v1', autheVerify, (req, res) => {
    res.send("api/v1 API is working");
});

module.exports = router;