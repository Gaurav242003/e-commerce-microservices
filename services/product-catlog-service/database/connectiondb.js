require("dotenv").config();
const mongoose = require("mongoose");

const connectToDB = async () => {
    try{
       await mongoose.connect(process.env.CONNECTION_URL);
       console.log("database connected successfully");
    }catch(err){
       console.log(err);
    }
}
connectToDB();
module.exports = mongoose;