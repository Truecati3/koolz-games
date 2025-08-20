// pages/index.js
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const ADMIN_EMAIL = "snoxnukethe@gmail.com";

export default function Home() {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]); // admin view
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [banned, setBanned] = useState(false);

  // Save user in Firestore
  async function saveUser(u) {
    const ref = doc(db, "users", u.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        email: u.email,
        banned: false,
        createdAt: new Date(),
      });
    }
  }

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await saveUser(u);
        // check banned
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) setBanned(snap.data().banned);
      } else {
        setBanned(false);
      }
    });
    return () => unsub();
  }, []);

  // Listen to games
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "games"), (snap) => {
      setGames(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Admin: listen to all users
  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      const unsub = onSnapshot(collection(db, "users"), (snap) => {
        setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      });
      return () => unsub();
    }
  }, [user]);

  const isAdmin = user?.email === ADMIN_EMAIL;

  async function handleAuth(e) {
    e.preventDefault();
    try {
      if (authMode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await saveUser(cred.user);
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        await saveUser(cred.user);
      }
      setEmail("");
      setPassword("");
    } catch (err) {
      alert(err.message);
    }
  }

  function handleSignOut() {
    signOut(auth);
  }

  function openGame(url) {
    setCurrentGame(url);
    setIsModalOpen(true);
  }
  function closeModal() {
    setIsModalOpen(false);
    setCurrentGame("");
  }

  // Admin: add / delete games
  async function addGame(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const url = form.url.value.trim();
    const icon = form.icon.value.trim();
    if (!name || !url || !icon) return;
    await addDoc(collection(db, "games"), { name, url, icon });
    form.reset();
  }
  async function deleteGame(id) {
    await deleteDoc(doc(db, "games", id));
  }

  // Admin: ban / unban users
  async function toggleBan(u) {
    await updateDoc(doc(db, "users", u.id), {
      banned: !u.banned,
    });
  }

  // If banned
  if (banned) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        🚫 You are banned. Contact support if you think this is a mistake.
      </div>
    );
  }

  return (
    <div className="container">
      {!user ? (
        <div className="auth-card">
          <h2>{authMode === "signup" ? "Create account" : "Log in"}</h2>
          <form onSubmit={handleAuth} className="auth-form">
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="password"
