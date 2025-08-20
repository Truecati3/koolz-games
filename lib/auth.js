// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";

const AuthContext = createContext({ user: null, loading: true, role: "guest" });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("guest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        setRole("guest");
        setLoading(false);
        return;
      }

      setUser(u);
      try {
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setRole(snap.data().role || "user");
        } else {
          await setDoc(
            ref,
            {
              email: u.email || "",
              role: "user",
              banned: false,
              createdAt: serverTimestamp(),
            },
            { merge: true }
          );
          setRole("user");
        }
      } catch (e) {
        console.error("Failed to read role:", e);
        setRole("user");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const value = {
    user,
    role,
    loading,
    login: (email, password) => signInWithEmailAndPassword(auth, email, password),
    signup: (email, password) => createUserWithEmailAndPassword(auth, email, password),
    loginWithGoogle: () => signInWithPopup(auth, googleProvider),
    logout: () => signOut(auth),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
