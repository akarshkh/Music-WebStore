import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ArtistList.css';

const ArtistList = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/artists');
        if (!response.ok) throw new Error('Failed to fetch artists.');
        const data = await response.json();
        setArtists(data);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('An error occurred while fetching artists.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  return (
    <div className="artist-list">
      <h2>Artists</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : artists.length === 0 ? (
        <p>No artists found.</p>
      ) : (
        <div className="artist-grid">
          {artists.map((artist) => (
            <div key={artist} className="artist-card">
              <Link to={`/artist/${artist}`}>
                <div className="cover">
                  <img
                    src={`https://via.placeholder.com/200`}
                    alt={artist}
                    className="cover-image"
                  />
                </div>
                <div className="artist-info">
                  <h3>{artist}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistList;
