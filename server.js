const express = require("express");
const connectToDb = require("./config/db");
const app = express();
require('dotenv').config();
const authRoutes = require("./routes/auth-routes");
const cookieParser = require("cookie-parser");
const homePageRoutes = require("./routes/homePage");




app.use(express.json());

app.use(cookieParser());

app.use("/api/auth" ,authRoutes); 

app.use("/api/user" ,homePageRoutes); 
connectToDb();


app.listen(process.env.PORT,()=>{
    console.log("server is running on port",process.env.PORT);
    
})
