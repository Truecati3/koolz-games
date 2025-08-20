import { useState, useMemo } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

const games = [
  { name: "1v1.lol", url: "https://1v1.lol/", icon: "https://img.utdstc.com/icon/983/22a/98322a3b2be892eed31589906ffd949b68bcccc9a21ba562987965b5ec6bc6de:200" },
  { name: "Slope", url: "https://slopegame.online/", icon: "https://slither.io/s/fav/snake.png" },
  // add as many as you like...
];

export default function Home() {
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState(null); // {name,url}
  const [iframeError, setIframeError] = useState(false);

  const filtered = useMemo(
    () => games
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter(g => g.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const open = (g) => {
    setIframeError(false);
    setCurrent(g);
  };
  const close = () => {
    setCurrent(null);
  };

  const isAuthed = status === "authenticated";
  const banned = isAuthed && session.user?.banned;

  return (
    <div className="container">
      <header className="topbar">
        <h1 className="title">Koolz Games</h1>
        <div className="auth">
          {status === "loading" ? null : isAuthed ? (
            <>
              <span className="hello">Hi, {session.user.email}</span>
              {session.user.role === "admin" && (
                <a className="adminLink" href="/admin">Admin</a>
              )}
              <button onClick={() => signOut()} className="btn">Log out</button>
            </>
          ) : (
            <>
              <a className="btn" href="/auth/login">Log in</a>
              <a className="btn secondary" href="/auth/signup">Sign up</a>
            </>
          )}
        </div>
      </header>

      {!isAuthed ? (
        <p className="hint">Log in to play.</p>
      ) : banned ? (
        <p className="hint">Your account is banned.</p>
      ) : (
        <>
          <div className="searchBar">
            <input
              className="searchInput"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search games…"
            />
            {search && (
              <button className="clearBtn" onClick={() => setSearch("")}>Clear</button>
            )}
          </div>

          {filtered.length === 0 ? (
            <p className="hint">No games found.</p>
          ) : (
            <div className="grid">
              {filtered.map(g => (
                <div className="card" key={g.name} onClick={() => open(g)}>
                  <img className="icon" src={g.icon} alt={g.name} />
                  <div className="name">{g.name}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Fullscreen modal */}
      {current && (
        <div className="overlay">
          <button className="close" onClick={close}>✕</button>
          {!iframeError ? (
            <iframe
              src={current.url}
              className="frame"
              allowFullScreen
              onError={() => setIframeError(true)}
            />
          ) : (
            <div className="frameError">
              <h2>Can’t embed this site</h2>
              <p>
                This site prevents embedding in iframes. 
                <a href={current.url} target="_blank" rel="noreferrer"> Open in a new tab</a>.
              </p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .container { background:#121212; min-height:100vh; color:#fff; padding:16px; font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial; }
        .topbar { display:flex; align-items:center; justify-content:space-between; gap:12px; }
        .title { margin:8px 0; color:#f6b93b; }
        .auth { display:flex; align-items:center; gap:10px; }
        .hello { opacity:.8; }
        .adminLink { color:#f6b93b; text-decoration:none; border-bottom:1px dotted #f6b93b; }
        .btn { background:#f6b93b; color:#121212; border:0; padding:8px 12px; border-radius:8px; cursor:pointer; text-decoration:none; }
        .btn.secondary { background:#333; color:#fff; }
        .hint { text-align:center; margin-top:40px; opacity:.8; }
        .searchBar { display:flex; justify-content:center; align-items:center; gap:10px; margin:20px auto 24px; }
        .searchInput { width:60%; max-width:520px; padding:10px 12px; border-radius:10px; border:1px solid #444; background:#1e1e1e; color:#fff; }
        .clearBtn { padding:10px 12px; background:#e74c3c; color:#fff; border:0; border-radius:8px; cursor:pointer; }
        .grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap:16px; }
        .card { background:#1a1a1a; border-radius:14px; padding:10px; cursor:pointer; box-shadow: 0 4px 16px rgba(0,0,0,.25); transition:.2s; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 10px 22px rgba(0,0,0,.35); }
        .icon { width:100%; height:110px; object-fit:cover; border-radius:10px; }
        .name { text-align:center; margin-top:8px; color:#ddd; }
        .overlay { position:fixed; inset:0; background:rgba(0,0,0,.95); display:flex; }
        .close { position:absolute; top:16px; right:16px; background:#f6b93b; color:#121212; border:0; width:44px; height:44px; border-radius:50%; font-size:20px; cursor:pointer; }
        .frame { border:0; width:100vw; height:100vh; }
        .frameError { margin:auto; text-align:center; }
      `}</style>
    </div>
  );
}
