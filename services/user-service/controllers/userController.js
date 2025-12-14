const { json } = require("express");
const User = require("../models/users");

const registerUser = async (req, res) => {
   try{

      const {name, email, password, phone_no} = req.body
      const user = new User({
        name: name,
        email: email,
        password: password,
        phone_no: phone_no

      })

      await user.save();
      return res.status(200).json({"Data_inserted": user});
   }catch(err){
      console.log({"Error_register": err});
   }
};

const loginUser =  async (req, res) => {
   try{
      const {email, password} = req.body;
      const user = await User.findOne({email: email});
      if(!user){
         return res.status(404).json({message : "No user found"})
      }

      if(user.password == password){
        return res.status(200).json({
           message: "logged In",
           payload: req.body
        })
      }else{
         return res.status(401).json({message: "Incorrect Password"})
      }

   }catch(err){
      console.log({"Error_login": err});
   }
}

const authUser = async (req, res) => {
   return res.status(200).json({
      "isLoggedIn": true,
      "response": req.body
      });
}

const myProfile = async (req, res) => {
   try{
      const email = req.user.email;
      const user = await User.findOne({email: email}).select("-password");
      if(!user){
         return res.status(404).json({"message": "No user found"});
      }

      return res.status(200).json({"user": user});

   }catch(err){
      console.log({"myProfile" : err});
      return res.status(500).json({
       message: "Internal server error"
      });
   }
}

const updateProfile = async (req, res) => {
   try{
      const email = req.body.payload.email;
      const {name, number} = req.body;
      await User.updateOne({"email": email}, {
         name: name,
         phone_no: number
      });

      res.status(200).json({"message": "Success"});
   }catch(err){
      console.log({"message": err});
   }
}

const addAddress = async (req, res) =>{
   try{
      const email = req.body.payload.email;
      const {address} = req.body;
      const user = await User.findOne({"email": email});
      const u_address = user.address;
      u_address.push(address);

      await User.updateOne({"email": email},{
         address: u_address
      })

   }catch(err){
      console.log({"message": err});
   } 
}

const deleteAddress = async (req, res) =>{
   try{
      const email = req.body.payload.email;
      const {address} = req.body;
      const user = await User.findOne({"email": email});
      const u_address = user.address;
      u_address.pop();

      await User.updateOne({"email": email},{
         address: u_address
      })

   }catch(err){
      console.log({"message": err});
   } 
}

module.exports = {registerUser, loginUser, authUser, myProfile, updateProfile, addAddress, deleteAddress};