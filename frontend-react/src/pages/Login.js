import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Reusable header component for branding consistency
const FormHeader = () => (
  <div className="text-center">
    <a href="/" className="inline-flex items-center space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8 text-indigo-600"
      >
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
      <span className="text-2xl font-bold text-gray-800">
        Auction<span className="text-indigo-600">House</span>
      </span>
    </a>
    <h2 className="mt-6 text-3xl font-bold text-gray-800">Welcome Back!</h2>
    <p className="mt-2 text-sm text-gray-600">
      Log in to access your account.
    </p>
  </div>
);

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await fetch("https://localhost:7212/api/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        // Use a user-friendly default message if the API response is not helpful
        setErrorMsg(data.message || "Invalid username or password.");
        return;
      }

      sessionStorage.setItem("username", data.username);

      switch (data.panel) {
        case "Admin Panel":
          sessionStorage.setItem("userRole", "Admin");
          navigate("/admin");
          break;
        case "Seller Panel":
          sessionStorage.setItem("userRole", "Seller");
          navigate("/seller");
          break;
        case "Bidder Panel":
          sessionStorage.setItem("userRole", "Bidder");
          navigate("/bidder");
          break;
        default:
          setErrorMsg("Login successful, but role is unknown.");
          break;
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Failed to connect to the server. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <FormHeader />

        <div className="mt-8 bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Error Message Display */}
            {errorMsg && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                <p>{errorMsg}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
            >
              Log In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account yet?{" "}
            <Link
              to="/SignUp"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
