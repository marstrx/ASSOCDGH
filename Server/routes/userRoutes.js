const express = require("express");
const userRouter = express.Router();
const getUserData = require("../controllers/userController");
const userAuth = require("../middleware/userAuth");



userRouter.get("/user-data",userAuth, getUserData);


module.exports = userRouter;