import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getFirestore, doc, setDoc, serverTimestamp, collection } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

window.openPopup = function(event, payLink, baridiMobLink, usdtLink) {
  event.preventDefault();
  const product = event.target.closest('.card').dataset.product;
  const price = event.target.closest('.card').dataset.price;
  window.currentProduct = product;
  window.currentPrice = price;
  window.currentPayLink = payLink;
  window.currentBaridiMobLink = baridiMobLink;
  window.currentUsdtLink = usdtLink;

  const popup = document.getElementById('payment-popup');
  if (popup) {
    const priceDisplay = document.getElementById('price-display');
    if (priceDisplay) {
      priceDisplay.textContent = `Price: ${price}`;
    }
    popup.style.display = 'flex';
  } else {
    console.error("Payment popup element not found.");
  }

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      alert("Please sign in to make a purchase.");
    }
  });
}

window.closePopup = function() {
  const popup = document.getElementById('payment-popup');
  if (popup) {
    popup.style.display = 'none';
  } else {
    console.error("Payment popup element not found.");
  }
}

window.handlePayment = async function(method) {
  const product = window.currentProduct;
  const price = window.currentPrice;

  if (!product || !price) {
    alert("Product or price information is missing.");
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in to make a purchase.");
      return;
    }

    const userId = user.uid;
    const ordersCollection = collection(db, 'orders');
    const orderRef = doc(ordersCollection); 

    await setDoc(orderRef, {
      product,
      price,
      userId,
      status: false, 
      date: serverTimestamp(),
      orderId: orderRef.id,
      Your_Item: "Your Item Will Be Delivered Here"
    });

    if (method === 'paypal') {
      window.open(window.currentPayLink, '_blank');
    } else if (method === 'baridimob') {
      window.open(window.currentBaridiMobLink, '_blank');
    } else if (method === 'usdt') {
      window.open(window.currentUsdtLink, '_blank');
    }

    closePopup();
  } catch (error) {
    console.error("Error handling payment or saving order:", error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const signOutButton = document.createElement('button');
  signOutButton.textContent = 'Sign Out';
  signOutButton.onclick = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  const authStateListener = (user) => {
    if (user) {
      document.body.appendChild(signOutButton);
      const emailSpan = document.getElementById('email');
      const userNameSpan = document.getElementById('userName');
      if (emailSpan) emailSpan.textContent = user.email || 'No email';
      if (userNameSpan) userNameSpan.textContent = user.displayName || 'No username';
    } else {
      if (document.body.contains(signOutButton)) {
        document.body.removeChild(signOutButton);
      }
      const emailSpan = document.getElementById('email');
      const userNameSpan = document.getElementById('userName');
      if (emailSpan) emailSpan.textContent = 'Not logged in';
      if (userNameSpan) userNameSpan.textContent = 'Not logged in';
    }
  };

  onAuthStateChanged(auth, authStateListener);
});




