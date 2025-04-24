require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Import Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const songRoutes = require("./routes/songs");     // ✅ Only for GET /songs, etc.
const uploadRoutes = require("./routes/upload");  // ✅ Handles /upload-song + /files/:filename
const artistRoutes = require("./routes/artists");
const albumRoutes = require("./routes/albums"); 
const playlistRoutes = require("./routes/playlist"); // New route for playlists

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/api", artistRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/playlists", playlistRoutes);  // Use new playlist routes

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/songs", songRoutes);     // ✅ Only metadata endpoints
app.use("/api/upload", uploadRoutes);  // ✅ Handles uploads only

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Music Web Store!");
});

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/musicDB";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ Global error handlers
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("🔥 Unhandled Rejection:", reason);
});
