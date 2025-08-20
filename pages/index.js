// pages/index.js
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

// >>> Change this to YOUR admin email
const ADMIN_EMAIL = "your-admin-email@example.com";

const defaultGames = [
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

export default function Home() {
  const [user, setUser] = useState(null);

  // auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // games
  const [games, setGames] = useState(defaultGames);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState("");

  // add game
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newIcon, setNewIcon] = useState("");

  // admin
  const [banEmail, setBanEmail] = useState("");
  const [adminMsg, setAdminMsg] = useState("");

  const isAdmin =
    user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const emailKey = (e) => (e || "").trim().toLowerCase();

  // check ban status
  const checkBanAfterSignIn = async (u) => {
    try {
      const uidDoc = await getDoc(doc(db, "bannedUsers", u.uid));
      if (uidDoc.exists()) {
        await signOut(auth);
        setAuthError("Your account is banned.");
        return;
      }
      const emailDoc = await getDoc(
        doc(db, "bannedEmails", emailKey(u.email))
      );
      if (emailDoc.exists()) {
        await signOut(auth);
        setAuthError("Your account is banned.");
        return;
      }
    } catch (e) {
      console.error(e);
      setAuthError("Error checking ban status.");
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        await checkBanAfterSignIn(u);
        setUser(u);
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  // auth actions
  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await checkBanAfterSignIn(cred.user);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await checkBanAfterSignIn(cred.user);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // games
  const openGame = (url) => {
    setCurrentGame(url);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentGame("");
  };

  const addGame = () => {
    if (!newName || !newUrl) return;
    setGames((g) => [
      ...g,
      { name: newName, url: newUrl, icon: newIcon || "" },
    ]);
    setNewName("");
    setNewUrl("");
    setNewIcon("");
  };

  // admin ban/unban
  const banByEmail = async () => {
    setAdminMsg("");
    try {
      const key = emailKey(banEmail);
      if (!key) {
        setAdminMsg("Enter an email.");
        return;
      }
      await setDoc(doc(db, "bannedEmails", key), {
        email: key,
        bannedAt: new Date().toISOString(),
        by: user?.email || "admin",
      });
      setAdminMsg(`Banned ${key}`);
      setBanEmail("");
    } catch (e) {
      console.error(e);
      setAdminMsg("Failed to ban.");
    }
  };

  const unbanByEmail = async () => {
    setAdminMsg("");
    try {
      const key = emailKey(banEmail);
      if (!key) {
        setAdminMsg("Enter an email.");
        return;
      }
      await deleteDoc(doc(db, "bannedEmails", key));
      setAdminMsg(`Unbanned ${key}`);
      setBanEmail("");
    } catch (e) {
      console.error(e);
      setAdminMsg("Failed to unban.");
    }
  };

  return (
    <div className="container">
      {!user ? (
        <div className="auth-box">
          <h2>Login / Create Account</h2>
          <form className="auth-form">
            <input
              type="email"
              placeholder="Email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <div className="row">
              <button onClick={handleLogin} className="btn">
                Login
              </button>
              <button onClick={handleSignup} className="btn secondary">
                Sign Up
              </button>
            </div>
            {authError && <p className="error">{authError}</p>}
          </form>
        </div>
      ) : (
        <>
          <div className="topbar">
            <div>
              <strong>Welcome:</strong> {user.email}
            </div>
            <div className="topbar-actions">
              <button onClick={handleLogout} className="btn small">
                Logout
              </button>
              {isAdmin && <span className="badge">Admin</span>}
            </div>
          </div>

          <h1 className="title">Koolz Games</h1>

          <div className="add-game">
            <input
              className="input"
              placeholder="Game name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              className="input"
              placeholder="Game URL (https://...)"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <input
              className="input"
              placeholder="Icon URL (optional)"
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
            />
            <button onClick={addGame} className="btn">
              Add Game
            </button>
          </div>

          <div className="games-container">
            {games.map((g) => (
              <div
                key={g.name + g.url}
                className="game-card"
                onClick={() => openGame(g.url)}
                title={g.url}
              >
                <div className="thumb">
                  {g.icon ? (
                    <img src={g.icon} alt={g.name} />
                  ) : (
                    <div className="thumb-fallback">{g.name[0]}</div>
                  )}
                </div>
                <div className="game-name">{g.name}</div>
              </div>
            ))}
          </div>

          {isModalOpen && (
            <div className="modal">
              <iframe
                src={currentGame}
                className="game-iframe"
                allow="fullscreen"
              />
              <button className="close-btn" onClick={closeModal}>
                ✕
              </button>
            </div>
          )}

          {isAdmin && (
            <div className="admin">
              <h2>Admin Panel</h2>
              <div className="row">
                <input
                  className="input"
                  placeholder="user@example.com"
                  value={banEmail}
                  onChange={(e) => setBanEmail(e.target.value)}
                />
                <button className="btn danger" onClick={banByEmail}>
                  Ban Email
                </button>
                <button className="btn secondary" onClick={unbanByEmail}>
                  Unban Email
                </button>
              </div>
              {adminMsg && <p className="info">{adminMsg}</p>}
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: #121212;
          color: #fff;
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        .title {
          text-align: center;
          color: #f6b93b;
          margin: 16px 0 24px;
        }
        .auth-box {
          height: 100vh;
          display: grid;
          place-items: center;
        }
        .auth-form {
          background: #1e1e1e;
          padding: 20px;
          border-radius: 12px;
          width: 320px;
        }
        .input {
          width: 100%;
          padding: 10px;
          margin: 6px 0;
          border-radius: 8px;
          border: 1px solid #333;
          background: #2a2a2a;
          color: #fff;
        }
        .row {
          display: flex;
          gap: 10px;
          margin-top: 8px;
          flex-wrap: wrap;
        }
        .btn {
          padding: 10px 14px;
          background: #f6b93b;
          color: #000;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }
        .btn.secondary {
          background: #3498db;
          color: #fff;
        }
        .btn.danger {
          background: #e74c3c;
          color: #fff;
        }
        .btn.small {
          padding: 6px 10px;
          font-size: 14px;
        }
        .error {
          color: #ff6b6b;
          margin-top: 8px;
        }
        .info {
          color: #8adfff;
          margin-top: 8px;
        }
        .badge {
          background: #27ae60;
          padding: 4px 8px;
          border-radius: 999px;
          margin-left: 8px;
          font-size: 12px;
        }
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .add-game {
          background: #1e1e1e;
          border-radius: 12px;
          padding: 12px;
          margin: 0 auto 16px;
          max-width: 800px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr auto;
          gap: 10px;
        }
        @media (max-width: 800px) {
          .add-game {
            grid-template-columns: 1fr;
          }
        }
        .games-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 18px;
        }
        .game-card {
          background: #1e1e1e;
          border-radius: 12px;
          padding: 10px;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .game-card:hover {
          transform: translateY(-3px);
          background: #252525;
        }
        .thumb {
          height: 110px;
          border-radius: 8px;
          background: #2e2e2e;
          display: grid;
          place-items: center;
          overflow: hidden;
        }
        .thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .thumb-fallback {
          font-weight: bold;
          font-size: 28px;
          color: #f6b93b;
        }
        .game-name {
          margin-top: 8px;
          text-align: center;
        }
        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.96);
          z-index: 1000;
          display: flex;
          align-items: stretch;
          justify-content: stretch;
        }
        .game-iframe {
          width: 100%;
          height: 100%;
          border: 0;
        }
        .close-btn {
          position: fixed;
          top: 16px;
          right: 16px;
          width: 44px;
          height: 44px;
          border-radius: 999px;
          border: none;
          background: #f6b93b;
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
        }
        .admin {
          margin-top: 28px;
          background: #1e1e1e;
          padding: 16px;
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
}
