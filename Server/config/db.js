const mongoose = require("mongoose");
require("dotenv").config();


const connectDb =async()=>{
    try {
        await mongoose.connect(process.env.DBS_INFOS);
        console.log("DB connected successfully");
        

        
    } catch (error) {
        console.error(error);
        process.exit(0);
        
    }
}


module.exports = connectDb ;