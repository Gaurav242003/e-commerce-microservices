require('dotenv').config();
const app = require('express');

app.use(express.json());;

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log('Shopping Cart Service is running on port ' + PORT);
})