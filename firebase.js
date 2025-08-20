// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCL44DAf-deKKKJLl-At8pCmyAMNGjQvjI",
  authDomain: "koolz-games.firebaseapp.com",
  projectId: "koolz-games",
  storageBucket: "koolz-games.appspot.com",
  messagingSenderId: "621336210290",
  appId: "1:621336210290:web:4fcb1cbdf24dc896994beb",
  measurementId: "G-1KDW80FSZ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth + Analytics
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
