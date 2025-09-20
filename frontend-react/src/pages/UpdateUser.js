import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function UpdateUser() {
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

  // Security check: only Admin
  useEffect(() => {
    if (userRole !== "Admin") {
      alert("Access denied! Redirecting to login.");
      navigate("/login");
    }
  }, [userRole, navigate]);

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch(
          `https://localhost:7212/api/UserAuth/getById/${userId}`
        );
        if (!res.ok) throw new Error("Failed to load user");
        const user = await res.json();
        setUsername(user.username);
        setEmail(user.email);
        setRole(user.role);
        setIsActive(user.isActive);
      } catch (err) {
        alert(err.message);
      }
    };

    if (userId) loadUser();
  }, [userId]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

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
      const res = await fetch(
        `https://localhost:7212/api/UserAuth/update/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dto),
        }
      );

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      alert("User updated successfully!");
      navigate("/admin");
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  return (
    <div>
      <h2>Logged in as: {loggedInUsername}</h2>

      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => navigate("/admin")}>Back to Admin Panel</button>
      <br />
      <br />

      <h2>Update User</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Seller">Seller</option>
          <option value="Bidder">Bidder</option>
        </select>
        <br />
        <input
          type="password"
          placeholder="New Password (leave blank to keep old)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />{" "}
          Active
        </label>
        <br />
        <button type="submit">Update User</button>
      </form>
    </div>
  );
}

export default UpdateUser;
