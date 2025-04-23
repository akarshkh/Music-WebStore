import React, { useState, useEffect, useRef } from "react";
import "./ThemeSwitcher.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const DEFAULT_THEME = "dark";
const DEFAULT_ACCENT = "accent2"; // Cherry

const ThemeSwitcher = ({ user }) => {
    const [darkMode, setDarkMode] = useState(true);
    const [accent, setAccent] = useState(DEFAULT_ACCENT);
    const [menuOpen, setMenuOpen] = useState(false);
    const hasInitialized = useRef(false);

    // Load saved theme & accent once
    useEffect(() => {
        const fetchTheme = async () => {
            let theme = DEFAULT_THEME;
            let savedAccent = DEFAULT_ACCENT;

            try {
                if (user) {
                    const token = localStorage.getItem("accessToken");
                    const res = await fetch("http://localhost:5000/api/users/theme", {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (res.ok) {
                        const text = await res.text(); // Get the response as text first
                        if (text) {
                            const data = JSON.parse(text);  // Manually parse JSON
                            theme = data.theme || DEFAULT_THEME;
                            savedAccent = data.accent || DEFAULT_ACCENT;
                        } else {
                            console.error("Empty response received.");
                        }
                    } else {
                        console.error("Failed to fetch theme:", res.status);
                    }
                } else {
                    const localTheme = localStorage.getItem("theme");
                    const localAccent = localStorage.getItem("accent");

                    if (localTheme) theme = localTheme;
                    if (localAccent) savedAccent = localAccent;
                }
            } catch (err) {
                console.error("Failed to fetch theme:", err);
            }

            setDarkMode(theme === "dark");
            setAccent(savedAccent);
            applyTheme(theme, savedAccent);
        };

        if (!hasInitialized.current) {
            hasInitialized.current = true;
            fetchTheme();
        }
    }, [user]);

    // Apply theme and accent when they change
    useEffect(() => {
        const themeMode = darkMode ? "dark" : "light";
        applyTheme(themeMode, accent);
        saveTheme(themeMode, accent);
    }, [darkMode, accent]);

    const applyTheme = (theme, accentColor) => {
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.setAttribute("data-accent", accentColor);
    };

    const saveTheme = async (theme, accentColor) => {
        localStorage.setItem("theme", theme);
        localStorage.setItem("accent", accentColor);

        if (user) {
            try {
                const token = localStorage.getItem("accessToken");
                await fetch("http://localhost:5000/api/users/theme", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ theme, accent: accentColor }),
                });
            } catch (err) {
                console.error("Failed to save theme:", err);
            }
        }
    };

    return (
        <div
            className={`theme-container ${menuOpen ? "open" : ""}`}
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
        >
            {/* Morphing Button */}
            <div className="toggle-btn" aria-label="Toggle Theme">
                <span className="icon">
                    {!menuOpen && <FontAwesomeIcon icon={darkMode ? faMoon : faSun} />}
                </span>
            </div>

            {/* Expanding Menu */}
            <div className="theme-content">
                {/* Light/Dark Mode Toggle */}
                <label className="switch" aria-label="Toggle dark mode">
                    <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={() => setDarkMode((prev) => !prev)}
                    />
                    <span className="slider"></span>
                </label>

                {/* Theme Color Options */}
                <div className="theme-options">
                    <button
                        className="theme-btn"
                        style={{ backgroundColor: "#1e90ff" }}
                        onClick={() => setAccent("accent1")}
                        aria-label="Set Ocean Accent"
                    >
                        Ocean
                    </button>
                    <button
                        className="theme-btn"
                        style={{ backgroundColor: "#28a745" }}
                        onClick={() => setAccent("accent3")}
                        aria-label="Set Sage Accent"
                    >
                        Sage
                    </button>
                    <button
                        className="theme-btn"
                        style={{ backgroundColor: "#dc3545" }}
                        onClick={() => setAccent("accent2")}
                        aria-label="Set Cherry Accent"
                    >
                        Cherry
                    </button>
                    <button
                        className="theme-btn"
                        style={{ backgroundColor: "#6f42c1" }}
                        onClick={() => setAccent("accent5")}
                        aria-label="Set Plum Accent"
                    >
                        Plum
                    </button>
                    <button
                        className="theme-btn"
                        style={{ backgroundColor: "#fd7e14" }}
                        onClick={() => setAccent("accent4")}
                        aria-label="Set Amber Accent"
                    >
                        Amber
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ThemeSwitcher;
