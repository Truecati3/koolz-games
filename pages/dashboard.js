// /pages/dashboard.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, banned } = useAuth();
  const [games, setGames] = useState([]);
  const [openUrl, setOpenUrl] = useState("");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    async function loadGames() {
      try {
        const snap = await getDocs(collection(db, "games"));
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setGames(list);
      } catch {
        // Fallback sample if no Firestore data
        setGames([
          {
            id: "1",
            name: "1v1.lol",
            url: "https://1v1.lol/",
            icon:
              "https://img.utdstc.com/icon/983/22a/98322a3b2be892eed31589906ffd949b68bcccc9a21ba562987965b5ec6bc6de:200",
          },
        ]);
      }
    }
    if (user && !loading) loadGames();
  }, [user, loading]);

  if (loading) {
    return (
      <div className="page">
        <div className="auth-card"><p>Loading…</p></div>
      </div>
    );
  }

  if (banned) {
    return (
      <div className="page">
        <div className="auth-card">
          <h1>Access Denied</h1>
          <p className="error">Your account is banned.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="wrap">
        <header className="dash-header">
          <h1 className="brand">Koolz Games</h1>
        </header>

        <div className="grid">
          {games.map((g) => (
            <button
              key={g.id}
              className="card"
              onClick={() => setOpenUrl(g.url)}
              title={g.name}
            >
              <img src={g.icon} alt={g.name} />
              <span>{g.name}</span>
            </button>
          ))}
        </div>
      </div>

      {openUrl && (
        <div className="modal" onClick={() => setOpenUrl("")}>
          <iframe className="frame" src={openUrl} />
          <button className="close" onClick={() => setOpenUrl("")}>×</button>
        </div>
      )}
    </div>
  );
}
