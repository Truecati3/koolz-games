import { useState } from "react";
import Router from "next/router";

export default function Login() {
  const [password, setPassword] = useState("");
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
      Router.push("/"); // Redirect to game hub on success
    } else {
      setError("Incorrect password. Try again.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login to Access Games</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
        />
        <button type="submit" className="submit-btn">Login</button>
      </form>
      {error && <p className="error-msg">{error}</p>}

      <style jsx>{`
        .login-container {
          background-color: #121212;
          color: white;
          text-align: center;
          padding: 50px;
          font-family: 'Arial', sans-serif;
        }

        .login-title {
          font-size: 36px;
          margin-bottom: 40px;
          color: #f6b93b;
        }

        .login-form {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          border-radius: 8px;
          background-color: #1e1e1e;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .input-field {
          width: 100%;
          padding: 12px;
          margin: 10px 0;
          border-radius: 8px;
          border: 1px solid #444;
          background-color: #333;
          color: white;
        }

        .input-field:focus {
          outline: none;
          border-color: #f6b93b;
        }

        .submit-btn {
          width: 100%;
          padding: 12px;
          margin-top: 20px;
          background-color: #f6b93b;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        .submit-btn:hover {
          background-color: #f39c12;
        }

        .error-msg {
          color: red;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}
