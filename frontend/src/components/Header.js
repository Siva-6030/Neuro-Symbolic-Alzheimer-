import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AdminContext } from "../App"; // Adjust path based on your project structure

const Header = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const { isAdmin, setIsAdmin } = useContext(AdminContext);

  const handleSignOut = async () => {
    if (isAdmin) {
      // Admin logout: Clear isAdmin state and localStorage
      setIsAdmin(false);
      localStorage.removeItem("isAdmin");
    } else {
      // Firebase logout for patient
      await signOut(auth);
    }
    navigate("/login");
  };

  return (
    <div style={{
      width: '100%',
      height: 96,
      background: 'linear-gradient(90deg, #3b5bdb 0%, #5a8dee 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      boxSizing: 'border-box',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 10,
    }}>
      <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/home')}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 10.5L12 4L21 10.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 10V20H19V10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: '2rem', letterSpacing: '1px', color: '#fff', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
        ALZHEIMER DISEASE
      </div>
      <button
        onClick={handleSignOut}
        style={{
          background: 'none',
          color: '#fff',
          border: 'none',
          fontWeight: 'bold',
          fontSize: '1.3rem',
          letterSpacing: '1px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          textShadow: '0 1px 4px rgba(0,0,0,0.10)',
        }}
      >
        LOGOUT
      </button>
    </div>
  );
};

export default Header;