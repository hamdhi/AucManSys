import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserList() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [roleInput, setRoleInput] = useState("Admin");
  const [isActiveInput, setIsActiveInput] = useState("true");

  const navigate = useNavigate();
  const currentUser = sessionStorage.getItem("username") ?? "Unknown";
  const userRole = sessionStorage.getItem("userRole");

  // Security check
  useEffect(() => {
    setUsername(currentUser);
    if (userRole !== "Admin") {
      alert("Access denied! Redirecting to login.");
      navigate("/login");
    }
  }, [currentUser, userRole, navigate]);

  // Load users
  const loadUsers = async () => {
    try {
      const res = await fetch("https://localhost:7212/api/UserAuth/getAll");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Add user
  const handleAddUser = async (e) => {
    e.preventDefault();
    const dto = {
      Username: username,
      Email: email,
      PasswordHash: document.getElementById("password").value,
      Role: roleInput,
      IsActive: isActiveInput === "true",
    };

    try {
      await fetch("https://localhost:7212/api/UserAuth/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });
      setUsername("");
      setEmail("");
      setRoleInput("Admin");
      setIsActiveInput("true");
      loadUsers();
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (window.confirm("Delete this user?")) {
      try {
        await fetch(`https://localhost:7212/api/UserAuth/delete/${id}`, {
          method: "DELETE",
        });
        loadUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  // Edit user
  const editUser = (id) => {
    navigate(`/updateuser?id=${id}`);
  };

  // Logout
  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <h2>Logged in as: {currentUser}</h2>
      <button onClick={logout}>Logout</button>
      <button onClick={() => navigate("/admin")}>Back to Admin Panel</button>
      <br />
      <br />

      <h3>Add New User</h3>
      <form onSubmit={handleAddUser}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input type="text" id="password" placeholder="Password" required />
        <select value={roleInput} onChange={(e) => setRoleInput(e.target.value)}>
          <option value="Admin">Admin</option>
          <option value="Seller">Seller</option>
          <option value="Bidder">Bidder</option>
        </select>
        <select
          value={isActiveInput}
          onChange={(e) => setIsActiveInput(e.target.value)}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      <h3>User List</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>IsActive</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.userId}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.isActive ? "Active" : "Inactive"}</td>
              <td>
                <button onClick={() => editUser(u.userId)}>Edit</button>
                <button onClick={() => deleteUser(u.userId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
