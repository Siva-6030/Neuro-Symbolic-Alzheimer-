import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import brainImg from '../brain.jpg'; // Import the local image

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBmw4-pJbbKvsbA2jfp90DLiQN6AseXYFo",
  authDomain: "neuro-symbolic-alzheimer.firebaseapp.com",
  projectId: "neuro-symbolic-alzheimer",
  storageBucket: "neuro-symbolic-alzheimer.firebasestorage.app",
  messagingSenderId: "92838539512",
  appId: "1:92838539512:web:efb0d907d076fa5520cb0d",
  measurementId: "G-C5Y0LE7DPP"
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);

function Login() {
  const handleGoogleLogin = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      alert('Logged in as: ' + result.user.displayName);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="login-bg">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Roboto:wght@400;500&display=swap');
        .login-bg {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .login-main {
          display: flex;
          flex-direction: row;
          background: none;
          border-radius: 24px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.25);
          overflow: hidden;
          max-width: 900px;
          width: 90vw;
        }
        .login-image {
          background: #0a0a2a;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 320px;
          width: 350px;
          height: 350px;
        }
        .login-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0;
        }
        .login-container {
          background: rgba(255,255,255,0.97);
          border-radius: 0 24px 24px 0;
          box-shadow: none;
          padding: 48px 36px 36px 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 320px;
          width: 350px;
        }
        .login-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 2.2rem;
          font-weight: 700;
          color: #4b2e83;
          margin-bottom: 24px;
          letter-spacing: 1px;
        }
        .google-btn {
          display: flex;
          align-items: center;
          background: #fff;
          color: #444;
          border: none;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.12);
          padding: 12px 24px;
          font-size: 1.1rem;
          font-family: 'Roboto', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          margin-top: 12px;
        }
        .google-btn:hover {
          background: #f5f5f5;
          box-shadow: 0 4px 12px rgba(0,0,0,0.18);
        }
        .google-icon {
          width: 24px;
          height: 24px;
          margin-right: 12px;
        }
        @media (max-width: 800px) {
          .login-main {
            flex-direction: column;
            max-width: 95vw;
            width: 95vw;
          }
          .login-image, .login-container {
            width: 100%;
            min-width: 0;
            border-radius: 0;
          }
          .login-container {
            border-radius: 0 0 24px 24px;
          }
        }
      `}</style>
      <div className="login-main">
        <div className="login-image">
          <img src={brainImg} alt="Alzheimer Brain" />
        </div>
        <div className="login-container">
          <div className="login-title">Alzheimer Portal</div>
          <button className="google-btn" onClick={handleGoogleLogin}>
            <span className="google-icon">
              <svg width="24" height="24" viewBox="0 0 24 24"><g><path fill="#4285F4" d="M21.805 10.023h-9.765v3.955h5.617c-.242 1.242-1.242 3.648-5.617 3.648-3.383 0-6.148-2.805-6.148-6.273s2.765-6.273 6.148-6.273c1.93 0 3.227.82 3.969 1.523l2.719-2.648c-1.664-1.523-3.805-2.461-6.688-2.461-5.523 0-10 4.477-10 10s4.477 10 10 10c5.773 0 9.594-4.055 9.594-9.773 0-.656-.07-1.148-.156-1.637z"/><path fill="#34A853" d="M3.545 7.548l3.273 2.402c.898-1.523 2.367-2.523 4.187-2.523 1.18 0 2.227.406 3.055 1.195l2.289-2.227c-1.383-1.289-3.164-2.09-5.344-2.09-3.977 0-7.273 3.297-7.273 7.273 0 1.148.258 2.234.711 3.195z"/><path fill="#FBBC05" d="M12.004 22c2.43 0 4.477-.805 5.969-2.188l-2.773-2.266c-.773.523-1.773.836-3.195.836-2.453 0-4.523-1.656-5.266-3.883l-3.242 2.5c1.477 2.93 4.57 4.999 8.507 4.999z"/><path fill="#EA4335" d="M21.805 10.023h-9.765v3.955h5.617c-.242 1.242-1.242 3.648-5.617 3.648-3.383 0-6.148-2.805-6.148-6.273s2.765-6.273 6.148-6.273c1.93 0 3.227.82 3.969 1.523l2.719-2.648c-1.664-1.523-3.805-2.461-6.688-2.461-5.523 0-10 4.477-10 10s4.477 10 10 10c5.773 0 9.594-4.055 9.594-9.773 0-.656-.07-1.148-.156-1.637z" opacity=".1"/></g></svg>
            </span>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login; 