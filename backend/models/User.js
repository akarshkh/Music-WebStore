const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: null },
    refreshToken: { type: String, default: null },
    theme: { type: String, default: "dark" }, // Default theme
    accent: { type: String, default: "accent2" }, // Default accent
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError during dev with hot reload
module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
