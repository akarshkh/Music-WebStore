// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./pages/NavBar/NavBar";
import Footer from "./pages/Footer/Footer";
import ThemeSwitcher from "./pages/ThemeSwitcher/ThemeSwitcher";
import MediaPlayerModal from "./pages/MediaPlayerModal/MediaPlayerModal";
import LoginModal from "./pages/LoginModal/LoginModal";
import { PROJECT_NAME } from "./config";

// Pages
import LandingPage from "./pages/LandingPage/LandingPage";
import Settings from "./pages/Settings/Settings";
import UploadSong from "./pages/UploadSong/UploadSong";
import Playlists from "./pages/Playlists/Playlists";
import SearchPage from "./pages/SearchPage/SearchPage";

// Helper for dynamic title updates
const PageTitleUpdater = () => {
    const location = useLocation();

    useEffect(() => {
        const titles = {
            "/": `Home | ${PROJECT_NAME}`,
            "/settings": `Settings | ${PROJECT_NAME}`,
            "/upload-song": `Upload Song | ${PROJECT_NAME}`,
            "/playlist": `Playlists | ${PROJECT_NAME}`,
            "/search": `Search | ${PROJECT_NAME}`,
        };

        document.title = titles[location.pathname] || PROJECT_NAME;
    }, [location.pathname]);

    return null;
};

function App() {
    const [user, setUser] = useState(null);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isCheckingLogin, setIsCheckingLogin] = useState(true);

    // Check current user login state
    const checkLoginStatus = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setIsCheckingLogin(false);
            return;
        }

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
                    _id: data._id,
                });
            } else {
                console.warn("Access token might be expired. Attempting to refresh...");
                await tryRefreshToken();
            }
        } catch (error) {
            console.error("Error verifying token:", error);
            await tryRefreshToken();
        } finally {
            setIsCheckingLogin(false);
        }
    };

    // Attempt to refresh tokens
    const tryRefreshToken = async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            handleLogout();
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/refresh-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                await checkLoginStatus(); // Retry after refresh
            } else {
                console.error("Refresh token invalid or expired. Logging out.");
                handleLogout();
            }
        } catch (error) {
            console.error("Refresh token error:", error);
            handleLogout();
        }
    };

    // Initial login check
    useEffect(() => {
        checkLoginStatus();
    }, []);

    // Successful login handler
    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setIsLoginOpen(false);
        localStorage.setItem("accessToken", userData.accessToken);
        localStorage.setItem("refreshToken", userData.refreshToken);
    };

    // Logout handler
    const handleLogout = async () => {
        const token = localStorage.getItem("accessToken");

        try {
            if (token) {
                await fetch("http://localhost:5000/api/auth/logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ userId: user?._id }),
                });
            }
        } catch (error) {
            console.error("Logout error:", error);
        }

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
    };

    // Optional: Loading screen or skeleton UI
    if (isCheckingLogin) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <ThemeSwitcher user={user} />
            <NavBar user={user} onLogout={handleLogout} />

            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/settings" element={<Settings user={user} />} />
                <Route path="/upload-song" element={<UploadSong user={user} />} />
                <Route path="/playlist" element={<Playlists user={user} />} />
                <Route path="/search" element={<SearchPage user={user} />} />
            </Routes>

            <Footer />
            <MediaPlayerModal />

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    );
}

// Wrap App with Router and Title Updater
export default function AppWithRouter() {
    return (
        <Router>
            <PageTitleUpdater />
            <App />
        </Router>
    );
}
