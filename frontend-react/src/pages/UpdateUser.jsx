import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function UpdateUser() {
  // --- State and Hooks---
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");

  const loggedInUsername = sessionStorage.getItem("username") ?? "Unknown";
  const userRole = sessionStorage.getItem("userRole");

  // --- Logic for Security and Data Handling ---
  useEffect(() => {
    if (userRole !== "Admin") {
      alert("Access denied! Redirecting to login.");
      navigate("/login");
    }
  }, [userRole, navigate]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch(`https://localhost:7212/api/UserAuth/getById/${userId}`);
        if (!res.ok) throw new Error("Failed to load user data.");
        const user = await res.json();
        setUsername(user.username);
        setEmail(user.email);
        setRole(user.role);
        setIsActive(user.isActive);
      } catch (err) {
        alert(err.message);
        navigate("/admin"); // Navigate back if user can't be loaded
      }
    };
    if (userId) loadUser();
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dto = {
      Username: username,
      Email: email,
      Role: role,
      IsActive: isActive,
      PasswordHash: password.trim().length ? password : null,
    };

    try {
      const res = await fetch(`https://localhost:7212/api/UserAuth/update/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "An unknown error occurred.");
      }
      alert("User updated successfully!");
      navigate("/admin");
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  // --- Reusable Tailwind Class Strings ---
  const inputClasses = "block w-full rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-gray-900 shadow-sm transition duration-300 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6";
  const labelClasses = "block text-sm font-medium leading-6 text-gray-700";

  return (
    <>
      <Header />
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 py-12 font-sans">
        <div className="w-full max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl bg-white p-8 shadow-2xl">
            {/* --- Form Header --- */}
            <div className="border-b border-gray-900/10 pb-8">
              <h2 className="text-center text-3xl font-bold leading-7 text-gray-900">Update User Profile</h2>
              <p className="mt-2 text-center text-sm leading-6 text-gray-600">
                Editing as Admin: <span className="font-semibold">{loggedInUsername}</span>
              </p>
            </div>

            {/* --- Form Fields --- */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              <div>
                <label htmlFor="username" className={labelClasses}>Username</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required className={inputClasses}/>
              </div>

              <div>
                <label htmlFor="email" className={labelClasses}>Email Address</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClasses}/>
              </div>

              <div>
                <label htmlFor="role" className={labelClasses}>User Role</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required className={inputClasses}>
                  <option value="" disabled>Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Seller">Seller</option>
                  <option value="Bidder">Bidder</option>
                </select>
              </div>

              <div>
                <label htmlFor="password" className={labelClasses}>New Password</label>
                <input type="password" id="password" placeholder="Leave blank to keep current" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClasses}/>
              </div>
              
              <div className="sm:col-span-2">
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input id="isActive" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label htmlFor="isActive" className="font-medium text-gray-900">Account Active</label>
                    <p className="text-gray-500">Inactive users will not be able to log in.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Action Buttons --- */}
            <div className="mt-8 flex items-center justify-end gap-x-4 border-t border-gray-900/10 pt-8">
              <button type="button" onClick={() => navigate("/admin")} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300">
                Cancel
              </button>
              <button type="submit" className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Update User
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UpdateUser;