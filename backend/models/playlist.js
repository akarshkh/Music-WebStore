const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "Favorites", // Default name for the playlist
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true, // This makes sure the user is set
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song", // Reference to the Song model
    },
  ],
});

const Playlist = mongoose.model("Playlist", playlistSchema);
module.exports = Playlist;
