import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Seller.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
    navigate("/productList");
  };

  return (
    <>
    <Header />
    <div className="seller-container">
      <div className="seller-card">
        <h1>Seller</h1>
        <h2>Username: {username ?? "Unknown"}</h2>

        <button className="seller-button" onClick={logout}>Logout</button>
        <button className="seller-button" onClick={goToProductList}>View Products</button>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default Seller;
