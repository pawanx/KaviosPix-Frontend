import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

import "../styles/auth.css";

import {
  Eye,
  EyeSlash,
  PersonFill,
  EnvelopeFill,
  LockFill,
  ImageFill,
  Stars,
  HeartFill,
} from "react-bootstrap-icons";

const Auth = () => {
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [isLogin, setIsLogin] = useState(true);

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    setError("");

    setSuccess("");

    try {
      setLoading(true);

      if (!isLogin) {
        await axiosInstance.post("/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        setSuccess("Account created successfully.");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      } else {
        const response = await axiosInstance.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", response.data.token);

        localStorage.setItem("user", JSON.stringify(response.data.user));

        setSuccess("Login successful.");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      }
    } catch (error) {
      console.log(error);

      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axiosInstance.post("/auth/google-login", {
        credential: credentialResponse.credential,
      });

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
   <div className={`auth-page ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div className="container-fluid min-vh-100">
        <div className="row min-vh-100">
          {/* LEFT */}
          <div className="col-lg-6 d-none d-lg-flex auth-left">
            <div className="auth-left-glow"></div>

            <div className="auth-left-content">
              <div className="auth-logo-box">
                <ImageFill size={38} />
              </div>

              <h1 className="auth-heading">
                Store memories beautifully.
              </h1>

              <p className="auth-description">
                Create albums, upload moments, share memories, and build your
                personal visual world with KaviosPix.
              </p>

              {/* FLOATING CARDS */}
              <div className="position-relative mt-4">
                {/* CARD 1 */}
                <div className="floating-card floating-card-1">
                  <div className="floating-image-orange"></div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-1">
                        Travel Memories
                      </h6>

                      <small className="text-secondary">
                        142 Photos
                      </small>
                    </div>

                    <HeartFill color="#ff4d6d" />
                  </div>
                </div>

                {/* CARD 2 */}
                <div className="floating-card floating-card-2">
                  <div className="floating-image-dark"></div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-1">
                        Portraits
                      </h6>

                      <small className="text-secondary">
                        Shared Album
                      </small>
                    </div>

                    <Stars color="#f6ac5c" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
         
         
          <div className="col-lg-6 d-flex align-items-center justify-content-center p-4 auth-right">
            <div className="auth-right-glow"></div>
             <button
  className="theme-btn"
  onClick={() => setDarkMode(!darkMode)}
>
  {darkMode ? "☀️ Light" : "🌙 Dark"}
</button>

            <div className="auth-card-wrapper">
              <div className="auth-card">
                {/* MOBILE LOGO */}
                <div className="d-lg-none text-center mb-4">
                  <div className="mobile-logo">
                    <ImageFill size={26} />
                  </div>
                </div>

                {/* HEADING */}
                <div className="mb-4 text-center text-lg-start">
                  <h2 className="fw-bold mb-2">
                    {isLogin ? "Welcome Back" : "Create Account"}
                  </h2>

                  <p className="text-secondary mb-0">
                    {isLogin
                      ? "Login to continue your gallery journey."
                      : "Start managing your memories beautifully."}
                  </p>
                </div>

                {/* TOGGLE */}
                <div className="auth-toggle mb-4">
                  <button
                    type="button"
                    className={`auth-toggle-btn ${
                      isLogin ? "active" : ""
                    }`}
                    onClick={() => setIsLogin(true)}
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    className={`auth-toggle-btn ${
                      !isLogin ? "active" : ""
                    }`}
                    onClick={() => setIsLogin(false)}
                  >
                    Register
                  </button>
                </div>

                {/* FORM */}
                <form onSubmit={submitHandler}>
                  {/* NAME */}
                  {!isLogin && (
                    <div className="mb-3">
                      <label className="form-label small text-secondary">
                        Full Name
                      </label>

                      <div className="input-group auth-input-group">
                        <span className="input-group-text border-0">
                          <PersonFill />
                        </span>

                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter full name"
                          className="form-control border-0 shadow-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* EMAIL */}
                  <div className="mb-3">
                    <label className="form-label small text-secondary">
                      Email
                    </label>

                    <div className="input-group auth-input-group">
                      <span className="input-group-text border-0">
                        <EnvelopeFill />
                      </span>

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="form-control border-0 shadow-none"
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div className="mb-3">
                    <label className="form-label small text-secondary">
                      Password
                    </label>

                    <div className="input-group auth-input-group">
                      <span className="input-group-text border-0">
                        <LockFill />
                      </span>

                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="form-control border-0 shadow-none"
                      />

                      <button
                        type="button"
                        className="btn border-0"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                      >
                        {showPassword ? (
                          <EyeSlash />
                        ) : (
                          <Eye />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    className="auth-submit-btn"
                  >
                    {loading
                      ? "Please wait..."
                      : isLogin
                        ? "Login"
                        : "Create Account"}
                  </button>

                  {/* ALERTS */}
                  {error && (
                    <div className="alert alert-danger mt-3 small">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="alert alert-success mt-3 small">
                      {success}
                    </div>
                  )}
                </form>

                {/* DIVIDER */}
                <div className="auth-divider">
                  <hr className="border-secondary" />

                  <span>OR CONTINUE WITH</span>
                </div>

                {/* GOOGLE */}
                <div className="d-flex justify-content-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      console.log("Google Login Failed");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;