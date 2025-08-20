// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCL44DAf-deKKKJLl-At8pCmyAMNGjQvjI",
  authDomain: "koolz-games.firebaseapp.com",
  projectId: "koolz-games",
  storageBucket: "koolz-games.firebasestorage.app",
  messagingSenderId: "621336210290",
  appId: "1:621336210290:web:4fcb1cbdf24dc896994beb",
  measurementId: "G-1KDW80FSZ6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Analytics only works in browser (not SSR)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
export { analytics };
