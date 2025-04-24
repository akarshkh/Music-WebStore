import React, { useState, useEffect, useRef } from "react";
import "./NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faUpload,
  faMagnifyingGlass,
  faHeart, // Added heart icon for playlist/favorites
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../pages/LoginModal/LoginModal";
import { PROJECT_NAME } from "../../config";
import AccountModal from "../../pages/AccountModal/AccountModal";

const NavBar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const accountRef = useRef(null);
  const hideTimeout = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetchUserData(token);
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          username: data.username,
          email: data.email,
          profilePic: data.profilePic,
        });

        localStorage.setItem("username", data.username);
        localStorage.setItem("email", data.email);
        localStorage.setItem("profilePic", data.profilePic || "");
      } else {
        autoLogout();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      autoLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoginOpen(false);
  };

  const autoLogout = () => {
    if (localStorage.getItem("accessToken")) {
      alert("Session expired. Please log in again.");
    }
    handleLogout();
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const response = await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: token }), // Send the token in the body as refreshToken
        });

        if (!response.ok) {
          console.error("Logout failed:", response);
        }
      } catch (error) {
        console.error("Logout error:", error);
      }
    }

    // Clean up local storage and reset user state
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("profilePic");

    setUser(null);
    navigate("/");
  };

  const handleMouseEnter = () => {
    clearTimeout(hideTimeout.current);
    setShowAccountModal(true);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => {
      setShowAccountModal(false);
    }, 200);
  };

  if (isLoading) return null;

  return (
    <>
      <header className="navbar">
        <div className="logo">{PROJECT_NAME}</div>

        <nav>
          <ul>
            <li>
              <button onClick={() => navigate("/")}>
                <FontAwesomeIcon icon={faHome} />
              </button>
            </li>

            <li>
              <button onClick={() => navigate("/search")}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </li>

            {/* Playlist/Favorites button - only visible when logged in */}
           {user && (
  <li>
    <button onClick={() => navigate("/playlist")} title="My Playlist">
      <FontAwesomeIcon icon={faHeart} />
    </button>
  </li>
)}


            {user && (
              <li>
                <button onClick={() => navigate("/upload-song")}>
                  <FontAwesomeIcon icon={faUpload} />
                </button>
              </li>
            )}
            <li
              className="profile-button"
              ref={accountRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button onClick={() => !user && setIsLoginOpen(true)}>
                {user ? (
                  user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      className="profile-img"
                    />
                  ) : (
                    <div className="profile-placeholder">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )
                ) : (
                  <FontAwesomeIcon icon={faUser} />
                )}
              </button>
              {user && (
                <AccountModal
                  username={user.username}
                  email={user.email}
                  profilePic={user.profilePic}
                  onLogout={handleLogout}
                  show={showAccountModal}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              )}
            </li>
          </ul>
        </nav>
      </header>

      {isLoginOpen && (
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

export default NavBar;