import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user, role, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (role === "admin") {
      const fetchUsers = async () => {
        const snapshot = await getDocs(collection(db, "
