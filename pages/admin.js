// pages/admin.js
import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user, role, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      setUsers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    if (role === "admin") fetchUsers();
  }, [role]);

  const toggleBan = async (id, currentStatus) => {
    await updateDoc(doc(db, "users", id), { banned: !currentStatus });
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, banned: !currentStatus } : u)));
  };

  if (loading) return <main className="page"><div className="auth-card"><p>Loading…</p></div></main>;

  if (!user || role !== "admin") {
    return (
      <main className="page">
        <div className="auth-card">
          <p>🚫 You are not authorized to view this page.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="auth-card" style={{ maxWidth: 900, width: "100%" }}>
        <h1>👑 Admin Dashboard</h1>

        <input
          type="text"
          placeholder="Search users by email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="auth-input"
          style={{ marginBottom: 12 }}
        />

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #23263b" }}>
                <th style={{ textAlign: "left", padding: 8 }}>Email</th>
                <th style={{ textAlign: "left", padding: 8 }}>Role</th>
                <th style={{ textAlign: "left", padding: 8 }}>Banned</th>
                <th style={{ textAlign: "left", padding: 8 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((u) => u.email?.toLowerCase().includes(search.toLowerCase()))
                .map((u) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid #23263b" }}>
                    <td style={{ padding: 8 }}>{u.email}</td>
                    <td style={{ padding: 8 }}>{u.role || "user"}</td>
                    <td style={{ padding: 8 }}>{u.banned ? "🚫 Yes" : "✅ No"}</td>
                    <td style={{ padding: 8 }}>
                      <button
                        className="btn"
                        onClick={() => toggleBan(u.id, u.banned)}
                        style={{ background: u.banned ? "#1e7e34" : "#8b0000" }}
                      >
                        {u.banned ? "Unban" : "Ban"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
