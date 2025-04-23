import React from "react";
import "./AccountModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const AccountModal = ({ username, email, profilePic, onLogout, show, onMouseEnter, onMouseLeave }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Call the onLogout function to handle logout logic (clear tokens, etc.)
        onLogout();

        // Clear the user info from localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("profilePic");

        // Reload the page after logout
        window.location.reload();  // This will refresh the page after logout
    };

    return (
        <div
            className={`account-modal ${show ? "show" : ""}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="profile-section">
                {profilePic ? (
                    <img src={profilePic} alt="Profile" className="profile-img" />
                ) : (
                    <div className="profile-placeholder">{username.charAt(0).toUpperCase()}</div>
                )}
                <p className="username">{username}</p>
                {email && <p className="email">{email}</p>}
            </div>
            <div className="button-container">
                <button className="icon-button settings-button" onClick={() => navigate("/settings")}>
                    <FontAwesomeIcon icon={faCog} />
                </button>
                <button className="icon-button logout-button" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
            </div>
        </div>
    );
};

export default AccountModal;
