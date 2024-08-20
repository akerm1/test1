// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNTDHR67L48F1nPReRs2dSoQ-PxgNKWYM",
  authDomain: "login2-d485e.firebaseapp.com",
  projectId: "login2-d485e",
  storageBucket: "login2-d485e.appspot.com",
  messagingSenderId: "602998933832",
  appId: "1:602998933832:web:a397944522901f3c12cb7d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
  const profileCircle = document.getElementById('profileCircle');
  const signInButton = document.getElementById('signbtn');

  // Firebase auth state change
  onAuthStateChanged(auth, (user) => {
    if (user) {
      profileCircle.style.display = 'flex'; // Show profile circle
      signInButton.classList.add('hidden'); // Hide sign-in button
    } else {
      profileCircle.style.display = 'none'; // Hide profile circle
      signInButton.classList.remove('hidden'); // Show sign-in button
    }
  });
});



console.log("Script loaded"); // Check if the script is running