// pages/index.js
import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const games = [
  {
    name: "1v1.lol",
    url: "https://1v1.lol/",
    icon: "https://img.utdstc.com/icon/983/22a/98322a3b2be892eed31589906ffd949b68bcccc9a21ba562987965b5ec6bc6de:200",
  },
  {
    name: "Krunker",
    url: "https://krunker.io",
    icon: "https://i.imgur.com/EvR8VtQ.png",
  },
  {
    name: "Paper.io",
    url: "https://paper-io.com",
    icon: "https://i.imgur.com/tZz9V6T.png",
  },
];

const ADMIN_EMAIL = "snoxnukethe@gmail.com"; // <-- replace with YOUR email

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState("");

  // Register new account
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      setUser(cred.user);
    } catch (err) {
      alert(err.message);
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      setUser(cred.user);
    } catch (err) {
      alert(err.message);
    }
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Open game
  const openGame = (url) => {
    setCurrentGame(url);
    setIsModalOpen(true);
  };

  // Close game
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentGame("");
  };

  return (
    <div className="container">
      {!user ? (
        <div className="auth-box">
          <h2>Login or Create Account</h2>
          <form>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
            <button onClick={handleLogin} className="btn">
              Login
            </button>
            <button onClick={handleSignup} className="btn secondary">
              Sign Up
            </button>
          </form>
        </div>
      ) : (
        <div>
          <div className="topbar">
            <p>Welcome, {user.email}</p>
            <button onClick={handleLogout} className="btn small">
              Logout
            </button>
            {user.email === ADMIN_EMAIL && (
              <button className="btn danger small">Admin: Ban User</button>
            )}
          </div>

          <h1 className="title">Unblocked Games Hub</h1>
          <div className="games-container">
            {games.map((game) => (
              <div
                className="game-icon"
                key={game.name}
                onClick={() => openGame(game.url)}
              >
                <img src={game.icon} alt={game.name} className="icon-img" />
                <p className="game-name">{game.name}</p>
              </div>
            ))}
          </div>

          {isModalOpen && (
            <div className="modal">
              <iframe src={currentGame} className="game-iframe" />
              <button onClick={closeModal} className="close-btn">X</button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .container {
          background: #121212;
          color: white;
          min-height: 100vh;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .auth-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }
        .input {
          padding: 10px;
          margin: 5px 0;
          width: 250px;
          border-radius: 5px;
          border: 1px solid #333;
          background: #1e1e1e;
          color: white;
        }
        .btn {
          padding: 10px 20px;
          margin: 5px;
          background: #f6b93b;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          color: black;
          font-weight: bold;
        }
        .btn.secondary {
          background: #3498db;
          color: white;
        }
        .btn.small {
          padding: 5px 10px;
          font-size: 14px;
        }
        .btn.danger {
          background: #e74c3c;
        }
        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .title {
          font-size: 32px;
          margin: 20px 0;
          text-align: center;
          color: #f6b93b;
        }
        .games-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 20px;
          justify-items: center;
        }
        .game-icon {
          cursor: pointer;
          width: 150px;
          background: #1e1e1e;
          padding: 10px;
          border-radius: 10px;
          transition: 0.3s;
        }
        .game-icon:hover {
          transform: scale(1.05);
          background: #2c2c2c;
        }
        .icon-img {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 8px;
        }
        .game-name {
          margin-top: 10px;
        }
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .game-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: #f6b93b;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          cursor: pointer;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
