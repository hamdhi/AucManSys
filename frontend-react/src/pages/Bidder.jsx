import React, { useEffect } from "react";
import "./Bidder.css";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";



function Bidder() {
  const username = sessionStorage.getItem("username");
  const role = sessionStorage.getItem("userRole");
  const navigate = useNavigate();


  // Security check on mount
  useEffect(() => {
    if (role !== "Bidder") {
      alert("Access denied! Redirecting to login.");
      navigate("/login");

    }
  }, [navigate, role]);

  // Logout function
  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <>    
    <Header />
    <div className="bidder-container">
      <div className="bidder-card">
        <h1>Bidder Panel</h1>
        <h2>Username: {username ?? "Unknown"}</h2>

        <div className="button-group">
          <button onClick={() => (navigate("/productList"))}>
            View Products
          </button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default Bidder;
