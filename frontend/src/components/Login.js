import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import brainImg from "../brain.jpg";

const firebaseConfig = {
  apiKey: "AIzaSyBmw4-pJbbKvsbA2jfp90DLiQN6AseXYFo",
  authDomain: "neuro-symbolic-alzheimer.firebaseapp.com",
  projectId: "neuro-symbolic-alzheimer",
  storageBucket: "neuro-symbolic-alzheimer.firebasestorage.app",
  messagingSenderId: "92838539512",
  appId: "1:92838539512:web:efb0d907d076fa5520cb0d",
  measurementId: "G-C5Y0LE7DPP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Login = ({ onAdminLogin }) => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState(null); // null, "patient", or "admin"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (error) {
      setError("Login failed: " + error.message);
    }
  };

  const handleAdminLogin = () => {
    console.log("Attempting Admin Login with:", { username, password });
    if (username === "ADAdmin" && password === "AD@admin") {
      console.log("Admin Login successful");
      if (onAdminLogin) onAdminLogin();
      navigate("/admin");
    } else {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Segoe UI, Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          background: "rgba(255,255,255,0.95)",
          borderRadius: "32px",
          boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
          overflow: "hidden",
          maxWidth: 1200, // Increased box size
          width: "100%",
          minHeight: 700, // Increased box size
        }}
      >
        <div style={{ flex: 1, minWidth: 340, background: "#f3e9ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={brainImg} alt="Brain" style={{ width: "108%", maxWidth: 340, borderRadius: "18px", boxShadow: "0 2px 16px rgba(90,24,154,0.10)" }} />
        </div>
        <div style={{ flex: 1.2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 36px" }}>
          <h2 style={{ fontWeight: 700, fontSize: "2.4rem", color: "#5a189a", marginBottom: 48 }}>Alzheimer Portal</h2>
          {loginType === null ? (
            <div style={{ marginBottom: 24 }}>
              <button
                onClick={() => setLoginType("patient")}
                style={{
                  background: "#5a189a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "15px",
                  padding: "22px 34px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginRight: 12,
                }}
              >
                Patient Login
              </button>
              <button
                onClick={() => setLoginType("admin")}
                style={{
                  background: "#5a189a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "15px",
                  padding: "22px 34px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Admin Login
              </button>
            </div>
          ) : loginType === "patient" ? (
            <button
              onClick={handleGoogleLogin}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                background: "#fff",
                color: "#444",
                border: "1.5px solid #bbb",
                borderRadius: "12px",
                padding: "18px 44px",
                fontWeight: "bold",
                fontSize: "1.55rem",
                cursor: "pointer",
                boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                transition: "background 0.2s",
                width: "100%",
              }}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                style={{ width: 46, height: 46 }}
              />
              Sign in with Google
            </button>
          ) : (
            <>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ padding: "12px", marginBottom: 12, width: "100%", borderRadius: "8px", border: "1px solid #ccc" }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: "12px", marginBottom: 12, width: "100%", borderRadius: "8px", border: "1px solid #ccc" }}
              />
              <button
                onClick={handleAdminLogin}
                style={{
                  background: "#5a189a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "18px 44px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                Login as Admin
              </button>
            </>
          )}
          {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;