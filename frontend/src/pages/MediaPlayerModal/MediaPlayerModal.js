// frontend/src/pages/MediaPlayerModal/MediaPlayerModal.js
import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faShuffle,
  faStepBackward,
  faStepForward,
  faRedo,
  faHeart,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import "./MediaPlayerModal.css";
import { MediaPlayerContext } from "../../context/MediaPlayerContext";

const MediaPlayerModal = () => {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    audioRef,
    seekTo,
  } = useContext(MediaPlayerContext);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [audioRef]);

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    seekTo(newTime);
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = String(Math.floor(time % 60)).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const showModal = () => setIsVisible(true);
  const hideModal = () => setIsVisible(false);

  return (
    <div className="media-player-wrapper">
      <button
        className={`music-toggle-btn ${isVisible ? "hide-music-toggle" : "show-music-toggle"}`}
        onMouseEnter={showModal}
      >
        <FontAwesomeIcon icon={faMusic} />
      </button>

      <div
        className={`media-player-modal-container ${isVisible ? "" : "media-player-hidden"}`}
        onMouseEnter={showModal}
        onMouseLeave={hideModal}
      >
        <div className="seek-bar-container">
          <input
            type="range"
            className="seek-slider"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
          />
          <div className="seek-text">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="media-content">
          {currentSong ? (
            <img
              src={`http://localhost:5000/api/upload/files/${currentSong.coverImage}`}
              alt="Album Cover"
              className="media-cover"
            />
          ) : (
            <div className="media-cover placeholder-cover">
              <FontAwesomeIcon className="placeholder-cover-icon" icon={faMusic} size="1x" />
            </div>
          )}

          <div className="media-info">
            <div className="song-title-heart">
              <div className="song-title">{currentSong?.songTitle || "No Song Selected"}</div>
              <button className="heart-btn" onClick={() => setLiked(!liked)}>
                <FontAwesomeIcon icon={faHeart} color={liked ? "white" : "black"} />
              </button>
            </div>
            <div className="artist-album">
              <div className="artist-name">{currentSong?.songArtist || "Artist"}</div>
              <div className="album-name">{currentSong?.album || "Album"}</div>
            </div>
            <div className="controls">
              <button className="control-btn"><FontAwesomeIcon icon={faShuffle} /></button>
              <button className="control-btn"><FontAwesomeIcon icon={faStepBackward} /></button>
              <button className="control-btn" onClick={togglePlayPause}>
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
              </button>
              <button className="control-btn"><FontAwesomeIcon icon={faStepForward} /></button>
              <button className="control-btn"><FontAwesomeIcon icon={faRedo} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPlayerModal;
