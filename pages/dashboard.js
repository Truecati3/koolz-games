import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>You must log in to view this page.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome, {user.email}</h1>
      <p>This is your dashboard 🎉</p>
    </div>
  );
}
