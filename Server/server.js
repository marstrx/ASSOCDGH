const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
require('dotenv').config();
const connectDb = require("./config/db");
const authRouter =require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");




app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}));


connectDb();

app.use("/api/auth" ,authRouter);
app.use("/api/user" ,userRouter);


app.listen(process.env.PORT,()=>{
    console.log("server is running on port",process.env.PORT);
    
})
