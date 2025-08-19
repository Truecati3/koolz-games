import { useState } from "react";

const games = [
  {
    name: "1v1.lol",
    url: "https://1v1.lol/",
    icon: "https://img.utdstc.com/icon/983/22a/98322a3b2be892eed31589906ffd949b68bcccc9a21ba562987965b5ec6bc6de:200",
  },
  {
    name: "Run 3",
    url: "https://run3.io/",
    icon: "https://play-lh.googleusercontent.com/3GrNf6x0Ce4-hhczQ4F1hNYRm8YH6P-7jYwBZc5n-MtvWptLtxaFkGSllWJcXrIl6zU=w240-h480-rw",
  },
  {
    name: "Slope",
    url: "https://slopegame.online/",
    icon: "https://play-lh.googleusercontent.com/-P2XAg2Yk7PBr5y6s8pYyVlyPpZuJHX8D5X1uEdvEJr-2QW1zYt3x2OD9E4p6OkU3g=w240-h480-rw",
  },
  {
    name: "Retro Bowl",
    url: "https://retrobowl.me/",
    icon: "https://play-lh.googleusercontent.com/uEjANmNOnxz2jS0LljY0hOJvHWFlqgVcpIRSRYj8Z2Uwe4F7dOGQhW_pjHEJS0xjSOY=w240-h480-rw",
  },
  {
    name: "Minecraft Classic",
    url: "https://classic.minecraft.net/",
    icon: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/8/80/Grass_Block_JE6_BE3.png",
  },
  {
    name: "Basketball Stars",
    url: "https://basketballstars.co/",
    icon: "https://play-lh.googleusercontent.com/yvSP2mYuk0O1GlUF8dXsgtyyEMdIoX15mP9JzK4hNScCgL8h1u7VixIboWgX0o9nxg=w240-h480-rw",
  },
  {
    name: "Drift Hunters",
    url: "https://drift-hunters.com/",
    icon: "https://play-lh.googleusercontent.com/EMKkb13gM3z72EVe6vJdPddY8ovS24-vzOYhXmm-SCg96QceF-LK7lRQW-OhBjXwUys=w240-h480-rw",
  },
  {
    name: "Friday Night Funkin'",
    url: "https://www.kbhgames.com/game/friday-night-funkin",
    icon: "https://static.wikia.nocookie.net/fridaynightfunkin/images/f/f0/Boyfriend.png",
  },
  {
    name: "Flappy Bird",
    url: "https://flappybird.io/",
    icon: "https://upload.wikimedia.org/wikipedia/en/0/0a/Flappy_Bird_icon.png",
  },
  {
    name: "Cookie Clicker",
    url: "https://orteil.dashnet.org/cookieclicker/",
    icon: "https://play-lh.googleusercontent.com/I8uFhG_BeTWcF6RWQXtFUmSbA1u0Ztxm3rStNU7uWZzHmhzvA3ovMjzOPmUnE2N5iT0=w240-h480-rw",
  },
  {
    name: "Google Snake",
    url: "https://snake.googlemaps.com/",
    icon: "https://play-lh.googleusercontent.com/D0kffUuKIV0R7HhG6cvNxkVsm1k3wJZsQ3bpM9IsdUnRzRP8KkX08nRtoCcQkR7yGQ=w240-h480-rw",
  },
  {
    name: "Pac-Man",
    url: "https://www.google.com/logos/2010/pacman10-i.html",
    icon: "https://upload.wikimedia.org/wikipedia/en/5/59/Pac-man.png",
  },
  {
    name: "Tetris",
    url: "https://tetris.com/play-tetris",
    icon: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Tetris.JPG",
  },
  {
    name: "Crossy Road",
    url: "https://crossyroad.io/",
    icon: "https://play-lh.googleusercontent.com/5l0rjRkdqj7bHL52UjU5biAAQXkfbzjqD-9IY9cWiSFG6wHbBB48rjOVwJsv9p2U1Q=w240-h480-rw",
  },
  {
    name: "Moto X3M",
    url: "https://www.coolmathgames.com/0-moto-x3m",
    icon: "https://play-lh.googleusercontent.com/LzN12Ap3MPe1hA8upTuwfZeq5r0fWbbhF0mSUh5F1gpiE8JqI_4eVJ9imT24FcQjRrM=w240-h480-rw",
  },
  {
    name: "Shell Shockers",
    url: "https://shellshock.io/",
    icon: "https://shellshock.io/img/favicon.png",
  },
  {
    name: "Krunker",
    url: "https://krunker.io/",
    icon: "https://krunker.io/img/favicon.png",
  },
  {
    name: "Paper.io 2",
    url: "https://paper-io.com/",
    icon: "https://play-lh.googleusercontent.com/LPJZtW9k5WjWW8R8QH1srX3mw7w2D-w6A3iKqMThZz5JJGg0jipbL2Y4mjlw4U9mZFo=w240-h480-rw",
  },
  {
    name: "Agar.io",
    url: "https://agar.io/",
    icon: "https://play-lh.googleusercontent.com/WAvzkdxl3p2kCwmtDiPf1n3foBMp35zk1k8KeEuC1IuQW08BKnGJjbQzUuIDGFhftmA=w240-h480-rw",
  },
  {
    name: "Slither.io",
    url: "https://slither.io/",
    icon: "https://slither.io/s/fav/snake.png",
  },
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
