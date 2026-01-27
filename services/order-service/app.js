require('dotenv').config();

const express = require('express');
const router = require('./routes/route');
const {pool} = require('./database/connectionDB');
const app = express();


app.use(express.json());
app.use('/', router);
const PORT = process.env.PORT || 4002;
pool.query('SELECT 1');
app.listen(PORT, () => {
    console.log(`order-service is running on port ${PORT}`);
})