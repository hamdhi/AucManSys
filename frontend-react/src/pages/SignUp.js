import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation

// Helper component for the page logo/header
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
  const [role, setRole] = useState("Bidder"); // Default to Bidder for a better user experience
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
        alert("User added successfully! Please log in.");
        navigate("/login");
      } else {
        const errorText = await response.text();
        alert("Failed to add user: " + errorText);
      }
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Error connecting to server");
    }
  };

  // A reusable input component for consistency
  const FormInput = ({ id, type, placeholder, value, onChange }) => (
    <div>
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={id}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );

  return (
    // Main container to center the form
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <FormHeader />

        {/* The form card */}
        <div className="mt-8 bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormInput
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <FormInput
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <FormInput
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div>
              <label htmlFor="role" className="sr-only">
                Sign up as
              </label>
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