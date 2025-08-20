// pages/admin.js
import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const { user, role } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (role === "admin") {
        const querySnap = await getDocs(collection(db, "users"));
        const userList = querySnap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setUsers(userList);
      }
    };
    fetchUsers();
  }, [role]);

  const toggleBan = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, "users", id), { banned: !currentStatus });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, banned: !currentStatus } : u
        )
      );
    } catch (err) {
      console.error("Error banning user:", err);
    }
  };

  if (!user) return <p>❌ Not logged in</p>;
  if (role !== "admin") return <p>🚫 Access denied</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>👑 Admin Dashboard</h1>
      <h2>User Management</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.banned ? "🚫 Banned" : "✅ Active"}</td>
                <td>
                  <button onClick={() => toggleBan(u.id, u.banned)}>
                    {u.banned ? "Unban" : "Ban"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
