const bcryptjs = require("bcryptjs");
const User = require("../models/user-model");
const {validationResult} = require("express-validator");

const register = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const userExists = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username }]
        });
        if (userExists) {
            return res.status(409).json({
                success: false,
                message: "This username or email already exists"
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = new User({
            username,
            email: email.toLowerCase(),
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong on our side"
        });
    }
};

module.exports = { register };
