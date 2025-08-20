// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCL44DAf-deKKKJLl-At8pCmyAMNGjQvjI",
  authDomain: "koolz-games.firebaseapp.com",
  projectId: "koolz-games",
  storageBucket: "koolz-games.firebasestorage.app",
  messagingSenderId: "621336210290",
  appId: "1:621336210290:web:4fcb1cbdf24dc896994beb",
  measurementId: "G-1KDW80FSZ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
const auth = getAuth(app);

// Analytics (disable on server)
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export { auth, analytics };
