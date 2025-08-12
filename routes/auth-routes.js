const {register} = require("../controllers/auth-controller");
const express = require("express");
const authRoutes = express.Router();
const {check} = require("express-validator");

const registerValidationRules=[
    check("username").notEmpty().withMessage("username is required"),
    check("email").isEmail().withMessage("invalid email"),
    check("password").isLength({min:6}).withMessage("Password must be at least 6 characters long")
]

authRoutes.post("/register",registerValidationRules ,register);


module.exports = authRoutes ;