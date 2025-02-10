const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const generateToken = require("../utils/generateToken");


// @desc Register user
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body;
        console.log(req.body);

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, mobile });

        if (!user) return res.status(400).json({ message: "Invalid user data received"});
        else if (user) return res.status(201).json({ 
            message: "User registered successfully", token: generateToken(user._id) 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// @desc Login user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid user" });
        }
        else if (user && (await bcrypt.compare(password, user.password))) {
            return res.status(201).json({ 
                message: "User logged in successfully", token: generateToken(user._id) 
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Guest Login
exports.guestLogin = async (req, res) => {
    try {
        const guestUser = await User.create({
            name: req.body.name || `Guest_${Date.now()}`,
            email: `guest_${Date.now()}@guest.com`,       
            password: await bcrypt.hash("guestpassword", 10), 
            isGuest: true,                              
            mobile: req.body.mobile || "1234567890"         
        });

        res.json({ 
            message: "Guest User logged in successfully", 
            token: generateToken(guestUser._id),
        });
        console
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc Logout user
exports.logoutUser = (req, res) => {
    res.json({ message: "User logged out" });
};


// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields if provided
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            message: "Profile updated successfully!",
            name: updatedUser.name,
            email: updatedUser.email,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};




