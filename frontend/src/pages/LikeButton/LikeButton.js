import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./LikeButton.css";

const LikeButton = ({ songId, onLikeChange }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if song is already in favorites
    const checkIfLiked = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:5000/api/playlists/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const favorites = await response.json();
          const songExists = favorites.some(song => song._id === songId);
          setIsLiked(songExists);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkIfLiked();
  }, [songId]);

  const handleLikeClick = async (e) => {
    e.stopPropagation(); // Prevent event bubbling
    
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Please log in to add songs to your favorites.");
      return;
    }

    setIsLoading(true);

    try {
      if (isLiked) {
        // Remove from favorites
        const response = await fetch(`http://localhost:5000/api/playlists/favorites/${songId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsLiked(false);
          if (onLikeChange) onLikeChange(false);
        } else {
          throw new Error("Failed to remove from favorites");
        }
      } else {
        // Add to favorites
        const response = await fetch(`http://localhost:5000/api/playlists/favorites/${songId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsLiked(true);
          if (onLikeChange) onLikeChange(true);
        } else {
          throw new Error("Failed to add to favorites");
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`like-button ${isLiked ? "liked" : ""} ${isLoading ? "loading" : ""}`}
      onClick={handleLikeClick}
      disabled={isLoading}
      aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
    >
      {isLiked ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
};

export default LikeButton;