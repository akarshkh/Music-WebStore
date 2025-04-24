import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "./ArtistDetail.css";
import { FaHeart, FaMusic, FaPlay, FaPause } from "react-icons/fa";
import { MediaPlayerContext } from "../../context/MediaPlayerContext";
import LikeButton from "../../pages/LikeButton/LikeButton";

const ArtistDetail = () => {
  const { name } = useParams();
  const { playSong, currentSong, isPlaying, togglePlayPause } = useContext(MediaPlayerContext);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/artist/${encodeURIComponent(name)}`)
      .then((res) => res.json())
      .then((data) => {
        setSongs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load songs", err);
        setLoading(false);
      });
  }, [name]);

  const handlePlayClick = (song) => {
    if (currentSong?._id === song._id) {
      togglePlayPause();
    } else {
      playSong(song);
    }
  };

  return (
    <div className="artist-page-container">
      <div className="artist-body">
        <div className="artist-details">
          <h1>{name}</h1>
        </div>

        <div className="songs-container">
          {loading ? (
            <div className="loading-container">
              <div className="pulse-loader"></div>
              <p>Loading songs...</p>
            </div>
          ) : songs.length === 0 ? (
            <div className="empty-state">
              <FaMusic size={60} />
              <h3>No songs found</h3>
              <p>This artist doesn't have any songs yet.</p>
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
                  <div className="song-album">{song.album || song.songTitle}</div>
                  <div className="song-actions">
                    <LikeButton songId={song._id} />
                  </div>
                  <div
                    className="song-thumbnail"
                    onClick={() => handlePlayClick(song)} // Trigger play on click
                  >
                    {currentSong?._id === song._id && isPlaying ? (
                      <div className="play-icon playing">
                        <FaPause />
                      </div>
                    ) : (
                      <div className="play-icon">
                        <FaPlay />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistDetail;
