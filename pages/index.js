import { useState } from "react";

const games = [
  {
    name: "Game 1",
    url: "https://newgame1url.com", // Game URL
    icon: "/games/game1-icon.png", // Game icon
  },
  {
    name: "Game 2",
    url: "https://newgame2url.com",
    icon: "/games/game2-icon.png",
  },
  // Add more games here
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState("");

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

      <style jsx>{`
        .container {
          background-color: #121212;
          color: #fff;
          text-align: center;
          padding: 20px;
          font-family: 'Arial', sans-serif;
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
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
        }

        .game-iframe {
          width: 80%;
          height: 80%;
          border: none;
          border-radius: 10px;
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
