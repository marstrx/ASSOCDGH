const bcryptjs = require("bcryptjs");
const User = require("../models/user-model");
const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { username, email, password ,role} = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const userExists = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username }]
        });
        if (userExists) {
            return res.status(409).json({
                success: false,
                message: "This username or email already exists"
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = new User({
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
            role :role || "user"
        });
        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong on our side"
        });
    }
};



const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User with this email does not exist"
            });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }

        const userToken = jwt.sign(
            { username: user.username, email: user.email, role :user.role},
            process.env.SECRET_CODE,
            { expiresIn: "1h" }
        );

         res.cookie("token", userToken, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            sameSite: "strict", 
            maxAge: 60 * 60 * 1000 
        });

        return res.status(200).json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


const logout =(req,res)=>{
    res.clearCookie("token",{
        httpOnly:true,
        secure : process.env.NODE_ENV === "production",
        sameSite :"strict"
    });
    return res.status(200).json({
        success :true,
        message: "Logged out successfully"

    })
}


module.exports = { register ,login ,logout};
