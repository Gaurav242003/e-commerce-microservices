const mongoose = require("../database/connectionDB");

const Users = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone_no: Number,
    address: [String],
    cart: [Number],
})

const User = mongoose.model("User", Users);

module.exports = User;