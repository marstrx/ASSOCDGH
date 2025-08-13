const express = require("express");
const homePageRoutes = express.Router();
const authMiddleware = require("../middlwares/auth-middlwares");


homePageRoutes.get("/home",authMiddleware ,(req,res)=>{
    res.json({
        message:"hell user"
    })
})


module.exports = homePageRoutes ;