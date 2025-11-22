const express = require("express");
const router = express.Router();

router.get('/', (req, res) =>{
    res.send("user service working fine");
});

router.get('/api/v1',(req, res) => {
    res.send("api/v1 API is working");
});

module.exports = router;