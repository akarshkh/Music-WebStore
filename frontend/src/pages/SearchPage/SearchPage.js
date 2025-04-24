import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation for accessing query params
import "./SearchPage.css";
import { MediaPlayerContext } from "../../context/MediaPlayerContext";
import { FaPlay, FaPause } from "react-icons/fa";
import LikeButton from "../../pages/LikeButton/LikeButton";

const SearchPage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const { playSong, currentSong, isPlaying, togglePlayPause } = useContext(MediaPlayerContext);
  
  // Get the current location (URL) to extract query parameter
  const location = useLocation();
  
  useEffect(() => {
    // Extract the query parameter 'q' from the URL
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('q');
    
    if (searchQuery) {
      setQuery(searchQuery); // Set the query state to the extracted genre or term
    }
  }, [location]); // Only re-run when the location changes

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const url = query.trim()
          ? `http://localhost:5000/api/songs/search?q=${encodeURIComponent(query)}`
          : "http://localhost:5000/api/songs/songs?limit=10";

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch songs.");
        const data = await response.json();
        setSongs(data);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("An error occurred while fetching songs.");
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchSongs, 400);
    return () => clearTimeout(debounce);
  }, [query]);

  const handlePlayPause = (e, song) => {
    e.stopPropagation();
    if (currentSong?._id === song._id) {
      togglePlayPause();
    } else {
      playSong(song);
    }
  };

  const handleGenreClick = (genre) => {
    setQuery(genre); // Set the genre in the search bar
  };

  return (
    <div className="search-page">
      <h2>Search Songs</h2>
      <input
        type="text"
        placeholder="Search by title, artist, tags, or genre..."
        value={query} // Bind the search bar to the query state
        onChange={(e) => {
          setQuery(e.target.value); // Update query on input change
          setLoading(true);
        }}
        className="search-input"
      />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="search-error">{error}</p>
      ) : (
        <div className="search-song-grid">
          {songs.map((song) => (
            <div key={song._id} className="search-song-card">
              <div className="search-cover">
                {song.coverImage ? (
                  <img
                    src={`http://localhost:5000/api/upload/files/${song.coverImage}`}
                    alt={song.songTitle}
                    className="search-cover-image"
                  />
                ) : (
                  <div className="search-cover-placeholder">🎵</div>
                )}
              </div>

              <div className="search-song-info">
                <div className="search-song-actions">
                  <LikeButton songId={song._id} />
                  <button className="search-play-button" onClick={(e) => handlePlayPause(e, song)}>
                    {currentSong?._id === song._id && isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                </div>

                <h3>{song.songTitle}</h3>
                <p className="search-artist">
                  <Link to={`/artist/${song.songArtist}`} className="search-artist-link">
                    {song.songArtist}
                  </Link>
                </p>
                <p className="search-album">
                  <Link to={`/album/${song.album}`} className="search-album-link">
                    {song.album}
                  </Link>
                </p>
                <br />
                <p className="search-genre" onClick={() => handleGenreClick(song.genre)}>
                  #{song.genre}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add a spacer here */}
      <div style={{ height: "1px" }}></div>
    </div>
  );
};

export default SearchPage;
