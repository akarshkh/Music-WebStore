import React, { useEffect, useState } from "react";
import "./LandingPage.css";
import { PROJECT_NAME } from "../../config";
import LoginModal from "../../pages/LoginModal/LoginModal"; // Import LoginModal
import { useNavigate } from "react-router-dom";

const LandingPage = ({ user }) => {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [randomArtist, setRandomArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false); // State to manage LoginModal visibility
  const navigate = useNavigate();

  // Fetch songs and artists
  useEffect(() => {
    const fetchSongsAndArtists = async () => {
      try {
        // Fetch songs
        const songResponse = await fetch("http://localhost:5000/api/songs/songs");
        if (!songResponse.ok) throw new Error("Failed to fetch songs.");
        const songData = await songResponse.json();
        setSongs(songData);

        // Fetch artists
        const artistResponse = await fetch("http://localhost:5000/api/artists");
        if (!artistResponse.ok) throw new Error("Failed to fetch artists.");
        const artistData = await artistResponse.json();
        setArtists(artistData);

        // Random artist selection
        if (artistData.length > 0) {
          const random = artistData[Math.floor(Math.random() * artistData.length)];
          setRandomArtist(random);
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSongsAndArtists();
  }, []);

  // Filter songs by the selected random artist
  const filteredSongs = songs.filter(
    (song) =>
      song.songArtist && song.songArtist.toLowerCase() === randomArtist?.toLowerCase()
  );

  const handleCtaClick = () => {
    if (user) {
      // If user is logged in, navigate to the Search Page
      navigate("/search");
    } else {
      // If user is not logged in, open the login modal
      setIsLoginOpen(true);
    }
  };

  return (
    <div className="landing-page-wrapper">
      {/* Hero Section (Left Column with CTA) */}
      <section className="hero-left-section">
        <div className="hero-text-box">
          <h1>Welcome to {PROJECT_NAME}</h1>
          <p>Discover and explore your favorite music.</p>
          {/* CTA Button to open Login Modal or navigate to Search Page */}
          <a
            href="#"
            className="call-to-action-button"
            onClick={(e) => {
              e.preventDefault();
              handleCtaClick();  // Open Login Modal or navigate based on login status
            }}
          >
            {user ? "Browse Music" : "Get Started"}
          </a>
        </div>
      </section>

      {/* Right Column */}
      <section className="right-column">
        {/* Latest Hits Section */}
        <div className="latest-hits-section">
          <h2>Check out our latest hits</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="song-cards-grid">
              {songs.slice(0, 4).map((song) => (
                <div key={song._id} className="song-card-container">
                  <div className="cover-image-container">
                    {song.coverImage ? (
                      <img
                        src={`http://localhost:5000/api/upload/files/${song.coverImage}`}
                        alt={song.songTitle}
                        className="cover-image"
                      />
                    ) : (
                      <div className="cover-placeholder">🎵</div>
                    )}
                  </div>
                  <div className="song-info">
                    <h3 className="song-card-title">{song.songTitle}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Songs by Random Artist Section */}
        <div className="random-artist-section">
          <h2>Songs by {randomArtist || "Random Artist"}</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : filteredSongs.length === 0 ? (
            <p>No songs found for the selected artist: {randomArtist}</p>
          ) : (
            <div className="song-cards-grid">
              {filteredSongs.slice(0, 4).map((song) => (
                <div key={song._id} className="song-card-container">
                  <div className="cover-image-container">
                    {song.coverImage ? (
                      <img
                        src={`http://localhost:5000/api/upload/files/${song.coverImage}`}
                        alt={song.songTitle}
                        className="cover-image"
                      />
                    ) : (
                      <div className="cover-placeholder">🎵</div>
                    )}
                  </div>
                  <div className="song-info">
                    <h3 className="song-card-title">{song.songTitle}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Login Modal */}
      {isLoginOpen && (
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}  // Function to close modal
          onLoginSuccess={(userData) => {
            console.log("User logged in:", userData);
            setIsLoginOpen(false);  // Close modal on login success
          }}
        />
      )}
    </div>
  );
};

export default LandingPage;
