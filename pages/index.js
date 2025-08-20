// pages/index.js
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const ADMIN_EMAIL = "snoxnukethe@gmail.com";

const initialGames = [
  {
    name: "1v1.lol",
    url: "https://1v1.lol/",
    icon: "https://img.utdstc.com/icon/983/22a/98322a3b2be892eed31589906ffd949b68bcccc9a21ba562987965b5ec6bc6de:200",
  },
  {
    name: "Krunker",
    url: "https://krunker.io/",
    icon: "https://www.vectorlogo.zone/logos/krunkerio/krunkerio-icon.svg",
  },
  {
    name: "Slope",
    url: "https://slopegame.onl/",
    icon: "https://slopegame.onl/favicon.ico",
  },
  {
    name: "Tetris",
    url: "https://tetris.com/play-tetris",
    icon: "https://www.tetris.com/sites/all/themes/tetris_2018/favicon.ico",
  },
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState(initialGames);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState("");
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const isAdmin = user?.email === ADMIN_EMAIL;

  async function handleAuth(e) {
    e.preventDefault();
    try {
      if (authMode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setEmail("");
      setPassword("");
    } catch (err) {
      alert(err.message);
    }
  }

  function handleSignOut() {
    signOut(auth);
  }

  function openGame(url) {
    setCurrentGame(url);
    setIsModalOpen(true);
  }
  function closeModal() {
    setIsModalOpen(false);
    setCurrentGame("");
  }

  // Admin-only: add and delete games (local state only for now)
  function addGame(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const url = form.url.value.trim();
    const icon = form.icon.value.trim();
    if (!name || !url || !icon) return;
    setGames((g) => [...g, { name, url, icon }]);
    form.reset();
  }
  function deleteGame(idx) {
    setGames((g) => g.filter((_, i) => i !== idx));
  }

  return (
    <div className="container">
      {!user ? (
        <div className="auth-card">
          <h2>{authMode === "signup" ? "Create account" : "Log in"}</h2>
          <form onSubmit={handleAuth} className="auth-form">
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">
              {authMode === "signup" ? "Sign up" : "Log in"}
            </button>
          </form>
          <p className="muted">
            {authMode === "signup" ? "Have an account?" : "New here?"}{" "}
            <a onClick={() => setAuthMode(authMode === "signup" ? "login" : "signup")}>
              {authMode === "signup" ? "Log in" : "Create one"}
            </a>
          </p>
        </div>
      ) : (
        <div>
          <header className="header">
            <h1 className="title">Koolz Games</h1>
            <div className="user-row">
              <span className="badge">{isAdmin ? "Admin" : "User"}</span>
              <span className="email">{user.email}</span>
              <button onClick={handleSignOut} className="signout">Sign out</button>
            </div>
          </header>

          {isAdmin && (
            <form className="add-form" onSubmit={addGame}>
              <input name="name" placeholder="Game name" />
              <input name="url" placeholder="https://example.com/play" />
              <input name="icon" placeholder="https://example.com/icon.png" />
              <button type="submit">Add game</button>
            </form>
          )}

          <div className="grid">
            {games.map((game, idx) => (
              <div className="card" key={game.name} onClick={() => openGame(game.url)}>
                <img src={game.icon} alt={game.name} className="icon" />
                <div className="name-row">
                  <p className="name">{game.name}</p>
                  {isAdmin && (
                    <button
                      className="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGame(idx);
                      }}
                      aria-label={"Delete " + game.name}
                      title="Delete"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isModalOpen && (
            <div className="modal" onClick={closeModal}>
              <iframe src={currentGame} className="iframe" />
              <button onClick={closeModal} className="close">X</button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: #0f0f12;
          color: #fff;
          font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          padding: 24px;
        }
        .auth-card {
          max-width: 420px;
          margin: 12vh auto 0;
          background: #16161a;
          border: 1px solid #2a2a32;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.35);
          text-align: center;
        }
        .auth-card h2 { color: #f6b93b; margin-bottom: 16px; }
        .auth-form { display: grid; gap: 12px; }
        .auth-form input {
          background: #202028; border: 1px solid #2c2c36;
          border-radius: 10px; padding: 10px 12px; color: #fff;
        }
        .auth-form button {
          background: #f6b93b; border: 0; border-radius: 10px; padding: 10px 12px;
          font-weight: 600; cursor: pointer;
        }
        .auth-form button:hover { filter: brightness(0.95); }
        .muted { color: #b3b3c2; margin-top: 10px; }
        .muted a { color: #fff; text-decoration: underline; cursor: pointer; }
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .title { font-size: 28px; color: #f6b93b; }
        .user-row { display: flex; align-items: center; gap: 10px; }
        .badge { background: #2b2b36; border: 1px solid #3a3a48; padding: 4px 8px; border-radius: 999px; font-size: 12px; }
        .email { color: #c9c9d6; font-size: 14px; }
        .signout { background: transparent; border: 1px solid #3a3a48; color: #fff; border-radius: 10px; padding: 6px 10px; cursor: pointer; }
        .add-form { display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 8px; margin: 16px 0 24px; }
        .add-form input { background: #202028; border: 1px solid #2c2c36; border-radius: 10px; padding: 8px 10px; color: #fff; }
        .add-form button { background: #22c55e; border: 0; border-radius: 10px; padding: 8px 12px; font-weight: 600; cursor: pointer; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 18px; }
        .card { background: #16161a; border: 1px solid #2a2a32; border-radius: 14px; padding: 10px; cursor: pointer; transition: transform .15s ease, box-shadow .2s ease; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,.35); }
        .icon { width: 100%; height: 100px; object-fit: cover; border-radius: 10px; }
        .name-row { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
        .name { color: #e7e7f3; font-weight: 600; }
        .delete { background: #ef4444; border: 0; border-radius: 999px; width: 28px; height: 28px; color: #fff; cursor: pointer; }
        .modal { position: fixed; inset: 0; background: rgba(0,0,0,.9); display: flex; align-items: center; justify-content: center; z-index: 50; }
        .iframe { width: 100%; height: 100%; border: 0; }
        .close { position: absolute; top: 16px; right: 16px; background: #f6b93b; color: #000; font-weight: 800; border: 0; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; }
      `}</style>
    </div>
  );
}
