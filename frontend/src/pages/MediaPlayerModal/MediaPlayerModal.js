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
import LikeButton from "../../pages/LikeButton/LikeButton";

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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("canplaythrough", updateDuration);

    audio.load();

    if (!isNaN(audio.duration)) {
      setDuration(audio.duration);
    }

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("canplaythrough", updateDuration);
    };
  }, [audioRef, currentSong]);

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
    <div className="mm-media-player-wrapper">
      <button
        className={`mm-music-toggle-btn ${isVisible ? "mm-hide-music-toggle" : "mm-show-music-toggle"}`}
        onMouseEnter={showModal}
      >
        <FontAwesomeIcon icon={faMusic} />
      </button>

      <div
        className={`mm-media-player-modal-container ${isVisible ? "" : "mm-media-player-hidden"}`}
        onMouseEnter={showModal}
        onMouseLeave={hideModal}
      >
        <div className="mm-seek-bar-container">
          <input
            type="range"
            className="mm-seek-slider"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
          />
        </div>

        <div className="mm-media-content">
          {currentSong ? (
            <img
              src={`http://localhost:5000/api/upload/files/${currentSong.coverImage}`}
              alt="Album Cover"
              className="mm-media-cover"
            />
          ) : (
            <div className="mm-media-cover mm-placeholder-cover">
              <FontAwesomeIcon className="mm-placeholder-cover-icon" icon={faMusic} size="1x" />
            </div>
          )}

          <div className="mm-media-info">
            <div className="mm-song-title-heart">
              <div className="mm-song-title">{currentSong?.songTitle || "No Song Selected"}</div>
              <LikeButton
                songId={currentSong?._id}
                onLikeChange={(liked) => console.log("Liked changed:", liked)}
              />
            </div>

            <div className="mm-artist-album-duration">
              <span className="mm-artist-name">{currentSong?.songArtist || "Artist"}</span>
              <span className="mm-media-duration">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <span className="mm-album-name">{currentSong?.album || "Album"}</span>
            </div>

            <div className="mm-controls">
              <button className="mm-control-btn"><FontAwesomeIcon icon={faShuffle} /></button>
              <button className="mm-control-btn"><FontAwesomeIcon icon={faStepBackward} /></button>
              <button className="mm-control-btn" onClick={togglePlayPause}>
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
              </button>
              <button className="mm-control-btn"><FontAwesomeIcon icon={faStepForward} /></button>
              <button className="mm-control-btn"><FontAwesomeIcon icon={faRedo} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPlayerModal;
