import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Settings.css";

const Settings = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsername(res.data.username);
        setEmail(res.data.email);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");

      const updateData = {
        username,
        email,
        password,
      };

      const res = await axios.patch("http://localhost:5000/api/users/update", updateData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile updated successfully!");

      if (res.data.username) localStorage.setItem("username", res.data.username);
      if (res.data.email) localStorage.setItem("email", res.data.email);

    } catch (err) {
      console.error("Error updating profile:", err.response || err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="settings-wrapper">
      <ul className="settings-list">
        <li className="settings-section">
          <h2 className="settings-heading">Account Settings</h2>
          <form className="settings-form" onSubmit={handleSubmit}>
            <label className="settings-label">Username</label>
            <input
              className="settings-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label className="settings-label">Email</label>
            <input
              className="settings-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="settings-label">Password</label>
            <input
              className="settings-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="settings-submit-button">
              Update Profile
            </button>
          </form>
        </li>
      </ul>
    </div>
  );
};

export default Settings;
