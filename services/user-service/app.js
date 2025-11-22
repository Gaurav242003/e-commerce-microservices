require("dotenv").config();
const express = require("express");
const route = require("./routes/route");
const app = express();


app.use(express.json());
app.use('/', route);


const PORT = process.env.PORT;

app.listen( PORT , () => {
    console.log(`Server is running at Port ${PORT}`);
});

module.exports = app;

