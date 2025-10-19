import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
      {/* Full-page container to center the content */}
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4 font-sans">
        
        {/* Main card with modern styling and spacing */}
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 text-center shadow-2xl">
          
          {/* Header Section */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bidder Panel</h1>
            <h2 className="mt-2 text-xl text-gray-500">
              Welcome, <span className="font-medium text-gray-800">{username ?? "Bidder"}</span>
            </h2>
          </div>

          {/* Button Group */}
          <div className="space-y-4 pt-4">
            <button
              onClick={() => navigate("/productList")}
              className="w-full rounded-lg bg-indigo-600 py-3 px-5 text-base font-semibold text-white shadow-lg transition-transform duration-300 ease-in-out hover:bg-indigo-700 hover:-translate-y-1 active:scale-95"
            >
              View Products & Place Bids
            </button>
            <button
              onClick={logout}
              className="w-full rounded-lg bg-red-600 py-3 px-5 text-base font-semibold text-white shadow-lg transition-transform duration-300 ease-in-out hover:bg-red-700 hover:-translate-y-1 active:scale-95"
            >
              Logout
            </button>
          </div>
          
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Bidder;