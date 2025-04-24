import React, { useEffect, useState } from "react";
import "./LandingPage.css";
import { PROJECT_NAME } from "../../config";
import LoginModal from "../../pages/LoginModal/LoginModal";
import { useNavigate } from "react-router-dom";

const LandingPage = ({ user }) => {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [randomArtist, setRandomArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongsAndArtists = async () => {
      try {
        const songResponse = await fetch("http://localhost:5000/api/songs/songs");
        if (!songResponse.ok) throw new Error("Failed to fetch songs.");
        const songData = await songResponse.json();
        setSongs(songData);

        const artistResponse = await fetch("http://localhost:5000/api/artists");
        if (!artistResponse.ok) throw new Error("Failed to fetch artists.");
        const artistData = await artistResponse.json();
        setArtists(artistData);

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

  const filteredSongs = songs.filter(
    (song) =>
      song.songArtist && song.songArtist.toLowerCase() === randomArtist?.toLowerCase()
  );

  const handleCtaClick = () => {
    if (user) {
      navigate("/search");
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <div className="lp-wrapper">
      <section className="lp-hero-left">
        <div className="lp-hero-text-box">
          <h1>Welcome to {PROJECT_NAME}</h1>
          <p>Discover and explore your favorite music.</p>
          <a
            href="#"
            className="lp-cta-button"
            onClick={(e) => {
              e.preventDefault();
              handleCtaClick();
            }}
          >
            {user ? "Browse Music" : "Sign Up Now!"}
          </a>
        </div>
      </section>

      <section className="lp-right-column">
        <div className="lp-latest-hits">
          <h2>Check out our latest hits</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="lp-error">{error}</p>
          ) : (
            <div className="lp-song-grid">
              {songs.slice(0, 4).map((song) => (
                <div key={song._id} className="lp-song-card">
                  <div className="lp-cover-image-container">
                    {song.coverImage ? (
                      <img
                        src={`http://localhost:5000/api/upload/files/${song.coverImage}`}
                        alt={song.songTitle}
                        className="lp-cover-image"
                      />
                    ) : (
                      <div className="lp-cover-placeholder">🎵</div>
                    )}
                  </div>
                  <div className="lp-song-info">
                    <h3 className="lp-song-title">{song.songTitle}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lp-random-artist">
          <h2>Songs by {randomArtist || "Random Artist"}</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="lp-error">{error}</p>
          ) : filteredSongs.length === 0 ? (
            <p>No songs found for the selected artist: {randomArtist}</p>
          ) : (
            <div className="lp-song-grid">
              {filteredSongs.slice(0, 4).map((song) => (
                <div key={song._id} className="lp-song-card">
                  <div className="lp-cover-image-container">
                    {song.coverImage ? (
                      <img
                        src={`http://localhost:5000/api/upload/files/${song.coverImage}`}
                        alt={song.songTitle}
                        className="lp-cover-image"
                      />
                    ) : (
                      <div className="lp-cover-placeholder">🎵</div>
                    )}
                  </div>
                  <div className="lp-song-info">
                    <h3 className="lp-song-title">{song.songTitle}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {isLoginOpen && (
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={(userData) => {
            console.log("User logged in:", userData);
            setIsLoginOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default LandingPage;
