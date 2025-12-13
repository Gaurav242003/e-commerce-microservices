const express = require("express");
const router = express.Router();
const {registerUser, loginUser, authUser} = require("../controllers/userController");
const { authVerify, authSign } = require("../middlewares/auth");



router.get('/',(req, res) => {
    res.send("Home");
});

router.post('/signup', registerUser);

router.isLoggedIn('/isLoggedIn', authVerify, authUser);

router.get('/login', authSign, loginUser);

module.exports = router;