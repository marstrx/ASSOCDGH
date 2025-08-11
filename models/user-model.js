const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    firstName:{
        type:String
    },
    lasttName:{
        type:String
    },
    phone:{
        type:String
    },
    totalAmount:{
        type:Number ,
        default:0
    },
    paidAmount:{
        type:Number,
        default:0
    },
    role:{
        type:String,
        default:"user"
    }
});


module.exports = mongoose.model("User",userSchema);