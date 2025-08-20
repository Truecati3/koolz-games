// pages/dashboard.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

const demoGames = [
  { id: "1", name: "2048", url: "https://play2048.co/", img: "https://i.imgur.com/8p8O3u3.jpg" },
  { id: "2", name: "Chess", url: "https://www.chess.com/play/computer", img: "https://i.imgur.com/Dt8e9wX.jpg" },
  { id: "3", name: "Tetris", url: "https://tetris.com/play-tetris", img: "https://i.imgur.com/8ZqYl1K.jpg" },
];

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [openGame, setOpenGame] = useState(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="page">
        <div className="auth-card"><p>Loading…</p></div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="wrap">
        <header className="dash-header">
          <h1 className="brand">Koolz Games</h1>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={() => router.push("/admin")}>Admin</button>
            <button className="btn" onClick={logout}>Logout</button>
          </div>
        </header>

        <section className="grid">
          {demoGames.map((g) => (
            <article key={g.id} className="card" onClick={() => setOpenGame(g)}>
              <img src={g.img} alt={g.name} />
              <span>{g.name}</span>
            </article>
          ))}
        </section>
      </div>

      {openGame && (
        <div className="modal" onClick={() => setOpenGame(null)}>
          <iframe
            className="frame"
            title={openGame.name}
            src={openGame.url}
            allow="fullscreen"
          />
          <button className="close" onClick={() => setOpenGame(null)} aria-label="Close modal">
            ×
          </button>
        </div>
      )}
    </main>
  );
}
