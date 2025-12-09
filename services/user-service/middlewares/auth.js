const jwt = require("jsonwebtoken");

const autheVerify = (req, res, next) => {
    try{
       const token = req.body.token;
       jwt.verify(token,process.env.SECRET_KEY,(err, payload) =>{
          if(err){
            console.log(err);
            return res.status(401).send("Invalid Token");
          }
        
          req.payload = payload;
          next();
        
    });
    }catch(err){
       console.log("gky" + err)
    }
    
};

const authSign = (req, res, next) => {
    jwt.sign(req.body, process.env.SECRET_KEY, (err, token) =>{
          if(err){
            console.log(err);
            return res.status(401).send("Try again");
          }

          req.token = token;
          next();
    });
};

module.exports = {autheVerify, authSign};