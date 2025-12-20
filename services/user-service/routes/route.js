const express = require("express");
const router = express.Router();
const {registerUser, loginUser, authUser, myProfile, updateProfile, addAddress, deleteAddress} = require("../controllers/userController");
const { authVerify} = require("../middlewares/auth");



router.get('/',(req, res) => {
    res.send("Home");
});

router.post('/signup', registerUser);
router.get('/isLoggedIn', authVerify, authUser);
router.post('/login', loginUser);
router.get('/myProfile', authVerify, myProfile);
router.put('/updateProfile', authVerify, updateProfile);
router.post('/addAddress', authVerify, addAddress);
router.delete('/deleteAddress', authVerify, deleteAddress);

module.exports = router;