// frontend/src/context/MediaPlayerContext.js
import React, { createContext, useRef, useState } from "react";

export const MediaPlayerContext = createContext();

export const MediaPlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSong = async (song) => {
    if (!song) return;
    setCurrentSong(song);

    const audio = audioRef.current;
    audio.src = `http://localhost:5000/api/upload/files/${song.songFile}`;
    audio.load(); // Force reload for new metadata

    // Wait for metadata to load before playing
    const waitForMetadata = new Promise((resolve) => {
      const onLoaded = () => {
        audio.removeEventListener("loadedmetadata", onLoaded);
        resolve();
      };
      audio.addEventListener("loadedmetadata", onLoaded);
    });

    try {
      await waitForMetadata;
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Playback error:", err);
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const seekTo = (time) => {
    audioRef.current.currentTime = time;
  };

  return (
    <MediaPlayerContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        playSong,
        isPlaying,
        setIsPlaying,
        togglePlayPause,
        seekTo,
        audioRef,
      }}
    >
      {children}
    </MediaPlayerContext.Provider>
  );
};
