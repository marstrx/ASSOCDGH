const express = require("express");
const dashboardRoutes = express.Router();
const authMiddleware = require("../middlwares/auth-middlwares");
const adminMiddleware = require("../middlwares/admin-middlware");

dashboardRoutes.get("/dashboard",authMiddleware,adminMiddleware ,(req,res)=>{
    res.json({
        message:"hi admin"
    })
})


module.exports = dashboardRoutes ;