import { useEffect, useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import app from "../firebase";

const auth = getAuth(app);
const db = getFirestore(app);

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState({ name: "", url: "", icon: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [users, setUsers] = useState([]);

  const isAdmin = user?.email === "snoxnukethe@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) fetchGames();
      if (isAdmin) fetchUsers();
    });
    return () => unsubscribe();
  }, [isAdmin]);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSignOut = () => signOut(auth);

  const fetchGames = async () => {
    const snapshot = await getDocs(collection(db, "games"));
    setGames(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const addGame = async () => {
    if (!newGame.name || !newGame.url || !newGame.icon) return;
    await addDoc(collection(db, "games"), newGame);
    setNewGame({ name: "", url: "", icon: "" });
    fetchGames();
  };

  const deleteGame = async (id) => {
    await deleteDoc(doc(db, "games", id));
    fetchGames();
  };

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    setUsers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const banUser = async (id) => {
    await deleteDoc(doc(db, "users", id));
    fetchUsers();
  };

  const openGame = (url) => {
    setCurrentGame(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentGame(null);
    setIsModalOpen(false);
  };

  return (
    <div className="container">
      {!user ? (
        <div className="auth-card">
          <h2>Sign In</h2>
          <div className="auth-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignIn}>Sign In</button>
            <button onClick={handleSignUp}>Sign Up</button>
          </div>
        </div>
      ) : (
        <div>
          <div className="header">
            <h1 className="title">Koolz Games</h1>
            <button className="signout" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
          {isAdmin && (
            <div className="add-form">
              <input
                placeholder="Game name"
                value={newGame.name}
                onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
              />
              <input
                placeholder="Game URL"
                value={newGame.url}
                onChange={(e) => setNewGame({ ...newGame, url: e.target.value })}
              />
              <input
                placeholder="Game Icon URL"
                value={newGame.icon}
                onChange={(e) => setNewGame({ ...newGame, icon: e.target.value })}
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

          {isAdmin && (
            <div className="admin-panel">
              <h2>All Users</h2>
              {users.map((u) => (
                <div className="user-row" key={u.id}>
                  <span className="email">{u.email}</span>
                  <button className="delete" onClick={() => banUser(u.id)}>
                    Ban
                  </button>
                </div>
              ))}
            </div>
          )}

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
          font-family: Inter, sans-serif;
          padding: 24px;
        }
        .auth-card {
          max-width: 400px;
          margin: 12vh auto 0;
          background: #16161a;
          padding: 24px;
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
          justify-content: space-between;
          align-items: center;
        }
        .title {
          font-size: 28px;
          color: #f6b93b;
        }
        .signout {
          border: 1px solid #3a3a48;
          background: transparent;
          color: #fff;
          padding: 6px 10px;
          border-radius: 10px;
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
          transition: 0.2s ease;
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
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
        }
        .name {
          font-weight: 600;
        }
        .delete {
          background: #ef4444;
          border: 0;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          color: #fff;
          cursor: pointer;
        }
        .admin-panel {
          margin-top: 30px;
        }
        .user-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }
        .email {
          color: #c9c9d6;
          font-size: 14px;
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
          width: 80%;
          height: 80%;
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
