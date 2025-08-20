// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

// Wraps entire app with AuthProvider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("guest"); // "admin" | "user" | "guest"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // ✅ Check if logged-in user is admin
        if (firebaseUser.email === "snoxnukethe@gmail.com") {
          setRole("admin");
        } else {
          setRole("user");
        }
      } else {
        setUser(null);
        setRole("guest");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use anywhere
export function useAuth() {
  return useContext(AuthContext);
}
