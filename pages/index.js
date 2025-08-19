import { useState } from "react";

--- a/pages/index.js
+++ b/pages/index.js
@@
 const games = [
   {
-    name: "1v1.lol",
-    url: "https://1v1.lol/", // Game URL
-    icon: "https://img.utdstc.com/icon/983/22a/98322a3b2be892eed31589906ffd949b68bcccc9a21ba562987965b5ec6bc6de:200", // URL to an external image
+    name: "1v1.lol",
+    url: "https://1v1.lol/",
+    icon: "https://img.utdstc.com/icon/983/22a/98322a3b2be892eed31589906ffd949b68bcccc9a21ba562987965b5ec6bc6de:200",
   },
   {
-    name: "Game 2",
-    url: "https://newgame2url.com",
-    icon: "https://example.com/images/game2-icon.png", // URL to an external image
+    name: "2048",
+    url: "/games/2048/index.html",
+    icon: "/games/icons/2048.png",
+  },
+  {
+    name: "Snake",
+    url: "/games/snake/index.html",
+    icon: "/games/icons/snake.png",
+  },
+  {
+    name: "Tetris",
+    url: "/games/tetris/index.html",
+    icon: "/games/icons/tetris.png",
+  },
+  {
+    name: "Flappy Bird",
+    url: "/games/flappy/index.html",
+    icon: "/games/icons/flappy.png",
+  },
+  {
+    name: "Pac-Man",
+    url: "/games/pacman/index.html",
+    icon: "/games/icons/pacman.png",
+  },
+  {
+    name: "Minesweeper",
+    url: "/games/minesweeper/index.html",
+    icon: "/games/icons/minesweeper.png",
+  },
+  {
+    name: "Breakout",
+    url: "/games/breakout/index.html",
+    icon: "/games/icons/breakout.png",
   },
   // Add more games here
 ];


export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Handle password submission (secure: checks server API)
  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
      } else {
        alert("Incorrect password. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const openGame = (url) => {
    setCurrentGame(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentGame("");
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

        .title {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 40px;
          color: #f6b93b;
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
