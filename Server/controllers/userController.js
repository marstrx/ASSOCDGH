const User = require("../models/userModel");


const getUserData=async(req,res)=>{
    try {
        const {userId} = req.body ;
        const user = await User.findById(userId);
        if(!user){
            return res.json({
                success:false,
                message:"user not found"
            })
        };

        res.json({
            success:true,
            userData:{
                name :user.name,
                email :user.email,
                phone :user.phone,
                totalAmount :user.totalAmount,
                isAccountVerified :user.isAccountVerified

            }
        })
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}

module.exports = getUserData ;