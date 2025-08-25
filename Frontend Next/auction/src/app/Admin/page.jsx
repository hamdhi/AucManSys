"use client"; // Required if using Next.js 13 app directory

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // use next/router if using pages directory

export default function AdminPanel() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    const storedUsername = sessionStorage.getItem("username");

    if (role !== "Admin") {
      alert("Access denied! Redirecting to login.");
      router.push("/Login");
      return;
    }

    setUsername(storedUsername);
  }, [router]);

  const logout = () => {
    sessionStorage.clear();
    router.push("/Login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
        <h2 className="text-xl mb-6">Username: {username}</h2>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/ProductList")}
            className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors"
          >
            View Products
          </button>
          <button
            onClick={() => router.push("/UserList")}
            className="bg-green-500 text-white p-3 rounded hover:bg-green-600 transition-colors"
          >
            View Users
          </button>
          <button
            onClick={logout}
            className="bg-red-500 text-white p-3 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
