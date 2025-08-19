import { useState } from "react";

const games = [
  { name: "2048", url: "/games/2048/index.html", icon: "https://img.icons8.com/color/96/000000/2048.png" },
  { name: "Snake", url: "/games/snake/index.html", icon: "https://img.icons8.com/color/96/000000/snake.png" },
  { name: "Tetris", url: "/games/tetris/index.html", icon: "https://img.icons8.com/color/96/000000/tetris.png" },
  { name: "Flappy Bird", url: "/games/flappy/index.html", icon: "https://img.icons8.com/color/96/000000/bird.png" },
  { name: "Pac-Man", url: "/games/pacman/index.html", icon: "https://img.icons8.com/color/96/000000/pacman.png" },
  { name: "Minesweeper", url: "/games/minesweeper/index.html", icon: "https://img.icons8.com/color/96/000000/minesweeper.png" },
  { name: "Breakout", url: "/games/breakout/index.html", icon: "https://img.icons8.com/color/96/000000/breakout.png" },
].sort((a, b) => a.name.localeCompare(b.name));

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const correctPassword = "letmein";

  const openGame = (url) => {
    setCurrentGame(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentGame("");
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  const clearSearch = () => setSearchTerm("");

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>
      ) : (
        <div>
          <h1 className="title">Unblocked Games Hub</h1>

          {/* 🔍 Search Bar with Clear Button */}
          <div className="search-bar">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search games..."
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-btn" onClick={clearSearch}>Clear</button>
            )}
          </div>

          {/* If no games found */}
          {filteredGames.length === 0 ? (
            <p className="no-results">No games found.</p>
          ) : (
            <div className="games-container">
              {filteredGames.map((game) => (
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
          )}

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

        .title {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #f6b93b;
        }

        .search-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 30px;
          gap: 10px;
        }

        .search-input {
          padding: 10px;
          width: 60%;
          font-size: 16px;
          border-radius: 8px;
          border: 1px solid #444;
          background-color: #1e1e1e;
          color: white;
        }

        .clear-btn {
          padding: 10px 15px;
          font-size: 14px;
          background-color: #e74c3c;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .clear-btn:hover {
          background-color: #c0392b;
        }

        .no-results {
          font-size: 18px;
          color: #aaa;
          margin-top: 20px;
        }

        .games-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 20px;
          justify-items: center;
        }

        .game-icon {
          cursor: pointer;
          width: 150px;
          text-align: center;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .game-icon:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }

        .icon-img {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 10px;
        }

        .game-name {
          margin-top: 10px;
          font-size: 16px;
          color: #ddd;
          font-weight: 500;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
          width: 100%;
          height: 100%;
          padding: 0;
          margin: 0;
        }

        .game-iframe {
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 0;
          max-width: 100%;
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background-color: #f6b93b;
          color: white;
          font-size: 24px;
          font-weight: bold;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          cursor: pointer;
        }

        .close-btn:hover {
          background-color: #f39c12;
        }
      `}</style>
    </div>
  );
}
