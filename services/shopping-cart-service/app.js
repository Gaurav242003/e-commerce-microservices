require('dotenv').config();
const express = require('express');
const router = require('./routes/route');
const app = express();

app.use(express.json());
app.use('/', router);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
    console.log('Shopping Cart Service is running on port ' + PORT);
})