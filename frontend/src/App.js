import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import "./App.css";

// Create AdminContext
export const AdminContext = createContext();

const firebaseConfig = {
  apiKey: "AIzaSyBmw4-pJbbKvsbA2jfp90DLiQN6AseXYFo",
  authDomain: "neuro-symbolic-alzheimer.firebaseapp.com",
  projectId: "neuro-symbolic-alzheimer",
  storageBucket: "neuro-symbolic-alzheimer.firebasestorage.app",
  messagingSenderId: "92838539512",
  appId: "1:92838539512:web:efb0d907d076fa5520cb0d",
  measurementId: "G-C5Y0LE7DPP",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check Firebase authentication for patient login
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });

    // Check if Admin was logged in via localStorage
    const storedAdmin = localStorage.getItem("isAdmin");
    if (storedAdmin === "true") setIsAdmin(true);

    return () => unsubscribe();
  }, []);

  const handleAdminLogin = () => {
    setIsAdmin(true);
    localStorage.setItem("isAdmin", "true");
  };

  // Loading screen while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-icon">🧠</div>
          <h1 className="loading-title">Alzheimer's Detection System</h1>
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <p className="loading-text">Initializing system...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
      <Router>
        <Routes>
          {/* Login Route */}
          <Route
            path="/login"
            element={
              !isLoggedIn && !isAdmin ? (
                <Login onAdminLogin={handleAdminLogin} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          {/* Dashboard Route - Main unified dashboard for all users */}
          <Route
            path="/dashboard"
            element={
              isLoggedIn || isAdmin ? (
                <>
                  <Header />
                  <Dashboard />
                </>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Root redirect */}
          <Route
            path="/"
            element={
              isLoggedIn || isAdmin ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Catch all */}
          <Route
            path="*"
            element={
              isLoggedIn || isAdmin ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </AdminContext.Provider>
  );
}

export default App;