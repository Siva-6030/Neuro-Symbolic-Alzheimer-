import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import HomePage from "./components/HomePage";
import MRIForm from "./components/MRIForm";
import MMSEForm from "./components/MMSEForm";
import ExistingPatientForm from "./components/ExistingPatientForm";
import NewPatientForm from "./components/NewPatientForm";
import Header from "./components/Header";
import AdminDashboard from "./components/AdminDashboard";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Create AdminContext
export const AdminContext = createContext();

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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading) return <div>Loading...</div>;

  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={!isLoggedIn && !isAdmin ? <Login onAdminLogin={handleAdminLogin} /> : <Navigate to={isAdmin ? "/admin" : "/home"} />}
          />
          <Route path="/login" element={!isLoggedIn && !isAdmin ? <Login onAdminLogin={handleAdminLogin} /> : <Navigate to={isAdmin ? "/admin" : "/home"} />} />
          <Route
            path="/home"
            element={isLoggedIn ? (
              <>
                <Header />
                <div style={{ height: 56 }} />
                <HomePage />
              </>
            ) : (
              <Navigate to="/login" />
            )}
          />
          <Route
            path="/mri"
            element={isLoggedIn ? (
              <>
                <Header />
                <div style={{ height: 56 }} />
                <MRIForm />
              </>
            ) : (
              <Navigate to="/login" />
            )}
          />
          <Route
            path="/mmse"
            element={isLoggedIn ? (
              <>
                <Header />
                <div style={{ height: 56 }} />
                <MMSEForm />
              </>
            ) : (
              <Navigate to="/login" />
            )}
          />
          <Route
            path="/existing-patient"
            element={isLoggedIn ? (
              <>
                <Header />
                <div style={{ height: 56 }} />
                <ExistingPatientForm />
              </>
            ) : (
              <Navigate to="/login" />
            )}
          />
          <Route
            path="/new-patient"
            element={isLoggedIn ? (
              <>
                <Header />
                <div style={{ height: 56 }} />
                <NewPatientForm />
              </>
            ) : (
              <Navigate to="/login" />
            )}
          />
          <Route
            path="/admin"
            element={isAdmin ? (
              <>
                <Header />
                <div style={{ height: 56 }} />
                <AdminDashboard />
              </>
            ) : (
              <Navigate to="/login" />
            )}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AdminContext.Provider>
  );
}

export default App;