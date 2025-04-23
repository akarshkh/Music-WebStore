import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { MediaPlayerContext } from "../../context/MediaPlayerContext";
import { FaHeart, FaPlay, FaPause } from "react-icons/fa";
import "../Artist/ArtistDetail.css";

const AlbumDetail = () => {
  const { albumName } = useParams();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playSong, currentSong, isPlaying, togglePlayPause } = useContext(MediaPlayerContext);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/songs/albums/${encodeURIComponent(albumName)}`);
        if (!res.ok) throw new Error("Failed to fetch songs.");
        const data = await res.json();
        setSongs(data);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not load album songs.");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [albumName]);

  const handlePlayPause = (e, song) => {
    e.stopPropagation();
    if (currentSong?._id === song._id) {
      togglePlayPause();
    } else {
      playSong(song);
    }
  };

  const handleLikeClick = (e, songId) => {
    e.stopPropagation();
    alert("Liked song: " + songId);
  };

  return (
    <div className="album-page-container">
      <div className="songs-container">
        <h1>{albumName}</h1>

        {loading ? (
          <div className="loading-container">
            <div className="pulse-loader"></div>
            <p>Loading songs...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <h3>Error loading songs</h3>
            <p>{error}</p>
          </div>
        ) : songs.length === 0 ? (
          <div className="empty-state">
            <h3>No Songs Found</h3>
            <p>This album doesn't have any songs yet.</p>
          </div>
        ) : (
          <div className="song-list">
            {songs.map((song, index) => (
              <div
                key={song._id}
                className={`song-row ${currentSong?._id === song._id ? "playing" : ""}`}
              >
                <div className="song-index">{index + 1}</div>
                <div className="song-title">{song.songTitle}</div>
                <div className="song-artist">{song.songArtist}</div>
                <div className="song-actions">
                  <button
                    className="like-button"
                    onClick={(e) => handleLikeClick(e, song._id)}
                  >
                    <FaHeart />
                  </button>
                </div>
                <div className="song-actions">
                  <button
                    className="play-button"
                    onClick={(e) => handlePlayPause(e, song)}
                  >
                    {currentSong?._id === song._id && isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumDetail;
