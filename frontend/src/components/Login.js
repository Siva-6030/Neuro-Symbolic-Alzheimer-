import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "./Login.css";

const Login = ({ onAdminLogin }) => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [loginType, setLoginType] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();
    
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      setError("Login failed: " + error.message);
      setLoading(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (username === "ADAdmin" && password === "AD@admin") {
      if (onAdminLogin) onAdminLogin();
      navigate("/dashboard");
    } else {
      setError("Invalid admin credentials");
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-background">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
      </div>

      <div className="login-container">
        <div className="login-card">
          {/* Logo Section */}
          <div className="login-header">
            <div className="logo-circle">🧠</div>
            <h1 className="login-title">Alzheimer Detection</h1>
            <p className="login-subtitle">AI-Powered Diagnosis System</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {!loginType ? (
            <div className="login-type-selection">
              <p className="selection-title">Select Login Type</p>
              
              <button
                onClick={() => setLoginType("patient")}
                className="login-type-btn patient-btn"
              >
                <span className="btn-icon">👤</span>
                <span className="btn-text">Patient Login</span>
                <span className="btn-arrow">→</span>
              </button>

              <button
                onClick={() => setLoginType("admin")}
                className="login-type-btn admin-btn"
              >
                <span className="btn-icon">👨‍💼</span>
                <span className="btn-text">Admin Login</span>
                <span className="btn-arrow">→</span>
              </button>

              <div className="login-info">
                <p className="info-text">
                  🔒 Secure authentication powered by Firebase
                </p>
              </div>
            </div>
          ) : loginType === "patient" ? (
            <div className="login-form-wrapper">
              <button
                onClick={() => {
                  setLoginType(null);
                  setError("");
                }}
                className="back-link"
              >
                ← Back to Login Type
              </button>

              <div className="form-header">
                <div className="form-icon patient-icon">👤</div>
                <h2 className="form-title">Patient Login</h2>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="google-btn"
              >
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? (
                  <>
                    <span className="spinner-mini"></span>
                    Logging in...
                  </>
                ) : (
                  "Sign in with Google"
                )}
              </button>

              <div className="form-info">
                <p className="info-text">
                  Use your Google account to securely access your patient dashboard
                </p>
              </div>
            </div>
          ) : (
            <div className="login-form-wrapper">
              <button
                onClick={() => {
                  setLoginType(null);
                  setError("");
                  setUsername("");
                  setPassword("");
                }}
                className="back-link"
              >
                ← Back to Login Type
              </button>

              <div className="form-header">
                <div className="form-icon admin-icon">👨‍💼</div>
                <h2 className="form-title">Admin Login</h2>
              </div>

              <form onSubmit={handleAdminLogin} className="admin-form">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="form-input"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="login-submit-btn"
                >
                  {loading ? (
                    <>
                      <span className="spinner-mini"></span>
                      Logging in...
                    </>
                  ) : (
                    "Admin Login"
                  )}
                </button>
              </form>

              <div className="form-info demo-info">
                <p className="info-label">🔑 Demo Credentials:</p>
                <p className="info-code">
                  Username: <code>ADAdmin</code>
                </p>
                <p className="info-code">
                  Password: <code>AD@admin</code>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p className="footer-text">
            <span>🏥</span> Secure Medical Diagnosis Platform
          </p>
          <p className="footer-copyright">© 2025 Alzheimer Detection System</p>
        </div>
      </div>
    </div>
  );
};

export default Login;