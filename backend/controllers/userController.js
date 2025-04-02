// backend/controllers/usercontroller.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register user
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ token, username: newUser.username, profilePic: newUser.profilePic });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, username: user.username, profilePic: user.profilePic });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get user data
exports.getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ username: user.username, profilePic: user.profilePic });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
