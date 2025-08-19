import { useState } from "react";

const games = [
  {
    name: "1v1.lol",
    url: "https://1v1.lol/",
    icon: "https://img.utdstc.com/icon/983/22a/98322a3b2be892eed31589906ffd949b68bcccc9a21ba562987965b5ec6bc6de:200",
  },
  {
    name: "Game 2",
    url: "https://newgame2url.com",
    icon: "https://example.com/images/game2-icon.png",
  },
  // Add more games here
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const openGame = (url) => {
    setCurrentGame(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentGame("");
  };

  // 🔐 Secure login using API route
  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (data.success) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  return (
    <div className="container">
      {!isAuthenticated ? (
        <div className="password-screen">
          <h2>Enter Password to Access Games</h2>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="password-input"
            />
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>
      ) : (
        <div>
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
            <div className="modal" onClick={closeModal}>
              <iframe src={currentGame} className="game-iframe" />
              <button onClick={closeModal} className="close-btn">X</button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .container {
          background-color: #121212;
          color: #fff;
          text-align: center;
          padding: 20px;
          font-family: 'Arial', sans-serif;
        }
        .password-screen {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .password-screen h2 {
          margin-bottom: 20px;
          font-size: 24px;
          color: #f6b93b;
        }
        .password-input {
          padding: 10px;
          font-size: 16px;
          margin-bottom: 20px;
          width: 200px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #2e2e2e;
          color: white;
        }
        .submit-btn {
          padding: 10px 20px;
          font-size: 18px;
          background-color: #f6b93b;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .submit-btn:hover {
          background-color: #f39c12;
        }
        .t
