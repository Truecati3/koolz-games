// pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login, loginWithGoogle, signup, loading, user } = useAuth();

  // If already logged in, go straight to dashboard
  if (user) router.replace("/dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (e) {
      setErr(e.message || "Login failed");
    }
  };

  const onSignup = async () => {
    setErr("");
    try {
      await signup(email, password);
      router.push("/dashboard");
    } catch (e) {
      setErr(e.message || "Sign up failed");
    }
  };

  const onGoogle = async () => {
    setErr("");
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (e) {
      setErr(e.message || "Google sign-in failed");
    }
  };

  return (
    <main className="page">
      <div className="auth-card">
        <h1>Sign In</h1>

        <form className="auth-form" onSubmit={onLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="muted">OR</p>

        <button className="btn outline" onClick={onGoogle} disabled={loading}>
          Continue with Google
        </button>

        <p className="muted">
          Don&apos;t have an account?{" "}
          <a onClick={onSignup}>Sign Up</a>
        </p>

        {err && <div className="error">{err}</div>}
      </div>
    </main>
  );
}
