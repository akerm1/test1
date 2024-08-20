import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBNTDHR67L48F1nPReRs2dSoQ-PxgNKWYM",
  authDomain: "login2-d485e.firebaseapp.com",
  projectId: "login2-d485e",
  storageBucket: "login2-d485e.appspot.com",
  messagingSenderId: "602998933832",
  appId: "1:602998933832:web:a397944522901f3c12cb7d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
  const signInButton = document.getElementById('signInBtn');
  const signOutButton = document.getElementById('signOutBtn');

  if (signInButton) {
    signInButton.addEventListener('click', async () => {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
        console.log('User signed in successfully');
      } catch (error) {
        console.error('Sign-in error:', error);
        alert('Sign-in error: ' + error.message);
      }
    });
  } else {
    console.error('Sign In Button not found');
  }

  if (signOutButton) {
    signOutButton.addEventListener('click', async () => {
      try {
        await signOut(auth);
        console.log('User signed out successfully');
      } catch (error) {
        console.error('Sign-out error:', error);
        alert('Sign-out error: ' + error.message);
      }
    });
  } else {
    console.error('Sign Out Button not found');
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user.uid);
      if (signInButton) signInButton.style.display = 'none';
      if (signOutButton) signOutButton.style.display = 'block';
    } else {
      console.log("User is signed out");
      if (signInButton) signInButton.style.display = 'block';
      if (signOutButton) signOutButton.style.display = 'none';
    }
  });
});






