import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Playlists.css";
import { FaPlay, FaPause, FaTrash } from "react-icons/fa";
import { MediaPlayerContext } from "../../context/MediaPlayerContext";

const Playlist = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playSong, currentSong, isPlaying, togglePlayPause } = useContext(MediaPlayerContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token found. Please log in.");

        const response = await fetch("http://localhost:5000/api/playlists/favorites", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch playlist.");
        const data = await response.json();
        setSongs(data);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("An error occurred while fetching the playlist. " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, []);

  const handlePlayPause = (song) => {
    if (currentSong?._id === song._id) {
      togglePlayPause();
    } else {
      playSong(song);
    }
  };

  const handleRemoveFromPlaylist = async (songId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return alert("No token found. Please log in.");

      const response = await fetch(`http://localhost:5000/api/playlists/favorites/${songId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to remove song from favorites.");
      setSongs(songs.filter((song) => song._id !== songId));
    } catch (err) {
      console.error("Error removing from playlist:", err);
      alert("Failed to remove song from playlist. " + err.message);
    }
  };

  const handleGenreClick = (genre) => {
    navigate(`/search?q=${genre}`);
  };

  if (loading) {
    return (
      <div className="liked-playlist-page">
        <h2>Your Favorite Songs</h2>
        <p>Loading your playlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="liked-playlist-page">
        <h2>Your Favorite Songs</h2>
        <p className="liked-error">{error}</p>
        {!localStorage.getItem("accessToken") && (
          <p>
            Please{" "}
            <Link to="/" onClick={() => document.querySelector(".profile-button button").click()}>
              log in
            </Link>{" "}
            to view your favorites.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="liked-playlist-page">
      <h2>Your Favorite Songs</h2>
      <p className="liked-song-count">Total Songs: {songs.length}</p>
      {songs.length === 0 ? (
        <div className="liked-empty-playlist">
          <p>Your playlist is empty. Start adding your favorite songs!</p>
          <Link to="/search" className="liked-search-link">
            Browse Music
          </Link>
        </div>
      ) : (
        <div className="liked-song-grid">
          {songs.map((song) => (
            <div key={song._id} className="liked-song-card">
              <div className="liked-cover">
                {song.coverImage ? (
                  <img
                    src={`http://localhost:5000/api/upload/files/${song.coverImage}`}
                    alt={song.songTitle}
                    className="liked-cover-image"
                  />
                ) : (
                  <div className="liked-cover-placeholder">🎵</div>
                )}
              </div>

              <div className="liked-song-info">
                <div className="liked-song-actions">
                <button
                    className="liked-remove-button"
                    onClick={() => handleRemoveFromPlaylist(song._id)}
                    aria-label="Remove from favorites"
                  >
                    <FaTrash />
                  </button>
                  <button
                    className="liked-play-button"
                    onClick={() => handlePlayPause(song)}
                    aria-label={
                      currentSong?._id === song._id && isPlaying ? "Pause song" : "Play song"
                    }
                  >
                    {currentSong?._id === song._id && isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                </div>

                <h3>{song.songTitle}</h3>
                <p className="liked-artist">
                  <Link to={`/artist/${song.songArtist}`} className="liked-artist-link">
                    {song.songArtist}
                  </Link>
                </p>
                <p className="liked-album">
                  <Link to={`/album/${song.album}`} className="liked-album-link">
                    {song.album}
                  </Link>
                </p>

                <p className="liked-genre" onClick={() => handleGenreClick(song.genre)}>
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

export default Playlist;
