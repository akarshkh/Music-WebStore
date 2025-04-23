// backend/middleware/authenticate.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("Token from header:", token); // Log the token to inspect

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Attach userId to the request
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
