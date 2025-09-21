import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the new CSS file

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
        setErrorMsg(data);
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
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Welcome Back!</h2>
        
        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="login-button">Login</button>
        
        {errorMsg && <div className="error-message">{errorMsg}</div>}
      </form>
    </div>
  );
}

export default Login;