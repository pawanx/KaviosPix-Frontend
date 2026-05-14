import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";

import {
  Eye,
  EyeSlash,
  PersonFill,
  EnvelopeFill,
  LockFill,
  Google,
  ImageFill,
} from "react-bootstrap-icons";

const Auth = () => {
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

  // input change handler
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // submit handler
  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      setLoading(true);

      // submitting register

      if (!isLogin) {
        const response = await axiosInstance.post("/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        console.log(response);
        // localStorage.setItem("token", response.data.token);
        setSuccess("Account Created Successfully.");
        setError("");

        // navigate to app
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        const response = await axiosInstance.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        console.log(response);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setSuccess("Login successful");
        setError("");

        // navigate to app
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
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
      const response = await axiosInstance.post(
        "/auth/google-login",

        {
          credential: credentialResponse.credential,
        },
      );

      /*
    ========================================
    Save Auth
    ========================================
    */

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      /*
    ========================================
    Redirect
    ========================================
    */

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden px-3 py-2"
      style={{
        background:
          "linear-gradient(135deg, #0f172a, #111827, #050505, #060606)",
      }}
    >
      {/* Glow Left */}
      <div
        className="position-absolute rounded-circle"
        style={{
          width: "300px",
          height: "300px",
          background: "#e4791b",
          filter: "blur(120px)",
          top: "-120px",
          left: "-120px",
          opacity: 0.45,
        }}
      ></div>

      {/* Glow Right */}
      <div
        className="position-absolute rounded-circle"
        style={{
          width: "250px",
          height: "250px",
          background: "#c4774a",
          filter: "blur(120px)",
          bottom: "-120px",
          right: "-120px",
          opacity: 0.45,
        }}
      ></div>

      {/* AUTH CARD */}
      <div
        className="card shadow-lg border-0 text-white p-3 position-relative"
        style={{
          width: "100%",
          maxWidth: "400px",
          height: "650px",
          overflowY: "auto",
          borderRadius: "24px",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
          zIndex: 10,
          transition: "0.3s ease",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-2">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
            style={{
              width: "55px",
              height: "55px",
              background: "linear-gradient(135deg, #f6ac5c, #e4791b)",
            }}
          >
            <ImageFill size={24} />
          </div>

          <h3 className="fw-bold mb-1">KaviosPix</h3>

          <p className="text-light opacity-75 small mb-0">
            {isLogin ? "Welcome to your gallery" : "Create your Kavios account"}
          </p>
        </div>

        {/* Toggle Buttons */}
        <div
          className="d-flex mb-3 p-1 rounded-pill"
          style={{
            background: "rgba(255,255,255,0.08)",
          }}
        >
          <button
            type="button"
            className={`btn flex-fill rounded-pill fw-semibold ${
              isLogin ? "btn-light text-dark" : "text-light"
            }`}
            onClick={() => setIsLogin(true)}
            style={{
              background: isLogin
                ? "linear-gradient(135deg, #f6ac5c, #e4791b)"
                : "transparent",
              color: "white",
              transition: "0.3s ease",
              boxShadow: isLogin
                ? "0 4px 15px rgba(228, 121, 27, 0.35)"
                : "none",
            }}
          >
            Login
          </button>

          <button
            type="button"
            className={`btn flex-fill rounded-pill fw-semibold ${
              !isLogin ? "btn-light text-dark" : "text-light"
            }`}
            onClick={() => setIsLogin(false)}
            style={{
              background: !isLogin
                ? "linear-gradient(135deg, #f6ac5c, #e4791b)"
                : "transparent",
              color: "white",
              transition: "0.3s ease",
              boxShadow: isLogin
                ? "0 4px 15px rgba(228, 121, 27, 0.35)"
                : "none",
            }}
          >
            Register
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={submitHandler}>
          {/* Full Name */}
          {!isLogin && (
            <div className="mb-2">
              <label className="form-label small">Full Name</label>

              <div className="input-group">
                <span
                  className="input-group-text border-0 text-light"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  <PersonFill />
                </span>

                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={formData.name}
                  placeholder="Enter full name"
                  className="form-control border-0 text-light py-1"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                  }}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mb-2">
            <label className="form-label small">Email</label>

            <div className="input-group">
              <span
                className="input-group-text border-0 text-light"
                style={{
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                <EnvelopeFill />
              </span>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="form-control border-0 text-light py-1"
                style={{
                  background: "rgba(255,255,255,0.06)",
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="form-label small">Password</label>

            <div className="input-group">
              <span
                className="input-group-text border-0 text-light"
                style={{
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                <LockFill />
              </span>

              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="form-control border-0 text-light py-1"
                style={{
                  background: "rgba(255,255,255,0.06)",
                }}
              />

              <button
                type="button"
                className="btn border-0 text-light px-3"
                style={{
                  background: "rgba(255,255,255,0.06)",
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlash /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn w-100 fw-semibold py-1 my-2"
            style={{
              background: "linear-gradient(135deg, #f6ac5c, #000000)",
              border: "none",
              borderRadius: "12px",
              color: "white",
              fontSize: "15px",
              transition: "0.3s ease",
            }}
          >
            {loading ? "Please wait" : isLogin ? "Login" : "Create Account"}
          </button>

          {error && (
            <div className="alert alert-danger py-1 small">{error}</div>
          )}
          {success && (
            <div className="alert alert-success py-1 small">{success}</div>
          )}
        </form>

        {/* Divider */}
        <div className="position-relative text-center my-3">
          <hr className="border-secondary" />

          <span
            className="position-absolute top-50 start-50 translate-middle px-3"
            style={{
              background: "rgba(20,20,20,0.95)",
              color: "#aaa",
              fontSize: "11px",
            }}
          >
            OR CONTINUE WITH
          </span>
        </div>

        {/* Google Button */}
        <div className="mt-3">
          <GoogleLogin
            className="d-flex justify-content-center mt-4"
            style={{ width: "100%" }}
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log("Google Login Failed");
            }}
          />
        </div>
        {/* <button
          className="btn btn-light w-100 fw-semibold py-1 d-flex align-items-center justify-content-center gap-2"
          style={{
            background: "white",
            color: "#111",
            borderRadius: "12px",
            transition: "0.3s ease",
          }}
        >
          <Google size={16} />
          Continue with Google
        </button> */}
      </div>
    </div>
  );
};

export default Auth;
