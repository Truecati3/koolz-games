import { useState } from "react";

export default function Home() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (data.success) {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Invalid password");
      setPassword("");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-2xl shadow-md w-80"
        >
          <h1 className="text-xl font-bold mb-4 text-center">Login</h1>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  // Replace this with your actual game/app content
  return (
    <div className="flex h-screen items-center justify-center bg-green-100">
      <h1 className="text-2xl font-bold">✅ Logged in! Welcome to Koolz Games</h1>
    </div>
  );
}
