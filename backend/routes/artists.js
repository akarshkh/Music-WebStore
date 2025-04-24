const express = require("express");
const router = express.Router();
const Song = require("../models/Song");

// GET all unique artist names
router.get("/artists", async (req, res) => {
  try {
    const artists = await Song.distinct("songArtist");
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch artists" });
  }
});

// GET songs by a specific artist
router.get("/artist/:artistName", async (req, res) => {
  try {
    const songs = await Song.find({ songArtist: req.params.artistName });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch songs for artist" });
  }
});

module.exports = router;
