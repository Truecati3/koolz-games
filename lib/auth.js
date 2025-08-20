import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Replace with YOUR real admin email
const ADMIN_EMAIL = "your@email.com";

export const signUp = async (email, password) => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Assign role
    const role = email === ADMIN_EMAIL ? "admin" : "user";

    // Save user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      role: role,
      banned: false,
    });

    return user;
  } catch (error) {
    console.error("Signup error:", error.message);
    throw error;
  }
};
