"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // for app directory

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [panelMessage, setPanelMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:7212/api/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setPanelMessage(data);
        return;
      }

      switch (data.panel) {
        case "Admin Panel":
          sessionStorage.setItem("userRole", "Admin");
          sessionStorage.setItem("username", data.username);
          router.push("/Admin");
          break;
        case "Seller Panel":
          sessionStorage.setItem("userRole", "Seller");
          sessionStorage.setItem("username", data.username);
          router.push("/Seller");
          break;
        case "Bidder Panel":
          sessionStorage.setItem("userRole", "Bidder");
          sessionStorage.setItem("username", data.username);
          router.push("/Bidder");
          break;
        default:
          sessionStorage.setItem("username", data.username);
          alert("Unknown role");
      }
    } catch (error) {
      setPanelMessage("Error connecting to server.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login Form</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>

        {panelMessage && (
          <div className="mt-4 text-red-500 text-center">{panelMessage}</div>
        )}
      </div>
    </div>
  );
}
