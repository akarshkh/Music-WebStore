const express = require("express");
const router = express.Router();
const Song = require("../models/Song"); // Assuming songs have album names

// GET all unique albums
router.get("/", async (req, res) => {
  try {
    const albums = await Song.distinct("songAlbum");
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch albums" });
  }
});

// GET all songs in a specific album
router.get("/:albumName", async (req, res) => {
  try {
    const albumName = decodeURIComponent(req.params.albumName);
    const songs = await Song.find({ songAlbum: albumName });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch songs for this album" });
  }
});

module.exports = router;
