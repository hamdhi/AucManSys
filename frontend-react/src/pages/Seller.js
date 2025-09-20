import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Seller() {
  const username = sessionStorage.getItem("username");
  const role = sessionStorage.getItem("userRole");
  const navigate = useNavigate();

  // Security check on mount
  useEffect(() => {
    if (role !== "Seller") {
      alert("Access denied! Redirecting to login.");
      navigate("/login");
    }
  }, [role, navigate]);

  // Logout
  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  // Navigate to Product List
  const goToProductList = () => {
    navigate("/productlist");
  };

  return (
    <div>
      <h1>Seller</h1>
      <h2>Username: {username ?? "Unknown"}</h2>

      <button onClick={logout}>Logout</button>
      <button onClick={goToProductList}>View Products</button>
    </div>
  );
}

export default Seller;
