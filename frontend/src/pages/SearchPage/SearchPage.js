import React, { useEffect, useState } from "react";
import "./SearchPage.css";

const SearchPage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const url = query.trim()
          ? `http://localhost:5000/api/songs/search?q=${encodeURIComponent(query)}`
          : `http://localhost:5000/api/songs/songs`;

        const response = await fetch(url);
        const data = await response.json();
        setSongs(data);
      } catch (err) {
        console.error("Failed to fetch songs:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSongs();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="search-page">
      <h1>Search Songs</h1>
      <input
        type="text"
        placeholder="Search by title, artist, tags or genre..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setLoading(true);
        }}
        className="search-input"
      />

      {loading ? (
        <p>Loading...</p>
      ) : songs.length === 0 ? (
        <p>No songs found.</p>
      ) : (
        <div className="song-grid">
          {songs.map((song) => (
            <div key={song._id} className="song-card">
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
