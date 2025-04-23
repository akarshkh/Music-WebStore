import React, { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FaGoogle, FaTwitter, FaFacebook } from "react-icons/fa";
import "./LoginModal.css";

const SITE_KEY = "6LcfXQIrAAAAAA68SEFqOqX6naSN8RgBm36qf5Du";

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            onClose();
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Remove this code to enforce the captcha functionality
        if (window.location.hostname !== "localhost" && !captchaValue) {
            alert("Please complete the CAPTCHA.");
            return;
        }

        if (isRegistering && formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const endpoint = isRegistering
            ? "http://localhost:5000/api/auth/register"
            : "http://localhost:5000/api/auth/login";

        const requestData = isRegistering
            ? { username: formData.username, email: formData.email, password: formData.password }
            : { email: formData.email, password: formData.password };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Error response:", data);
                alert("Login failed: " + (data.message || "Unknown error"));
                return;
            }

            if (!isRegistering) {
                // ✅ Store user info in localStorage
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                localStorage.setItem("username", data.username);
                localStorage.setItem("email", data.email);
                localStorage.setItem("profilePic", data.profilePic || "");

                // ✅ Pass data to NavBar
                onLoginSuccess({
                    username: data.username,
                    email: data.email,
                    profilePic: data.profilePic || null,
                });

                // Refresh the page after login success
                window.location.reload(); // This will reload the entire page.
            } else {
                alert("Registration successful! Please log in.");
                setIsRegistering(false);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Server error. Try again later.");
        }
    };

    const handleOAuthLogin = (provider, e) => {
        e.preventDefault();
        console.log(`${isRegistering ? "Registering" : "Logging in"} with ${provider}`);
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{isRegistering ? "Register" : "Login"}</h2>
                <form onSubmit={handleSubmit}>
                    {isRegistering && (
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                    {isRegistering && (
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                        />
                    )}

                    {/* Social Login Section */}
                    <div className="social-login">
                        <span>{isRegistering ? "Or Register With" : "Or Login With"}</span>
                        <div className="social-icons">
                            <FaGoogle className="social-icon" onClick={(e) => handleOAuthLogin("Google", e)} />
                            <FaTwitter className="social-icon" onClick={(e) => handleOAuthLogin("Twitter", e)} />
                            <FaFacebook className="social-icon" onClick={(e) => handleOAuthLogin("Facebook", e)} />
                        </div>
                    </div>

                    {/* reCAPTCHA */}
                    <div className="captcha-container">
                        <ReCAPTCHA sitekey={SITE_KEY} onChange={(value) => setCaptchaValue(value)} />
                    </div>

                    <button type="submit">{isRegistering ? "Register" : "Login"}</button>
                </form>

                <button type="button" onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? "Already have an account? Login here" : "Don't have an account yet? Register here"}
                </button>
            </div>
        </div>
    );
};

export default LoginModal;
