const jwt = require("jsonwebtoken");

const userAuth =async(req,res,next)=>{
    const {token} = req.cookies ;


    if(!token){
        return res.json({
            success:false,
            message :"Not Authorized login again"
        })
    }

    try {
        const decodeToken = await jwt.verify(token ,process.env.JWT_SECRET_CODE);
        if(decodeToken.id){
            req.body.userId = decodeToken.id
        }else{
            return res.json({
            success:false,
            message :"Not Authorized login again"
        })

        }

        next();

    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }

}


module.exports = userAuth ;