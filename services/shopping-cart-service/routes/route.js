const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.send('Shopping Cart Service is up and running');
})

module.exports = router;