import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState("");

  // track login state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchGames();
      } else {
        setGames([]);
      }
    });
    return () => unsub();
  }, []);

  // fetch games
  const fetchGames = async () => {
    try {
      const snap = await getDocs(collection(db, "games"));
      setGames(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching games:", err);
    }
  };

  // login
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  // sign up
  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  // logout
  const logout = async () => {
    await signOut(auth);
  };

  // add game (admin only)
  const addGame = async () => {
    if (!newGame) return;
    try {
      await addDoc(collection(db, "games"), { title: newGame });
      setNewGame("");
      fetchGames();
    } catch (err) {
      alert(err.message);
    }
  };

  // delete game (admin only)
  const removeGame = async (id) => {
    try {
      await deleteDoc(doc(db, "games", id));
      fetchGames();
    } catch (err) {
      alert(err.message);
    }
  };

  // check if user is admin
  const isAdmin = user?.email === "snoxnukethe@gmail.com";

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      {!user ? (
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-96 text-center">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
          />
          <button
            onClick={login}
            className="w-full bg-yellow-500 text-black py-2 rounded font-bold mb-2"
          >
            Login
          </button>
          <button
            onClick={register}
            className="w-full bg-blue-500 text-white py-2 rounded font-bold"
          >
            Sign Up
          </button>
        </div>
      ) : (
        <div className="w-full max-w-2xl p-6 bg-gray-900 rounded-xl shadow-lg">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Welcome {user.email}</h2>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded text-white"
            >
              Logout
            </button>
          </div>

          <h3 className="text-lg mb-4">Games</h3>
          <ul className="mb-4">
            {games.map((game) => (
              <li
                key={game.id}
                className="flex justify-between items-center bg-gray-800 p-2 rounded mb-2"
              >
                {game.title}
                {isAdmin && (
                  <button
                    onClick={() => removeGame(game.id)}
                    className="bg-red-600 px-2 py-1 rounded text-white"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>

          {isAdmin && (
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="New game"
                value={newGame}
                onChange={(e) => setNewGame(e.target.value)}
                className="flex-1 p-2 rounded bg-gray-800 text-white"
              />
              <button
                onClick={addGame}
                className="bg-green-500 px-3 py-1 rounded text-white"
              >
                Add
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


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
