// frontend/src/pages/SearchPage/SearchPage.js
import React, { useEffect, useState, useContext } from "react";
import "./SearchPage.css";
import { MediaPlayerContext } from "../../context/MediaPlayerContext";

const SearchPage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null); // For error state
  const { setCurrentSong } = useContext(MediaPlayerContext);

  useEffect(() => {
    const fetchSongs = async () => {
      if (!query.trim()) {
        // Fetch all songs when query is empty
        try {
          const response = await fetch("http://localhost:5000/api/songs/songs");
          if (!response.ok) {
            throw new Error("Failed to fetch songs.");
          }
          const data = await response.json();
          setSongs(data);
        } catch (err) {
          console.error("Failed to fetch songs:", err);
          setError("An error occurred while fetching songs. Please try again.");
        }
      } else {
        // Search songs when query is non-empty
        try {
          const url = `http://localhost:5000/api/songs/search?q=${encodeURIComponent(query)}`;
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Failed to fetch songs.");
          }
          const data = await response.json();
          setSongs(data);
        } catch (err) {
          console.error("Failed to fetch songs:", err);
          setError("An error occurred while fetching songs. Please try again.");
        }
      }
      setLoading(false);
    };

    const delayDebounce = setTimeout(fetchSongs, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="search-page">
      <h1>Search Songs</h1>
      <input
        type="text"
        placeholder="Search by title, artist, tags, or genre..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setLoading(true);
        }}
        className="search-input"
      />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p> // Display error message
      ) : songs.length === 0 ? (
        <p>No songs found.</p>
      ) : (
        <div className="song-grid">
          {songs.map((song) => (
            <div
              key={song._id}
              className="song-card"
              onClick={() => setCurrentSong(song)} // Fix here to set the current song
            >
              <div className="cover">
                {song.coverImage ? (
                  <img
                    src={`http://localhost:5000/api/upload/files/${song.coverImage}`}
                    alt={song.songTitle}
                    className="cover-image"
                  />
                ) : (
                  <div className="cover-placeholder">🎵</div>
                )}
              </div>
              <div className="song-info">
                <h3>{song.songTitle}</h3>
                <p>Artist: {song.songArtist}</p>
                <p>Album: {song.album}</p>
                <p>Genre: {song.genre}</p>
                <audio
                  controls
                  src={`http://localhost:5000/api/upload/files/${song.songFile}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
