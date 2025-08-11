const express = require("express");
const connectToDb = require("./config/db");
const app = express();
require('dotenv').config();




app.use(express.json());



connectToDb();


app.listen(process.env.PORT,()=>{
    console.log("server is running on port",process.env.PORT);
    
})
