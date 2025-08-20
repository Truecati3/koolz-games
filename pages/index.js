// pages/index.js
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // 👑 Change this to your real admin email
  const ADMIN_EMAIL = "snoxnukethe@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Signup error:", err.message);
      alert(err.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Login error:", err.message);
      alert(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      {!user ? (
        <div>
          <h1>Login / Signup</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ margin: "0.5rem", padding: "0.5rem" }}
          /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ margin: "0.5rem", padding: "0.5rem" }}
          /><br />
          <button onClick={handleLogin} style={{ marginRight: "1rem" }}>Login</button>
          <button onClick={handleSignup}>Signup</button>
        </div>
      ) : (
        <div>
          <h1>Welcome, {user.email}</h1>
          <button onClick={handleLogout}>Logout</button>

          {/* 👑 Admin-only section */}
          {user.email === ADMIN_EMAIL && (
            <div style={{ marginTop: "2rem", padding: "1rem", border: "2px solid black" }}>
              <h2>Admin Controls</h2>
              <p>You are logged in as the admin.</p>
              {/* Later we’ll add ban buttons here */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
