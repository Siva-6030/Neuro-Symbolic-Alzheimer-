import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
// Placeholder image path, update as needed
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

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Segoe UI, Arial, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '32px',
          boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
          overflow: 'hidden',
          maxWidth: 950,
          width: '100%',
          minHeight: 480,
        }}
      >
        {/* Left image */}
        <div style={{ flex: 1, minWidth: 340, background: '#f3e9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={brainImg} alt="Brain" style={{ width: '98%', maxWidth: 340, borderRadius: '18px', boxShadow: '0 2px 16px rgba(90,24,154,0.10)' }} />
        </div>
        {/* Right card */}
        <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 36px' }}>
          <h2 style={{ fontWeight: 700, fontSize: '2.4rem', color: '#5a189a', marginBottom: 48 }}>Alzheimer Portal</h2>
          <button
            onClick={handleGoogleLogin}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              background: '#fff',
              color: '#444',
              border: '1.5px solid #bbb',
              borderRadius: '12px',
              padding: '18px 44px',
              fontWeight: 'bold',
              fontSize: '1.35rem',
              cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
              transition: 'background 0.2s',
            }}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              style={{ width: 36, height: 36 }}
            />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;