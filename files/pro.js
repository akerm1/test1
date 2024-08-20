// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getFirestore, query, where, orderBy, getDocs, collection, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

// Initialize Firebase
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

// Ensure DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  
  const emailSpan = document.getElementById('email');
  const userNameSpan = document.getElementById('userName');
  const changePasswordBtn = document.getElementById('changePasswordBtn');
  const signOutBtn = document.getElementById('signOutBtn');
  const ordersContainer = document.getElementById('orders');

  // Display user info
  onAuthStateChanged(auth, async (user) => {
    console.log('Auth state changed:', user);
    if (user) {
      emailSpan.textContent = user.email || 'No email';
      userNameSpan.textContent = user.displayName || 'No username';
      await fetchOrders(user.uid);
    } else {
      emailSpan.textContent = 'Not logged in';
      userNameSpan.textContent = 'Not logged in';
      ordersContainer.innerHTML = '<h1>Please sign in to view your orders.</h1>';
    }
  });

  // Handle Sign Out
  signOutBtn.addEventListener('click', () => {
    console.log('Sign Out button clicked');
    signOut(auth).then(() => {
      console.log('Sign out successful');
      alert('Successfully signed out');
      window.location.href = 'sign.html'; // Redirect to sign-in page or home page
    }).catch((error) => {
      console.error('Sign Out Error', error);
      alert('Error signing out');
    });
  });

  // Handle Change Password
  changePasswordBtn.addEventListener('click', () => {
    console.log('Change Password button clicked');
    const user = auth.currentUser;
    console.log('Current user:', user);

    if (user) {
      const newPassword = prompt('Enter new password:');
      console.log('New password entered:', newPassword);

      if (newPassword) {
        user.updatePassword(newPassword).then(() => {
          console.log('Password changed successfully');
          alert('Password changed successfully');
        }).catch((error) => {
          console.error('Error changing password', error);
          alert('Error changing password');
        });
      } else {
        console.log('No new password entered');
      }
    } else {
      alert('No user is logged in');
    }
  });
});

// Fetch orders from Firestore
async function fetchOrders(userId) {
  console.log("Fetching orders for user ID:", userId);
  try {
    const ordersCollection = collection(db, 'orders');
    const q = query(ordersCollection, where('userId', '==', userId), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No orders found.");
      document.getElementById('orders').innerHTML = '<p>No orders found.</p>';
      return;
    }

    const ordersContainer = document.getElementById('orders');
    ordersContainer.innerHTML = '';

    querySnapshot.forEach((doc) => {
      const orderData = doc.data();
      console.log("Order data:", orderData);
      const orderElement = document.createElement('div');
      orderElement.classList.add('order');

      const statusClass = orderData.status ? 'status-success' : 'status-verifying';
      const statusText = orderData.status ? 'Payment successful: Item will be delivered in a moment' : 'Verifying the payment';

      orderElement.innerHTML = `
        <div class="order-header">Order ID: ${orderData.orderId}</div>
        <div class="order-details">
          <p><strong>Product:</strong> ${orderData.product}</p>
          <p><strong>Price:</strong> ${orderData.price}</p>
          <p><strong>Status:</strong> <span class="order-status ${statusClass}">${statusText}</span></p>
          <p><strong>Date:</strong> ${orderData.date.toDate().toLocaleString()}</p>
          <p class="item1">${orderData.Your_Item || 'Your Item Will Be Delivered Here'}</p>
          <button class="delete-button" data-id="${doc.id}">Delete Order</button>
        </div>
      `;

      ordersContainer.appendChild(orderElement);
    });

    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', async (event) => {
        const orderId = event.target.getAttribute('data-id');
        console.log("Deleting order with ID:", orderId);
        await deleteOrder(orderId);
      });
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    document.getElementById('orders').innerHTML = '<p>Error fetching orders. Please try again later.</p>';
  }
}

// Delete order from Firestore
async function deleteOrder(orderId) {
  console.log("Attempting to delete order with ID:", orderId);
  try {
    await deleteDoc(doc(db, 'orders', orderId));
    alert('Order deleted successfully');
    // Refresh orders after deletion
    const user = auth.currentUser;
    if (user) {
      await fetchOrders(user.uid);
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    alert('Failed to delete order');
  }
}



