require('dotenv').config();
const express = require('express');
const router = require('./routes/route');
const app = express();

app.use(express.json());
app.use('/', router);
const PORT = process.env.PORT || 3004;

app.listen(PORT, ()=>{
    console.log('Payment microservice is running on port', PORT);
});