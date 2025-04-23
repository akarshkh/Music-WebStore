const express = require("express");
const mongoose = require("mongoose");
const Song = require("../models/Song");

const router = express.Router();

// Fetch All Songs API
router.get("/songs", async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch songs." });
  }
});

// Search Songs API
router.get("/search", async (req, res) => {
  const query = req.query.q;
  const regex = new RegExp(query, "i");

  try {
    const songs = await Song.find({
      $or: [
        { songTitle: regex },
        { songArtist: regex },
        { tags: regex },
        { genre: regex },
      ],
    });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: "Search failed." });
  }
});

// ✅ Get all songs in an album
router.get("/albums/:albumName", async (req, res) => {
  try {
    const albumName = decodeURIComponent(req.params.albumName);
    const songs = await Song.find({ album: albumName });
    res.status(200).json(songs);
  } catch (err) {
    console.error("❌ Error fetching songs for album:", err);
    res.status(500).json({ message: "Failed to fetch songs", error: err.message });
  }
});
// ✅ Get all unique album names
router.get("/albums", async (req, res) => {
  try {
    const albums = await Song.distinct("album");
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch albums." });
  }
});


module.exports = router;
