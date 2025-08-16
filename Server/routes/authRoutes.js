const express = require("express");
const authRouter = express.Router();
const {register,login,logout ,sendVerifyOtp, verifyEmail} = require("../controllers/authController");
const userAuth = require("../middleware/userAuth");


authRouter.post("/register" ,register);
authRouter.post("/login" ,login);
authRouter.post("/logout" ,logout);

authRouter.post("/send-verify-otp" ,userAuth,sendVerifyOtp);
authRouter.post("/verify-account" ,userAuth,verifyEmail);



module.exports = authRouter ;