const express = require('express');
const router = express.Router();


router.get('/health', (req, res) =>{
    res.status(200).send('Order Service is healthy');
})


module.exports = router;
