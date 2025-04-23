import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./SearchPage.css";
import { MediaPlayerContext } from "../../context/MediaPlayerContext";
import { FaHeart, FaPlay, FaPause } from "react-icons/fa";

const SearchPage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const { playSong, currentSong, isPlaying, togglePlayPause } = useContext(MediaPlayerContext);

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

  const handleLikeClick = (e, songId) => {
    e.stopPropagation();
    alert("Liked song: " + songId);
  };

  const handlePlayPause = (e, song) => {
    e.stopPropagation();
    if (currentSong?._id === song._id) {
      togglePlayPause();
    } else {
      playSong(song);
    }
  };

  const handleGenreClick = (genre) => {
    setQuery(genre);
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
          {query.trim() ? `Search Results for "${query.trim()}"` : "All Songs"}
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
                <div className="song-actions">
                  <button
                    className="like-button"
                    onClick={(e) => handleLikeClick(e, song._id)}
                  >
                    <FaHeart />
                  </button>
                  <button
                    className="play-button"
                    onClick={(e) => handlePlayPause(e, song)}
                  >
                    {currentSong?._id === song._id && isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                </div>

                <h3>{song.songTitle}</h3>

                <p className="artist">
                  <Link to={`/artist/${song.songArtist}`} className="artist-link">
                    {song.songArtist}
                  </Link>
                </p>
                <br />
                <p className="album">
                  <Link to={`/album/${song.album}`} className="album-link">
                    {song.album}
                  </Link>
                </p>

                <p
                  className="genre"
                  onClick={() => handleGenreClick(song.genre)}
                >
                  #{song.genre}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
