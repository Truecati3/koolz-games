// /pages/admin.js
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export default function AdminPage() {
  const { user, role, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    async function load() {
      if (role === "admin") {
        const snap = await getDocs(collection(db, "users"));
        setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    }
    if (!loading && user) load();
  }, [user, role, loading]);

  if (loading) return <p style={{ padding: 20 }}>Loading…</p>;
  if (!user) return <p style={{ padding: 20 }}>Please sign in to view this page.</p>;
  if (role !== "admin") return <p style={{ padding: 20 }}>🚫 Not authorized.</p>;

  const toggleBan = async (id, banned) => {
    await updateDoc(doc(db, "users", id), { banned: !banned });
    setUsers((u) => u.map((x) => (x.id === id ? { ...x, banned: !banned } : x)));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin</h1>
      <input
        placeholder="Search email…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ padding: 8, margin: "10px 0", width: "100%", maxWidth: 420 }}
      />
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr><th>Email</th><th>Role</th><th>Banned</th><th>Action</th></tr>
        </thead>
        <tbody>
          {users
            .filter((u) => u.email?.toLowerCase().includes(q.toLowerCase()))
            .map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.role || "user"}</td>
                <td>{u.banned ? "Yes" : "No"}</td>
                <td>
                  <button onClick={() => toggleBan(u.id, u.banned)}>
                    {u.banned ? "Unban" : "Ban"}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
