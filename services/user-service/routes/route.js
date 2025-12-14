const express = require("express");
const router = express.Router();
const {registerUser, loginUser, authUser, myProfile, updateProfile, addAddress, deleteAddress} = require("../controllers/userController");
const { authVerify, authSign } = require("../middlewares/auth");



router.get('/',(req, res) => {
    res.send("Home");
});

router.post('/signup', registerUser);
router.get('/isLoggedIn', authVerify, authUser);
router.get('/login', authSign, loginUser);
router.get('/myProfile', authVerify, myProfile);
router.put('updateProfile', authVerify, updateProfile);
router.post('addAdress', authVerify, addAddress);
router.delete('deleteAdress', authVerify, deleteAddress);

module.exports = router;