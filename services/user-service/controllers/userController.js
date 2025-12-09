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
      res.send({"Data_inserted": user,"token": req.token});
   }catch(err){
      console.log({"Error_register": err});
   }
};

module.exports = registerUser;