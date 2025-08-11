const mongoose = require("mongoose");
require('dotenv').config();


const connectToDb = async()=>{
    try {
        await mongoose.connect(process.env.DBS_INFOS);
        console.log("dbs connected successfully");
        
    } catch (error) {
        console.error("Err while connecting to the dbs ->" ,error);
        process.exit(1); 
        
    }
}

module.exports = connectToDb;