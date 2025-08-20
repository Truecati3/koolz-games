import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) fetchGames();
      else setGames([]);
    });
    return unsubscribe;
  }, []);

  const fetchGames = async () => {
    const snap = await getDocs(collection(db, "games"));
    setGames(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const login = () => signInWithEmailAndPassword(auth, email, password).catch(alert);
  const register = () => createUserWithEmailAndPassword(auth, email, password).catch(alert);
  const logout = () => signOut(auth);

  const addGame = () => {
    if (!newGame) return;
    addDoc(collection(db, "games"), { title: newGame })
      .then(fetchGames)
      .catch(alert);
    setNewGame("");
  };

  const removeGame = (id) => {
    deleteDoc(doc(db, "games", id)).then(fetchGames).catch(alert);
  };

  const isAdmin = user?.email === "snoxnukethe@gmail.com";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      {!user ? (
        <div className="max-w-md w-full">
          <h1 className="font-serif text-4xl mb-10 text-gray-900">Login</h1>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex space-x-4">
              <button
                onClick={login}
                className="flex-1 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-900"
              >
                Login
              </button>
              <button
                onClick={register}
                className="flex-1 py-3 bg-gray-200 text-black font-medium rounded-lg hover:bg-gray-300"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-serif text-3xl text-gray-900">Koolz Games</h1>
            <button onClick={logout} className="text-gray-700 hover:underline">
              Logout
            </button>
          </div>
          
          <ul className="space-y-3 mb-6">
            {games.map((g) => (
              <li key={g.id} className="flex justify-between items-center py-3 border-b border-gray-300">
                <span className="text-gray-900">{g.title}</span>
                {isAdmin && (
                  <button
                    onClick={() => removeGame(g.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>

          {isAdmin && (
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="New game"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-400"
                value={newGame}
                onChange={(e) => setNewGame(e.target.value)}
              />
              <button
                onClick={addGame}
                className="py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-900"
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
