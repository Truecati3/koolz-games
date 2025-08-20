import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [newGame, setNewGame] = useState({ name: "", url: "", icon: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState("");

  const isAdmin = user?.email === "snoxnukethe@gmail.com";

  // 🔑 Load auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u) {
        await fetchGames();
        if (u.email === "snoxnukethe@gmail.com") {
          await fetchUsers();
        }
      } else {
        setGames([]);
        setUsers([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🎮 Fetch Games
  const fetchGames = async () => {
    const snapshot = await getDocs(collection(db, "games"));
    setGames(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  // 👥 Fetch Users (admin only)
  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  // ➕ Add Game
  const addGame = async () => {
    if (!newGame.name || !newGame.url || !newGame.icon) return;
    await addDoc(collection(db, "games"), newGame);
    setNewGame({ name: "", url: "", icon: "" });
    fetchGames();
  };

  // ❌ Delete Game
  const deleteGame = async (id) => {
    await deleteDoc(doc(db, "games", id));
    fetchGames();
  };

  // 🔓 Login
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔒 Logout
  const logout = async () => {
    await signOut(auth);
  };

  // 🎮 Game Modal
  const openGame = (url) => {
    setCurrentGame(url);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="container">
      {!user ? (
        <div className="auth-card">
          <h2>Login</h2>
          <div className="auth-form">
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={login}>Login</button>
          </div>
        </div>
      ) : (
        <div>
          <div className="header">
            <h1 className="title">Koolz Games</h1>
            <div className="user-row">
              <span className="email">{user.email}</span>
              <button className="signout" onClick={logout}>
                Sign Out
              </button>
            </div>
          </div>

          {isAdmin && (
            <div className="add-form">
              <input
                type="text"
                placeholder="Game Name"
                value={newGame.name}
                onChange={(e) =>
                  setNewGame((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Game URL"
                value={newGame.url}
                onChange={(e) =>
                  setNewGame((prev) => ({ ...prev, url: e.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Game Icon URL"
                value={newGame.icon}
                onChange={(e) =>
                  setNewGame((prev) => ({ ...prev, icon: e.target.value }))
                }
              />
              <button onClick={addGame}>Add Game</button>
            </div>
          )}

          <div className="grid">
            {games.map((game) => (
              <div
                className="card"
                key={game.id}
                onClick={() => openGame(game.url)}
              >
                <img src={game.icon} alt={game.name} className="icon" />
                <div className="name-row">
                  <p className="name">{game.name}</p>
                  {isAdmin && (
                    <button
                      className="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGame(game.id);
                      }}
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
              <button onClick={closeModal} className="close">
                X
              </button>
              <iframe src={currentGame} className="iframe" />
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: #0f0f12;
          color: #fff;
          padding: 24px;
        }
        .auth-card {
          max-width: 420px;
          margin: 12vh auto 0;
          padding: 24px;
          background: #16161a;
          border: 1px solid #2a2a32;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
          text-align: center;
        }
        .auth-form {
          display: grid;
          gap: 12px;
        }
        .auth-form input {
          background: #202028;
          border: 1px solid #2c2c36;
          border-radius: 10px;
          padding: 10px 12px;
          color: #fff;
        }
        .auth-form button {
          background: #f6b93b;
          border: 0;
          border-radius: 10px;
          padding: 10px 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .title {
          font-size: 28px;
          color: #f6b93b;
        }
        .user-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .email {
          color: #c9c9d6;
          font-size: 14px;
        }
        .signout {
          background: transparent;
          border: 1px solid #3a3a48;
          color: #fff;
          border-radius: 10px;
          padding: 6px 10px;
          cursor: pointer;
        }
        .add-form {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr auto;
          gap: 8px;
          margin: 16px 0 24px;
        }
        .add-form input {
          background: #202028;
          border: 1px solid #2c2c36;
          border-radius: 10px;
          padding: 8px 10px;
          color: #fff;
        }
        .add-form button {
          background: #22c55e;
          border: 0;
          border-radius: 10px;
          padding: 8px 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 18px;
        }
        .card {
          background: #16161a;
          border: 1px solid #2a2a32;
          border-radius: 14px;
          padding: 10px;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.2s ease;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.35);
        }
        .icon {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 10px;
        }
        .name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
        }
        .name {
          color: #e7e7f3;
          font-weight: 600;
        }
        .delete {
          background: #ef4444;
          border: 0;
          border-radius: 999px;
          width: 28px;
          height: 28px;
          color: #fff;
          cursor: pointer;
        }
        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }
        .iframe {
          width: 100%;
          height: 100%;
          border: 0;
        }
        .close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #f6b93b;
          color: #000;
          font-weight: 800;
          border: 0;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
