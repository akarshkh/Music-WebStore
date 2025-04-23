import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AlbumList.css";

const AlbumList = () => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/albums")
      .then((res) => res.json())
      .then((data) => setAlbums(data))
      .catch((err) => console.error("Failed to load albums", err));
  }, []);

  return (
    <div className="album-list-container">
      <h1>Albums</h1>
      <div className="album-grid">
        {albums.map((album, index) => (
          <Link to={`/album/${encodeURIComponent(album)}`} key={index} className="album-card">
            <div className="album-thumbnail">
              <span className="album-icon">🎵</span>
            </div>
            <div className="album-name">{album}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AlbumList;
