const mongoose = require("../database/connectionDB");

const Users = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone_no: Number,
    address: [String],
    cart: [Number],
    role: {type: String, default: "USER"}
})

const User = mongoose.model("User", Users);

module.exports = User;