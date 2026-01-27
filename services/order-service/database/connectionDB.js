require('dotenv').config();
const mongoose = require("mongoose");

const connectToDB = async () =>{
  try {
     await mongoose.connect(process.env.CONNECTION_STRING);
     console.log("Database connected successfully")
  } catch (error) {
    
     console.log(error);
  }
}

connectToDB();

module.exports = mongoose;
