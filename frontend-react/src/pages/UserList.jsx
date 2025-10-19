import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function UserList() {
  // --- State and Hooks  ---
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Bidder");
  const [newIsActive, setNewIsActive] = useState("true");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();
  const loggedInUser = sessionStorage.getItem("username") ?? "Unknown";
  const userRole = sessionStorage.getItem("userRole");

  // --- Logic for Security and Data Handling  ---
  useEffect(() => {
    if (userRole !== "Admin") {
      alert("Access denied! Redirecting to login.");
      navigate("/login", { replace: true });
    } else {
      loadUsers();
    }
  }, [userRole, navigate]);

  const loadUsers = async () => {
    try {
      const res = await fetch("https://localhost:7212/api/UserAuth/getAll");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error loading users:", err);
      alert("Failed to load user data.");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      alert("Password is required for a new user.");
      return;
    }
    const dto = {
      Username: newUsername,
      Email: newEmail,
      PasswordHash: newPassword,
      Role: newRole,
      IsActive: newIsActive === "true",
    };

    try {
      const response = await fetch("https://localhost:7212/api/UserAuth/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });
       if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to add user.");
      }
      // Reset form
      setNewUsername("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("Bidder");
      setNewIsActive("true");
      loadUsers(); // Refresh list
    } catch (err) {
      console.error("Error adding user:", err);
      alert(`Error adding user: ${err.message}`);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this user?")) {
      try {
        await fetch(`https://localhost:7212/api/UserAuth/delete/${id}`, { method: "DELETE" });
        loadUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user.");
      }
    }
  };

  const editUser = (id) => navigate(`/updateUser?id=${id}`);

  // --- Reusable Tailwind Class Strings ---
  const inputClasses = "block w-full rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-gray-900 shadow-sm transition duration-300 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6";
  const buttonBaseClasses = "rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 ease-in-out hover:-translate-y-0.5 active:scale-95";

  return (
    <>
      <Header />
      <div className="min-h-screen w-full bg-gray-100 font-sans">
        <div className="container mx-auto space-y-12 px-4 py-12">
          
          {/* --- Page Header --- */}
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">User Management</h1>
              <p className="mt-1 text-sm text-gray-500">Logged in as Admin: {loggedInUser}</p>
            </div>
            <button onClick={() => navigate("/admin")} className={`${buttonBaseClasses} bg-indigo-600 hover:bg-indigo-700`}>Back to Admin Panel</button>
          </div>

          {/* --- Add New User Form Card --- */}
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <div className="border-b border-gray-200 pb-5">
              <h2 className="text-2xl font-bold leading-7 text-gray-900">Add a New User</h2>
              <p className="mt-1 text-sm text-gray-600">Create a new account and assign a role.</p>
            </div>
            <form onSubmit={handleAddUser} className="mt-6">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-6">
                <div className="lg:col-span-2">
                  <input type="text" placeholder="Username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required className={inputClasses}/>
                </div>
                <div className="lg:col-span-2">
                  <input type="email" placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required className={inputClasses}/>
                </div>
                <div className="lg:col-span-2">
                  <input type="password" id="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className={inputClasses}/>
                </div>
                <div className="lg:col-span-2">
                  <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className={inputClasses}>
                    <option value="Bidder">Bidder</option>
                    <option value="Seller">Seller</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="lg:col-span-2">
                  <select value={newIsActive} onChange={(e) => setNewIsActive(e.target.value)} className={inputClasses}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div className="lg:col-span-2 flex items-center">
                  <button type="submit" className={`${buttonBaseClasses} w-full bg-green-600 hover:bg-green-700`}>Add User</button>
                </div>
              </div>
            </form>
          </div>
          
          {/* --- User List Table Card --- */}
          <div className="rounded-2xl bg-white shadow-xl overflow-hidden">
             <div className="p-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold leading-7 text-gray-900">Existing Users</h2>
                <p className="mt-1 text-sm text-gray-600">View, edit, or delete existing user accounts.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Username</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((u) => (
                    <tr key={u.userId} className="transition-colors hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{u.username}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{u.email}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{u.role}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ u.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end gap-x-4">
                          <button onClick={() => editUser(u.userId)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                          <button onClick={() => deleteUser(u.userId)} className="text-red-600 hover:text-red-900">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UserList;