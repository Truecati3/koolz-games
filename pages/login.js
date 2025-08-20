import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, googleLogin, signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      router.push("/dashboard");
    } catch (error) {
      console.error("Auth error:", error.message);
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      router.push("/dashboard");
    } catch (error) {
      console.error("Google login error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>{isSignup ? "Sign Up" : "Sign In"}</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
      </form>

      <p>OR</p>
      <button onClick={handleGoogleLogin} className="google-btn">
        Continue with Google
      </button>

      <p>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          type="button"
          onClick={() => setIsSignup(!isSignup)}
          className="toggle-btn"
        >
          {isSignup ? "Login" : "Sign Up"}
        </button>
      </p>
    </div>
  );
}
