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

module.exports = router;
