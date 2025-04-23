import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Playlists.css";
import { FaPlay, FaPause, FaTrash } from "react-icons/fa";
import { MediaPlayerContext } from "../../context/MediaPlayerContext";

const Playlist = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playSong, currentSong, isPlaying, togglePlayPause } = useContext(MediaPlayerContext);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await fetch("http://localhost:5000/api/playlists/favorites", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch playlist.");
        }

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

      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/playlists/favorites/${songId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to remove song from favorites.");

      setSongs(songs.filter((song) => song._id !== songId));
    } catch (err) {
      console.error("Error removing from playlist:", err);
      alert("Failed to remove song from playlist. " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="playlist-page">
        <h2>Your Favorite Songs</h2>
        <p>Loading your playlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="playlist-page">
        <h2>Your Favorite Songs</h2>
        <p className="error">{error}</p>
        {!localStorage.getItem("accessToken") && (
          <p>Please <Link to="/" onClick={() => document.querySelector('.profile-button button').click()}>log in</Link> to view your favorites.</p>
        )}
      </div>
    );
  }

  return (
    <div className="playlist-page">
      <h2>Your Favorite Songs</h2>
      <p className="song-count">Total Songs: {songs.length}</p>
      {songs.length === 0 ? (
        <div className="empty-playlist">
          <p>Your playlist is empty. Start adding your favorite songs!</p>
          <Link to="/search" className="search-link">Browse Music</Link>
        </div>
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
                <p className="artist">
                  <Link to={`/artist/${song.songArtist}`} className="artist-link">
                    {song.songArtist}
                  </Link>
                </p>
                <p className="album">
                  <Link to={`/album/${song.album}`} className="album-link">
                    {song.album}
                  </Link>
                </p>

                <div className="song-actions">
                  <button
                    className="play-button"
                    onClick={() => handlePlayPause(song)}
                    aria-label={currentSong?._id === song._id && isPlaying ? "Pause song" : "Play song"}
                  >
                    {currentSong?._id === song._id && isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveFromPlaylist(song._id)}
                    aria-label="Remove from favorites"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlist;
