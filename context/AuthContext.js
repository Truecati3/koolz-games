// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("guest"); // "admin" | "user" | "guest"
  const [loading, setLoading] = useState(true);
  const [banned, setBanned] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const userData = snap.data();

          if (userData.banned) {
            // 🚫 User is banned → sign them out
            await signOut(auth);
            setUser(null);
            setRole("guest");
            setBanned(true);
            setLoading(false);
            return;
          }
        }

        // ✅ User allowed
        setUser(firebaseUser);

        if (firebaseUser.email === "snoxnukethe@gmail.com") {
          setRole("admin");
        } else {
          setRole("user");
        }

        setBanned(false);
      } else {
        setUser(null);
        setRole("guest");
        setBanned(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, banned }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
