// frontend/src/pages/SearchPage/SearchPage.js
import React, { useEffect, useState, useContext } from "react";
import "./SearchPage.css";
import { MediaPlayerContext } from "../../context/MediaPlayerContext";

const SearchPage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const { playSong } = useContext(MediaPlayerContext);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const url = query.trim()
          ? `http://localhost:5000/api/songs/search?q=${encodeURIComponent(query)}`
          : "http://localhost:5000/api/songs/songs";

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch songs.");
        const data = await response.json();
        setSongs(data);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("An error occurred while fetching songs.");
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchSongs, 400);
    return () => clearTimeout(debounce);
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
        <p className="error">{error}</p>
      ) : songs.length === 0 ? (
        <p>No songs found.</p>
      ) : (
        <div className="song-grid">
          {songs.map((song) => (
            <div
              key={song._id}
              className="song-card"
              onClick={() => playSong(song)}
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
