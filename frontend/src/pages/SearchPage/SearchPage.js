import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./SearchPage.css";
import { MediaPlayerContext } from "../../context/MediaPlayerContext";
import { FaPlay, FaPause } from "react-icons/fa";
import LikeButton from "../../pages/LikeButton/LikeButton";

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

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="search-error">{error}</p>
      ) : (
        <div className="search-song-grid">
          {songs.map((song) => (
            <div key={song._id} className="search-song-card">
              <div className="search-cover">
                {song.coverImage ? (
                  <img
                    src={`http://localhost:5000/api/upload/files/${song.coverImage}`}
                    alt={song.songTitle}
                    className="search-cover-image"
                  />
                ) : (
                  <div className="search-cover-placeholder">🎵</div>
                )}
              </div>

              <div className="search-song-info">
                <div className="search-song-actions">
                  <LikeButton songId={song._id} />
                  <button className="search-play-button" onClick={(e) => handlePlayPause(e, song)}>
                    {currentSong?._id === song._id && isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                </div>

                <h3>{song.songTitle}</h3>
                <p className="search-artist">
                  <Link to={`/artist/${song.songArtist}`} className="search-artist-link">
                    {song.songArtist}
                  </Link>
                </p>
                <p className="search-album">
                  <Link to={`/album/${song.album}`} className="search-album-link">
                    {song.album}
                  </Link>
                </p>
                <br />
                <p className="search-genre" onClick={() => handleGenreClick(song.genre)}>
                  #{song.genre}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add a spacer here */}
      <div style={{ height: "1px" }}></div>
    </div>
  );
};

export default SearchPage;
