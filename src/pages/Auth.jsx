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
  ImageFill,
  Stars,
  HeartFill,
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

  /*
  ========================================
  INPUT CHANGE
  ========================================
  */

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  /*
  ========================================
  SUBMIT
  ========================================
  */

  const submitHandler = async (e) => {
    e.preventDefault();

    setError("");

    setSuccess("");

    try {
      setLoading(true);

      if (!isLogin) {
        const response = await axiosInstance.post("/auth/register", {
          name: formData.name,

          email: formData.email,

          password: formData.password,
        });

        console.log(response);

        setSuccess("Account created successfully.");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      } else {
        const response = await axiosInstance.post("/auth/login", {
          email: formData.email,

          password: formData.password,
        });

        console.log(response);

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

  /*
  ========================================
  GOOGLE LOGIN
  ========================================
  */

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
    <div
      className="min-vh-100 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(246,172,92,0.25), transparent 25%), linear-gradient(135deg, #020617, #0f172a, #111827, #030712)",
      }}
    >
      <div className="container-fluid min-vh-100">
        <div className="row min-vh-100">
          {/* LEFT SIDE */}
          <div className="col-lg-6 d-none d-lg-flex position-relative overflow-hidden">
            {/* Glow */}
            <div
              className="position-absolute rounded-circle"
              style={{
                width: "450px",
                height: "450px",
                background: "#f6ac5c",
                filter: "blur(140px)",
                top: "-120px",
                left: "-120px",
                opacity: 0.18,
              }}
            ></div>

            {/* Content */}
            <div className="position-relative z-1 d-flex flex-column justify-content-center px-5 text-white w-100">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-4 mb-4"
                style={{
                  width: "90px",
                  height: "90px",
                  background: "linear-gradient(135deg, #f6ac5c, #e4791b)",
                }}
              >
                <ImageFill size={38} />
              </div>

              <h1
                className="fw-bold mb-4"
                style={{
                  fontSize: "4rem",
                  lineHeight: "1.1",
                }}
              >
                Store memories beautifully.
              </h1>

              <p
                className="text-light opacity-75 mb-5"
                style={{
                  maxWidth: "550px",
                  fontSize: "18px",
                  lineHeight: "1.8",
                }}
              >
                Create albums, upload moments, share memories, and build your
                personal visual world with KaviosPix.
              </p>

              {/* Floating Cards */}
              <div className="position-relative mt-4">
                {/* Card 1 */}
                <div
                  className="position-absolute p-3"
                  style={{
                    width: "260px",
                    height: "170px",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "24px",
                    backdropFilter: "blur(20px)",
                    transform: "rotate(-8deg)",
                    top: "0",
                    left: "0",
                  }}
                >
                  <div
                    className="w-100 rounded-4 mb-3"
                    style={{
                      height: "95px",
                      background: "linear-gradient(135deg, #f6ac5c, #fb923c)",
                    }}
                  ></div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-1">Travel Memories</h6>

                      <small className="text-secondary">142 Photos</small>
                    </div>

                    <HeartFill color="#ff4d6d" />
                  </div>
                </div>

                {/* Card 2 */}
                <div
                  className="position-absolute p-3"
                  style={{
                    width: "240px",
                    height: "160px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "24px",
                    backdropFilter: "blur(20px)",
                    transform: "rotate(10deg)",
                    top: "120px",
                    left: "220px",
                  }}
                >
                  <div
                    className="w-100 rounded-4 mb-3"
                    style={{
                      height: "80px",
                      background: "linear-gradient(135deg, #334155, #0f172a)",
                    }}
                  ></div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-1">Portraits</h6>

                      <small className="text-secondary">Shared Album</small>
                    </div>

                    <Stars color="#f6ac5c" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center p-4 position-relative">
            {/* Glow */}
            <div
              className="position-absolute rounded-circle"
              style={{
                width: "300px",
                height: "300px",
                background: "#e4791b",
                filter: "blur(120px)",
                bottom: "-120px",
                right: "-120px",
                opacity: 0.18,
              }}
            ></div>

            {/* CARD */}
            <div
              className="w-100 position-relative"
              style={{
                maxWidth: "440px",
                zIndex: 5,
              }}
            >
              <div
                className="border-0 text-white p-4 p-lg-5"
                style={{
                  borderRadius: "32px",
                  background: "rgba(17, 25, 40, 0.72)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(24px)",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
                }}
              >
                {/* Mobile Logo */}
                <div className="d-lg-none text-center mb-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: "65px",
                      height: "65px",
                      background: "linear-gradient(135deg, #f6ac5c, #e4791b)",
                    }}
                  >
                    <ImageFill size={26} />
                  </div>
                </div>

                {/* Heading */}
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

                {/* Toggle */}
                <div
                  className="d-flex p-1 rounded-pill mb-4"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  <button
                    type="button"
                    className="btn flex-fill rounded-pill fw-semibold"
                    onClick={() => setIsLogin(true)}
                    style={{
                      background: isLogin
                        ? "linear-gradient(135deg, #f6ac5c, #e4791b)"
                        : "transparent",

                      color: "white",

                      border: "none",

                      transition: "0.3s ease",
                    }}
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    className="btn flex-fill rounded-pill fw-semibold"
                    onClick={() => setIsLogin(false)}
                    style={{
                      background: !isLogin
                        ? "linear-gradient(135deg, #f6ac5c, #e4791b)"
                        : "transparent",

                      color: "white",

                      border: "none",

                      transition: "0.3s ease",
                    }}
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

                      <div className="input-group">
                        <span
                          className="input-group-text border-0 text-light"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <PersonFill />
                        </span>

                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter full name"
                          className="form-control border-0 text-light shadow-none"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            padding: "12px",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* EMAIL */}
                  <div className="mb-3">
                    <label className="form-label small text-secondary">
                      Email
                    </label>

                    <div className="input-group">
                      <span
                        className="input-group-text border-0 text-light"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
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
                        className="form-control border-0 text-light shadow-none"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          padding: "12px",
                        }}
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div className="mb-3">
                    <label className="form-label small text-secondary">
                      Password
                    </label>

                    <div className="input-group">
                      <span
                        className="input-group-text border-0 text-light"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <LockFill />
                      </span>

                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="form-control border-0 text-light shadow-none"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          padding: "12px",
                        }}
                      />

                      <button
                        type="button"
                        className="btn border-0 text-light"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeSlash /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  {/* BUTTON */}
                  <button
                    type="submit"
                    className="btn w-100 fw-semibold py-3 mt-2"
                    style={{
                      background: "linear-gradient(135deg, #f6ac5c, #e4791b)",

                      border: "none",

                      borderRadius: "16px",

                      color: "white",

                      fontSize: "15px",

                      boxShadow: "0 10px 30px rgba(228,121,27,0.35)",
                    }}
                  >
                    {loading
                      ? "Please wait..."
                      : isLogin
                        ? "Login"
                        : "Create Account"}
                  </button>

                  {/* ALERTS */}
                  {error && (
                    <div className="alert alert-danger mt-3 small">{error}</div>
                  )}

                  {success && (
                    <div className="alert alert-success mt-3 small">
                      {success}
                    </div>
                  )}
                </form>

                {/* Divider */}
                <div className="position-relative text-center my-4">
                  <hr className="border-secondary" />

                  <span
                    className="position-absolute top-50 start-50 translate-middle px-3"
                    style={{
                      background: "#111827",
                      color: "#9ca3af",
                      fontSize: "12px",
                    }}
                  >
                    OR CONTINUE WITH
                  </span>
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
