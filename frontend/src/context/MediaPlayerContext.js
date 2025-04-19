// context/MediaPlayerContext.js
import React, { createContext, useState } from "react";

// Default context values
const defaultContextValue = {
  currentSong: null, // Default currentSong as null
  setCurrentSong: () => {}, // Default no-op function for setCurrentSong
};

export const MediaPlayerContext = createContext(defaultContextValue);

export const MediaPlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);

  return (
    <MediaPlayerContext.Provider value={{ currentSong, setCurrentSong }}>
      {children}
    </MediaPlayerContext.Provider>
  );
};
