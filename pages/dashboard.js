import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) {
    return <p>⚠️ You must be logged in to view the dashboard.</p>;
  }

  return (
    <div className="dashboard">
      <h1>🎉 Welcome, {user.email}!</h1>
      <p>This is your dashboard.</p>
      <button onClick={logout} className="logout-btn">Logout</button>
    </div>
  );
}
