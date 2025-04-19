import React, { useState, useRef, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faShuffle,
  faStepBackward,
  faStepForward,
  faRedo,
  faHeart,
  faMusic
} from '@fortawesome/free-solid-svg-icons';
import './MediaPlayerModal.css';
import { MediaPlayerContext } from '../../context/MediaPlayerContext';

const MediaPlayerModal = () => {
  const { currentSong } = useContext(MediaPlayerContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      const updateCurrentTime = () => {
        setCurrentTime(audioRef.current.currentTime);
      };

      audioRef.current.ontimeupdate = updateCurrentTime;

      // Cleanup on unmount
      return () => {
        if (audioRef.current) {
          audioRef.current.ontimeupdate = null;
        }
      };
    }
  }, []);

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.load();
      setCurrentTime(0);
      setIsPlaying(true);
      audioRef.current.play().catch((err) => {
        console.error("Audio play failed:", err);
      });
    }
  }, [currentSong]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => {
          console.error("Audio play failed:", err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLikeToggle = () => setLiked(!liked);

  const handleSeek = (e) => {
    if (audioRef.current) {
      const newTime =
        (e.nativeEvent.offsetX / e.target.offsetWidth) *
        (audioRef.current.duration || 0);
      setCurrentTime(newTime);
      audioRef.current.currentTime = newTime;
    }
  };

  const showModal = () => setIsVisible(true);
  const hideModal = () => setIsVisible(false);

  return (
    <div className="media-player-wrapper">
      <button
        className={`music-toggle-btn ${isVisible ? 'hide-music-toggle' : 'show-music-toggle'}`}
        onMouseEnter={showModal}
      >
        <FontAwesomeIcon icon={faMusic} />
      </button>

      <div
        className={`media-player-modal-container ${isVisible ? '' : 'media-player-hidden'}`}
        onMouseEnter={showModal}
        onMouseLeave={hideModal}
      >
        <audio
          ref={audioRef}
          preload="auto"
        >
          {currentSong && (
            <source
              src={`http://localhost:5000/api/upload/files/${currentSong.songFile}`}
              type="audio/mpeg"
            />
          )}
        </audio>

        <div className="seek-bar-container" onClick={handleSeek}>
          <div className="seek-bar">
            <div
              className="seek-progress"
              style={{
                width: `${(currentTime / (audioRef.current?.duration || 1)) * 100}%`,
              }}
            />
            <div className="seek-text">
              <span>{Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}</span>
              <span>{audioRef.current?.duration ? `${Math.floor(audioRef.current.duration / 60)}:${String(Math.floor(audioRef.current.duration % 60)).padStart(2, '0')}` : '0:00'}</span>
            </div>
          </div>
        </div>

        <div className="media-content">
          <img
            src={currentSong ? `http://localhost:5000/api/upload/files/${currentSong.coverImage}` : 'https://via.placeholder.com/150'}
            alt="Album Cover"
            className="media-cover"
          />

          <div className="media-info">
            <div className="song-title-heart">
              <div className="song-title">{currentSong?.songTitle || "No Song Selected"}</div>
              <button className="heart-btn" onClick={handleLikeToggle}>
                <FontAwesomeIcon icon={faHeart} color={liked ? 'var(--primary-accent)' : 'var(--primary-bg)'} />
              </button>
            </div>

            <div className="artist-album">
              <div className="artist-name">{currentSong?.songArtist || "Artist Name"}</div>
              <div className="album-name">{currentSong?.album || "Album Name"}</div>
            </div>

            <div className="controls">
              <button className="control-btn"><FontAwesomeIcon icon={faShuffle} /></button>
              <button className="control-btn"><FontAwesomeIcon icon={faStepBackward} /></button>
              <button className="control-btn" onClick={handlePlayPause}>
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
