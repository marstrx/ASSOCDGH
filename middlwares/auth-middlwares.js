const jwt = require("jsonwebtoken");




const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success:false, message:"Access denied, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_CODE);
    req.userInfo = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success:false, message:"Invalid token" });
  }
};


module.exports = authMiddleware;
