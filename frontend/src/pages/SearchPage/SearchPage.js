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
          : "http://localhost:5000/api/songs/songs?limit=10";

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

  const addToPlaylist = async (songId) => {
    try {
      const response = await fetch("http://localhost:5000/api/playlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ songId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add to playlist");
      alert("Song added to playlist!");
    } catch (err) {
      console.error(err);
      alert("Error adding song to playlist.");
    }
  };

  return (
    <div className="search-page">
      <h2>Search Songs</h2>
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

      {!loading && !error && (
        <h2 className="song-section-title">
          {query.trim()
            ? `Search Results for "${query.trim()}"`
            : "Latest Songs"}
        </h2>
      )}

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
              <button
                className="add-button"
                onClick={(e) => {
                  e.stopPropagation();
                  addToPlaylist(song._id);
                }}
              >
                +
              </button>
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
                <p className="artist">Artist: {song.songArtist}</p>
                <p className="hover-info">Album: {song.album}</p>
                <p className="hover-info">Genre: {song.genre}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;