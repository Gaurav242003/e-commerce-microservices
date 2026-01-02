const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTION_STRING, (err) => {
    if(!err){
        console.log("Connected to database successfully");
    }else{
        console.log("Database connection Failed" + err);
    }
})

module.exports = mongoose;