import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user, role } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (role === "admin") {
      const fetchUsers = async () => {
        const snapshot = await getDocs(collection(db, "users")); // ✅ fixed here
        setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      };
      fetchUsers();
    }
  }, [role]);

  const toggleBan = async (id, currentStatus) => {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, { banned: !currentStatus });

    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, banned: !currentStatus } : u
      )
    );
  };

  if (role !== "admin") {
    return <p>🚫 You are not authorized to view this page.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>👑 Admin Dashboard</h1>

      <input
        type="text"
        placeholder="Search users by email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", margin: "10px 0", width: "100%" }}
      />

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid black" }}>
            <th>Email</th>
            <th>Role</th>
            <th>Banned</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((u) =>
              u.email?.toLowerCase().includes(search.toLowerCase())
            )
            .map((u) => (
              <tr key={u.id} style={{ borderBottom: "1px solid #ccc" }}>
                <td>{u.email}</td>
                <td>{u.role || "user"}</td>
                <td>{u.banned ? "🚫 Yes" : "✅ No"}</td>
                <td>
                  <button
                    onClick={() => toggleBan(u.id, u.banned)}
                    style={{
                      padding: "6px 10px",
                      background: u.banned ? "green" : "red",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "5px",
                    }}
                  >
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
