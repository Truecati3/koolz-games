// /pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, signup, loginWithGoogle, user, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  if (user && !loading) {
    // already logged in
    router.replace("/dashboard");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      router.push("/dashboard");
    } catch (e2) {
      setErr(e2.message || "Something went wrong");
    }
  }

  async function handleGoogle() {
    setErr("");
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (e2) {
      setErr(e2.message || "Google sign-in failed");
    }
  }

  return (
    <div className="page">
      <div className="auth-card">
        <h1>{mode === "login" ? "Sign In" : "Create Account"}</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn primary">
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="muted">OR</div>

        <button onClick={handleGoogle} className="btn outline">
          Continue with Google
        </button>

        {err && <p className="error">{err}</p>}

        <p className="muted">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <a onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "Sign Up" : "Log In"}
          </a>
        </p>
      </div>
    </div>
  );
}
