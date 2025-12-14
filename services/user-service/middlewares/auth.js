const jwt = require("jsonwebtoken");

const authVerify = (req, res, next) => {
    try{
       const token = req.body.token;
       jwt.verify(token,process.env.SECRET_KEY,(err, payload) =>{
          if(err){
            console.log(err);
            return res.status(401).json({message: "Invalid Token"});
          }
        
          req.user = payload;
          next();
        
    });
    }catch(err){
       console.log(err)
    }
    
};

const authSign = (req, res, next) => {
  try{
      const payload = {
        "email": req.body.email
      }
    jwt.sign(payload, process.env.SECRET_KEY, (err, token) =>{
          if(err){
            console.log(err);
            return res.status(401).send({message: "Try again"});
          }

          req.body.token = token;
          next();
    });

  }catch(err){
    console.log(err);
  }
  
};

module.exports = {authVerify, authSign};