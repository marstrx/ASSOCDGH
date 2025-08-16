const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();
const transporter = require("../config/nodemailer");
const crypto = require("crypto");



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


        // sending welcome email
        const mailOptions ={
            from : process.env.SENDER_EMAIL,
            to :email,
            subject :"welcome to ASSOCDGH",
            text :`Welcome to ASSOCDGH your account has been created with this email id : ${email}`
        }; 

        await transporter.sendMail(mailOptions);

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
            message: "Login Successed",
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
            message :"Logout Successed"
        })
    } catch (error) {
        res.json({
            success :false,
            message :error.message
        })
    }
}


//  verify otp
const sendVerifyOtp=async(req,res)=>{
    try {
        const {userId} = req.body ;

        const user = await User.findById(userId);
        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }
        if(user.isAccountVerified){
            return res.json({
                success :false,
                message :"Account is Already Verified"
            })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000) );
        user.verifyOtp = otp ;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 *60 *1000 ;

        user.save();
        const mailOptions ={
            from : process.env.SENDER_EMAIL,
            to :user.email,
            subject :"Account Verification",
            text :`Your Verification Code is ${otp} Verify Your Account Using This Code`
        }; 

        await transporter.sendMail(mailOptions);

        res.json({
            success :true,
            message :"Verification Code Sent To Your Email"
        })
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}


//  verify email

const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.json({
            success: false,
            message: "Missing details"
        });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.verifyOtp || user.verifyOtp !== otp) {
            return res.json({
                success: false,
                message: "Invalid code"
            });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: "Verification code is expired"
            });
        }

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({
            success: true,
            message: "Email verified successfully"
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};


// check if the user is authenticated
const isAuthenticated =async(req,res)=>{
    try {
        return res.json({
            success:true
        })
    } catch (error) {
        res.json({
            success:false,
            message :error.message
        })
    }
}



// send reset password code 
const sendResetOtp =async(req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.json({
            success:false,
            message:"Email is required"
        })
    }

    try {
        const user = await User.findOne({email});
        if(!user){
            return res.json({
                success:false,
                message:"User not found"
            })
        }

        const otp = crypto.randomInt(100000,1000000).toString();
        user.resetOtp = otp;
        user.verifyOtpExpireAt = Date.now() +15 *60 *1000
        await user.save();

        const mailOptions={
            from :process.env.SENDER_EMAIL,
            to :user.email,
            subject :"Reset Password",
            text :`you resete password code is ${otp}`
        };

        await transporter.sendMail(mailOptions);
        res.json({
            success:true,
            message :"Reset code sent successfully"
        })
    } catch (error) {
        res.json({
            success:false,
            message :error.message
        })
    }

}


// reset user password 
const resetPassword = async(req,res)=>{
    const {email ,otp ,newPassword} = req.body ;
    if(!email || !otp || !newPassword){
        return res.json({
            success:false, 
            message:"Missing fields"
        })
    }



    try {
        const user = await User.findOne({email});
        if(!user){
            return res.json({
                success:false,
                message:"email not found"
            })
        }

        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({
                success:false,
                message:"inavlide code"
            })
        }
        if(user.verifyOtpExpireAt <Date.now()){
            return res.json({
                success:false,
                message:"expired code "
            })
        }

        const hashedPassword =await bcrypt.hash(newPassword,10);
        user.password = hashedPassword ;
        user.verifyOtpExpireAt =0;
        user.resetOtp ="";

        await user.save();

        return res.json({
            success:true,
            message:"password changed successfully"
        })
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}


module.exports ={register ,login ,logout ,sendVerifyOtp ,verifyEmail ,isAuthenticated ,sendResetOtp, resetPassword} ;