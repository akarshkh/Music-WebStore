const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const Playlist = require("../models/playlist");
const Song = require("../models/Song");

// POST /api/playlists/favorites/:id - Add song to user's favorites playlist
router.post("/favorites/:id", authenticate, async (req, res) => {
  const userId = req.userId;
  const songId = req.params.id;

  try {
    // Find or create the user's favorites playlist
    let playlist = await Playlist.findOne({ user: userId, name: "Favorites" });
    if (!playlist) {
      playlist = new Playlist({ user: userId, name: "Favorites", songs: [] });
    }

    // Avoid duplicates
    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }

    res.status(200).json({ message: "Song added to favorites." });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/playlists/favorites - Get user's favorite songs
router.get("/favorites", authenticate, async (req, res) => {
  const userId = req.userId;

  try {
    const playlist = await Playlist.findOne({ user: userId, name: "Favorites" }).populate("songs");
    if (!playlist) return res.status(200).json([]); // Return empty array if no playlist

    res.status(200).json(playlist.songs);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/playlists/favorites/:id - Remove song from favorites
router.delete("/favorites/:id", authenticate, async (req, res) => {
  const userId = req.userId;
  const songId = req.params.id;

  try {
    const playlist = await Playlist.findOne({ user: userId, name: "Favorites" });
    if (!playlist) return res.status(404).json({ message: "Favorites playlist not found" });

    playlist.songs = playlist.songs.filter(id => id.toString() !== songId);
    await playlist.save();

    res.status(200).json({ message: "Song removed from favorites." });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
