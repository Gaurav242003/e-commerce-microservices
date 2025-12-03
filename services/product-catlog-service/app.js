require("dotenv").config();
const express = require("express");
const router = require("./routes/route");

const app = express();

app.use(express.json());
app.use("/", router);
const PORT = process.env.PORT;
app.listen(PORT,(err) =>{
    if(err){
        console.log(err);
    }else{
        console.log(`Server is runnning on PORT: ${PORT}`);
    }
});