// pages/ArtistDetail.js
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { FaPlay, FaPause, FaMusic, FaHeart } from "react-icons/fa";
import "./ArtistDetail.css";

const ArtistDetail = () => {
  const { name } = useParams();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(null);
  const audioRef = useRef(new Audio());

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
      
    // Set up audio end event listener
    const audio = audioRef.current;
    const handleAudioEnd = () => setPlaying(null);
    audio.addEventListener('ended', handleAudioEnd);
    
    // Cleanup function
    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleAudioEnd);
    };
  }, [name]);

  const togglePlay = (song) => {
    const audio = audioRef.current;
    
    // If the same song is clicked again, toggle play/pause
    if (playing === song._id) {
      audio.pause();
      setPlaying(null);
      return;
    }
    
    // Play a new song
    try {
      // Set the new source
      audio.src = `http://localhost:5000/${song.songFile}`;
      
      // Play and update state
      audio.play()
        .then(() => {
          setPlaying(song._id);
        })
        .catch(error => {
          console.error("Error playing audio:", error);
        });
    } catch (error) {
      console.error("Error setting audio source:", error);
    }
  };

  return (
    <div className="artist-page-container">
      <div className="artist-header">
        <div className="artist-header-content">
          <div className="artist-avatar">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="artist-details">
            <h1>{name}</h1>
            <div className="artist-stats">
              <span>{songs.length} {songs.length === 1 ? 'song' : 'songs'}</span>
              <span className="dot-separator">•</span>
              <span>Bollywood</span>
            </div>
          </div>
        </div>
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
                className={`song-row ${playing === song._id ? 'playing' : ''}`}
              >
                <div className="song-index">{index + 1}</div>
                <div 
                  className="song-thumbnail"
                  onClick={() => togglePlay(song)}
                >
                  {playing === song._id ? (
                    <div className="play-icon playing">
                      <FaPause />
                    </div>
                  ) : (
                    <div className="play-icon">
                      <FaPlay />
                    </div>
                  )}
                </div>
                <div className="song-details" onClick={() => togglePlay(song)}>
                  <div className="song-title">{song.songTitle}</div>
                  <div className="song-album">{song.album || song.songTitle}</div>
                </div>
                <div className="song-genre">
                  <span>{song.genre || "Indie"}</span>
                </div>
                <div className="song-actions">
                  <button className="like-button">
                    <FaHeart />
                  </button>
                  <audio 
                    controls 
                    src={`http://localhost:5000/${song.songFile}`}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistDetail;