import { useRouter } from "next/router";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Login() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      alert("Google sign-in failed, check console.");
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Login</h1>
      <button
        onClick={handleGoogleSignIn}
        style={{
          padding: "10px 20px",
          background: "black",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}
