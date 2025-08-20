// pages/index.js
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState("");
  const { user, role, loading } = useAuth();

  useEffect(() => {
    const fetchGames = async () => {
      const querySnapshot = await getDocs(collection(db, "games"));
      setGames(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchGames();
  }, []);

  const handleAddGame = async () => {
    if (!newGame.trim()) return;
    const docRef = await addDoc(collection(db, "games"), { name: newGame });
    setGames([...games, { id: docRef.id, name: newGame }]);
    setNewGame("");
  };

  const handleDeleteGame = async (id) => {
    await deleteDoc(doc(db, "games", id));
    setGames(games.filter((game) => game.id !== id));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Koolz Games</h1>

      {user ? (
        <p>Logged in as {user.email} ({role})</p>
      ) : (
        <p>Not logged in</p>
      )}

      {/* Only show add game form for admins */}
      {role === "admin" && (
        <div>
          <input
            type="text"
            placeholder="New Game Name"
            value={newGame}
            onChange={(e) => setNewGame(e.target.value)}
          />
          <button onClick={handleAddGame}>Add Game</button>
        </div>
      )}

      <ul>
        {games.map((game) => (
          <li key={game.id} style={{ margin: "10px 0" }}>
            {game.name}
            {/* Only show delete button for admins */}
            {role === "admin" && (
              <button
                onClick={() => handleDeleteGame(game.id)}
                style={{ marginLeft: "10px", color: "red" }}
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
