// src/FavoritesContext.js
import React, { createContext, useState, useContext } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (song) => {
    setFavorites((prev) => {
      const exists = prev.find((s) => s._id === song._id);
      return exists ? prev.filter((s) => s._id !== song._id) : [...prev, song];
    });
  };

  const isFavorite = (songId) => favorites.some((s) => s._id === songId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
