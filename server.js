const express = require("express");
const connectToDb = require("./config/db");
const app = express();
require('dotenv').config();
const authRoutes = require("./routes/auth-routes");




app.use(express.json());

app.use("/api/auth" ,authRoutes); 


connectToDb();


app.listen(process.env.PORT,()=>{
    console.log("server is running on port",process.env.PORT);
    
})
