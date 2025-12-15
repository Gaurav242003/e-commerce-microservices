const jwt = require("jsonwebtoken");

const authVerify = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing"
      });
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.SECRET_KEY);

    req.user = payload;
    next();

  } catch (err) {
    console.error("authVerify error:", err.message);
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};


module.exports = {authVerify};