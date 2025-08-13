const adminMiddleware = (req, res, next) => {
  if (req.userInfo && req.userInfo.role == "admin") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "You are not authorized to see this",
  });
};

module.exports = adminMiddleware;
