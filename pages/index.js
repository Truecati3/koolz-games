import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";

const ADMIN_EMAIL = "snoxnukethe@gmail.com"; // 👈 change this to your admin email

export default function Home() {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState({ title: "", url: "" });

  // Track login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Fetch games
  useEffect(() => {
    const fetchGames = async () => {
      const querySnapshot = await getDocs(collection(db, "games"));
      const gamesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGames(gamesData);
    };
    fetchGames();
  }, []);

  // Add game (only admin)
  const handleAddGame = async () => {
    if (user?.email !== ADMIN_EMAIL) return; // block non-admin
    if (newGame.title && newGame.url) {
      await addDoc(collection(db, "games"), newGame);
      setNewGame({ title: "", url: "" });
      window.location.reload();
    }
  };

  // Delete game (only admin)
  const handleDeleteGame = async (id) => {
    if (user?.email !== ADMIN_EMAIL) return; // block non-admin
    await deleteDoc(doc(db, "games", id));
    setGames(games.filter((g) => g.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Koolz Games</h1>

      {/* Show Add Game form ONLY if admin */}
      {user?.email === ADMIN_EMAIL && (
        <div className="my-4">
          <input
            className="border p-2 mr-2"
            placeholder="Game Title"
            value={newGame.title}
            onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
          />
          <input
            className="border p-2 mr-2"
            placeholder="Game URL"
            value={newGame.url}
            onChange={(e) => setNewGame({ ...newGame, url: e.target.value })}
          />
          <button
            onClick={handleAddGame}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Game
          </button>
        </div>
      )}

      {/* Games list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {games.map((game) => (
          <div
            key={game.id}
            className="border rounded p-4 shadow bg-white relative"
          >
            <h2 className="text-lg font-semibold">{game.title}</h2>
            <iframe
              src={game.url}
              className="w-full h-64 border mt-2"
              title={game.title}
            ></iframe>

            {/* Delete button visible only for admin */}
            {user?.email === ADMIN_EMAIL && (
              <button
                onClick={() => handleDeleteGame(game.id)}
                className="bg-red-500 text-white px-3 py-1 mt-2 rounded"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
