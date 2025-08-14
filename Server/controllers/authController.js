const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();



const register =async(req,res)=>{
    const {name,email,password,role} = req.body ;
    if(!name || !email || !password){
        return res.json({
            success:false,
            message :"All fields are required"
        });
    }

    try {
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.json({
                success :false ,
                message:"this email is already exists"
            })
        }


        const hashedPassword = await bcrypt.hash(password ,10);

        const user = new User({
            name,
            email,
            password : hashedPassword,
            role : role || "user"
        });

        await user.save();

        const token = jwt.sign({
            id:user._id ,
            name :user.name,
            role:user.role
        },process.env.JWT_SECRET_CODE,{
            expiresIn :"7d"
        });

        // send cookie
        res.cookie("token", token ,{
            httpOnly :true,
            secure :process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "none" :"strict",
            maxAge :7 * 24 *60 *60 *1000
        })


        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        res.json({
            success:false ,
            message :error.message
        })
    }
}






module.exports ={register}