import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!user) {
    // If no user, redirect to login
    if (typeof window !== "undefined") router.push("/login");
    return <p className="text-center mt-10">Redirecting to login...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.displayName} 🎉</h1>
      <p className="text-lg">This is your dashboard.</p>
    </div>
  );
}
