import React, { useEffect } from "react";

function Bidder() {
  const username = sessionStorage.getItem("username");
  const role = sessionStorage.getItem("userRole");

  // Security check on mount
  useEffect(() => {
    if (role !== "Bidder") {
      alert("Access denied! Redirecting to login.");
      window.location.href = "login.html";
    }
  }, [role]);

  // Logout function
  const logout = () => {
    sessionStorage.clear();
    window.location.href = "login.html";
  };

  return (
    <div>
      <h1>Bidder</h1>
      <h2>Username: {username ?? "Unknown"}</h2>

      <button onClick={logout}>Logout</button>
      <button onClick={() => (window.location.href = "ProductList.html")}>
        View Products
      </button>
    </div>
  );
}

export default Bidder;
