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


//  login 

const login = async (req,res)=>{
    const {email,password} =req.body ;

    if(!email || !password){
        res.json({
            success:false,
            message :"Email and password are required"
        })
    }
    try {
        const user = await User.findOne({email});

        if(!user){
            return res.json({
                success:false ,
                message :"Invalid email"
            })
        }

        const isMatch = await bcrypt.compare(password ,user.password);

        if(!isMatch){
            return res.json({
                success :false ,
                message :"Wrong password"
            })
        }

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

        res.status(200).json({
            success: true,
            message: "login successed",
            user: {
                name: user.name
            },
        });

    } catch (error) {
        res.json({
            success:false,
            message : error.message
        })
    }
}



//  logout

const logout =async(req,res)=>{
    try {
        res.clearCookie("token",{
            httpOnly :true,
            secure :process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "none" :"strict"
        });


        res.json({
            success :true,
            message :"logout successed"
        })
    } catch (error) {
        res.json({
            success :false,
            message :error.message
        })
    }
}

module.exports ={register}