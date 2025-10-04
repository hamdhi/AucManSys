import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Reusable header component updated with "Bidify" branding
const FormHeader = () => (
  <div className="text-center">
    <a href="/" className="inline-flex items-center space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8 text-indigo-600"
      >
        {/* Updated Gavel Icon */}
        <path d="M1 21h12v2H1zM19.34 7.34c-1.3-1.3-3.39-1.3-4.69 0l-1.06 1.06-2.12-2.12 1.06-1.06c1.3-1.3 1.3-3.39 0-4.69s-3.39-1.3-4.69 0l-4.24 4.24c-1.3 1.3-1.3 3.39 0 4.69l4.24 4.24c1.3 1.3 3.39 1.3 4.69 0l1.06-1.06 2.12 2.12-1.06 1.06c-1.3 1.3-1.3 3.39 0 4.69s3.39 1.3 4.69 0l4.24-4.24c1.3-1.3 1.3-3.39 0-4.69l-4.24-4.24zM3.81 10.18l-1.41 1.41c-.59.59-.59 1.54 0 2.12l4.24 4.24c.59.59 1.54.59 2.12 0l1.41-1.41L3.81 10.18zm14.77-1.41l-4.24-4.24c-.59-.59-1.54-.59-2.12 0L10.81 6l6.36 6.36 1.41-1.41c.58-.59.58-1.54 0-2.12z" />
      </svg>
      {/* Updated Brand Name */}
      <span className="text-2xl font-bold text-gray-800">
        Bid<span className="text-indigo-600">ify</span>
      </span>
    </a>
    <h2 className="mt-6 text-3xl font-bold text-gray-800">
      Create Your Account
    </h2>
    <p className="mt-2 text-sm text-gray-600">
      Join our community of bidders and sellers today.
    </p>
  </div>
);


function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Bidder");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      Username: username,
      Email: email,
      PasswordHash: password,
      Role: role,
      IsActive: true,
    };

    try {
      const response = await fetch(
        "https://localhost:7212/api/UserAuth/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dto),
        }
      );

      if (response.ok) {
        alert("Account created successfully! Please log in.");
        navigate("/login");
      } else {
        const errorText = await response.text();
        alert("Failed to create account: " + errorText);
      }
    } catch (err) {
      console.error("Sign up error:", err);
      alert("Error connecting to the server.");
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
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Bidder">Sign up as a Bidder</option>
                <option value="Seller">Sign up as a Seller</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
