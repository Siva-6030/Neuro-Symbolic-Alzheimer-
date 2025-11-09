import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AdminContext } from "../App";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const { isAdmin, setIsAdmin } = useContext(AdminContext);

  const handleSignOut = async () => {
    if (isAdmin) {
      setIsAdmin(false);
      localStorage.removeItem("isAdmin");
    } else {
      await signOut(auth);
    }
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <div className="brand-logo">🧠</div>
          <div className="brand-info">
            <h1 className="brand-title">Alzheimer's Detection System</h1>
            <p className="brand-subtitle">AI-Powered Medical Diagnosis</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="user-info">
            <div className="user-avatar">
              {isAdmin ? "👨‍💼" : "👤"}
            </div>
            <div className="user-details">
              <p className="user-label">Logged in as</p>
              <p className="user-role">{isAdmin ? "Administrator" : "Patient"}</p>
            </div>
          </div>

          <button onClick={handleSignOut} className="sign-out-button">
            <span className="button-icon">🚪</span>
            <span className="button-text">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;