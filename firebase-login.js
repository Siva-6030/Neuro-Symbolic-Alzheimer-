// Firebase App (the core Firebase SDK) is always required and must be listed first
// Add these <script> tags to your HTML file before this script:
// <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js"></script>

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmw4-pJbbKvsbA2jfp90DLiQN6AseXYFo",
  authDomain: "neuro-symbolic-alzheimer.firebaseapp.com",
  projectId: "neuro-symbolic-alzheimer",
  storageBucket: "neuro-symbolic-alzheimer.firebasestorage.app",
  messagingSenderId: "92838539512",
  appId: "1:92838539512:web:efb0d907d076fa5520cb0d",
  measurementId: "G-C5Y0LE7DPP"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Google login function
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      // User signed in
      const user = result.user;
      alert('Logged in as: ' + user.displayName);
      // You can now use user info or redirect
    })
    .catch((error) => {
      // Handle Errors here.
      alert('Error: ' + error.message);
    });
}

// Example: Attach to a button in your HTML
// <button onclick="loginWithGoogle()">Login with Google</button> 