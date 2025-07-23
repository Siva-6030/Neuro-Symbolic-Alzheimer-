import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import HomePage from './components/HomePage';
import MRIForm from './components/MRIForm';
import MMSEForm from './components/MMSEForm';
import ExistingPatientForm from './components/ExistingPatientForm';
import NewPatientForm from './components/NewPatientForm';
import Header from './components/Header'; // Import the Header component
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={isLoggedIn ? (
            <>
              <Header />
              <div style={{ height: 56 }} /> {/* Spacer for fixed top bar */}
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
              <div style={{ height: 56 }} /> {/* Spacer for fixed top bar */}
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
              <div style={{ height: 56 }} /> {/* Spacer for fixed top bar */}
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
              <div style={{ height: 56 }} /> {/* Spacer for fixed top bar */}
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
              <div style={{ height: 56 }} /> {/* Spacer for fixed top bar */}
              <NewPatientForm />
            </>
          ) : (
            <Navigate to="/login" />
          )}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;