// /context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  signInWithPopup,
} from "firebase/auth";
import { auth, db, googleProvider } from "../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // {role,banned,email,...}
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // client-only
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const ref = doc(db, "users", u.uid);
        // Ensure a profile doc exists
        setDoc(
          ref,
          { email: u.email || "", role: "user", banned: false },
          { merge: true }
        );
        // Live subscribe to profile
        const off = onSnapshot(ref, (snap) => setProfile(snap.data() || null));
        setLoading(false);
        return () => off();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

  const signOut = () => fbSignOut(auth);

  const value = {
    user,
    loading,
    role: profile?.role || "user",
    banned: !!profile?.banned,
    profile,
    login,
    signup,
    loginWithGoogle,
    signOut,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  // During SSR it can be null — return a safe shape
  return (
    ctx || {
      user: null,
      loading: true,
      role: "user",
      banned: false,
      profile: null,
      login: async () => {},
      signup: async () => {},
      loginWithGoogle: async () => {},
      signOut: async () => {},
    }
  );
}
