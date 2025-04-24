// backend/controller/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Function to generate tokens
const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" }); // 1-hour session
    const refreshToken = crypto.randomBytes(64).toString('hex'); // Secure refresh token
    return { accessToken, refreshToken };
};

// ✅ Register user
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        const { accessToken, refreshToken } = generateTokens(newUser._id);
        newUser.refreshToken = refreshToken;
        await newUser.save();

        res.status(201).json({ 
            accessToken, 
            refreshToken, 
            username: newUser.username, 
            email: newUser.email,
            profilePic: newUser.profilePic || null 
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        const { accessToken, refreshToken } = generateTokens(user._id);
        user.refreshToken = refreshToken;
        await user.save();

        res.json({ 
            accessToken, 
            refreshToken, 
            username: user.username, 
            email: user.email,
            profilePic: user.profilePic || null 
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Refresh access token
exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

    try {
        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(403).json({ message: "Invalid refresh token" });

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error("Refresh Token Error:", error);
        res.status(401).json({ message: "Invalid or expired refresh token" });
    }
};

// ✅ Logout user
exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

        const user = await User.findOne({ refreshToken });
        if (user) {
            user.refreshToken = null;
            await user.save();
        }

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Get user data
exports.getUserData = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ 
            username: user.username, 
            email: user.email,
            profilePic: user.profilePic || null 
        });
    } catch (error) {
        console.error("Get User Data Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
