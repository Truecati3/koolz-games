import { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// Your admin email
const ADMIN_EMAIL = "your-admin-email@example.com";

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [games, setGames] = useState([]);
  const [newGameUrl, setNewGameUrl] = useState("");
  const [newGameTitle, setNewGameTitle] = useState("");
  const [showAddGame, setShowAddGame] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleAddGame = () => {
    if (newGameTitle && newGameUrl) {
      setGames([...games, { title: newGameTitle, url: newGameUrl }]);
      setNewGameTitle("");
      setNewGameUrl("");
      setShowAddGame(false);
    }
  };

  const handleBanUser = () => {
    alert("Ban user functionality not implemented yet!");
  };

  const isAdmin = user && user.email === ADMIN_EMAIL;

  return (
    <div className="p-6">
      {!user ? (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Login / Register</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Login
          </button>
          <button
            onClick={handleRegister}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Register
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              Welcome, {user.email} {isAdmin && "(Admin)"}
            </h2>
            <button
              onClick={handleLogout}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>

          {/* Admin controls - only visible to you */}
          {isAdmin && (
            <div className="mt-4 p-4 bg-yellow-100 rounded">
              <h2 className="text-lg font-bold">Admin Controls</h2>
              <button
                onClick={() => setShowAddGame(true)}
                className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded"
              >
                Add Game
              </button>
              <button
                onClick={handleBanUser}
                className="mt-2 ml-2 px-4 py-2 bg-red-500 text-white rounded"
              >
                Ban User
              </button>
            </div>
          )}

          {/* Game list */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {games.map((game, idx) => (
              <div key={idx} className="border p-4 rounded shadow bg-white">
                <h3 className="font-bold">{game.title}</h3>
                <iframe
                  src={game.url}
                  title={game.title}
                  className="w-full h-48 mt-2 border"
                ></iframe>
              </div>
            ))}
          </div>

          {/* Add game modal */}
          {showAddGame && isAdmin && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow w-96">
                <h2 className="text-lg font-bold mb-4">Add New Game</h2>
                <input
                  type="text"
                  placeholder="Game Title"
                  value={newGameTitle}
                  onChange={(e) => setNewGameTitle(e.target.value)}
                  className="border p-2 w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Game URL"
                  value={newGameUrl}
                  onChange={(e) => setNewGameUrl(e.target.value)}
                  className="border p-2 w-full mb-2"
                />
                <button
                  onClick={handleAddGame}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddGame(false)}
                  className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
