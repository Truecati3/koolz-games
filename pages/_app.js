import "@/styles/globals.css";
import { useRouter } from "next/router";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div>
      <nav className="flex justify-between items-center px-6 py-3 bg-black text-white">
        <h1
          onClick={() => router.push("/games")}
          className="cursor-pointer font-bold text-xl"
        >
          Koolz Games
        </h1>
        {auth.currentUser && (
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Logout
          </button>
        )}
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
