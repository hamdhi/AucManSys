import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Seller");
  const [isActive, setIsActive] = useState("true");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      Username: username,
      Email: email,
      PasswordHash: password,
      Role: role,
      IsActive: isActive === "true",
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
        alert("User added successfully!");
        navigate("/login"); // redirect to login page
      } else {
        const errorText = await response.text();
        alert("Failed to add user: " + errorText);
      }
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Error connecting to server");
    }
  };

  return (
    <div>
      <h2>Sign Up Form</h2>
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
        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Seller">Seller</option>
          <option value="Bidder">Bidder</option>
        </select>
        <br />
        <select
          value={isActive}
          onChange={(e) => setIsActive(e.target.value)}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <br />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
}

export default SignUp;
