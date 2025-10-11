import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("0"); // "0" means All
  
  // Get both username and role to confirm logged-in state
  const username = sessionStorage.getItem("username");
  const userRole = sessionStorage.getItem("userRole");

  // --- Data Fetching Logic (Unchanged) ---
  const loadProducts = async () => {
    try {
      const res = await fetch("https://localhost:7212/api/Product/getAll");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch("https://localhost:7212/api/Category/getAll");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // --- Navigation and Logout Logic ---
  const viewProduct = (id) => {
    if (!username) {
      navigate("/login");
    } else {
      navigate(`/viewProduct?productId=${id}`);
    }
  };
  
  // ADDED: Logout function
  const logout = () => {
    sessionStorage.clear(); // Clear all session data
    navigate("/login");     // Redirect to login page
  };

  // --- Reusable Tailwind Class String ---
  const inputBaseClasses = "block w-full rounded-lg border-gray-300 bg-white py-3 px-4 shadow-sm transition duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500";
  
  return (
    <>
      <Header />
      <div className="min-h-screen w-full bg-gray-100 font-sans">
        <div className="container mx-auto space-y-12 px-4 py-16">

          {/* --- Hero Section --- */}
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Welcome To Bid<span className="text-indigo-600">ify</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 md:text-xl">
              Discover unique items and place your bids in our live auctions. Your next treasure awaits.
            </p>
            
            {/* ADDED: Welcome message and Logout button for logged-in users */}
            {username && (userRole === "Admin" || userRole === "Bidder" || userRole === "Seller") && (
                <div className="mt-8 flex items-center justify-center gap-x-4 rounded-xl border border-gray-200 bg-white p-4 max-w-lg mx-auto shadow-sm">
                    <p className="text-md text-gray-800">
                        Logged in as <span className="font-bold text-indigo-600">{username}</span> ({userRole})
                    </p>
                    <button
                        onClick={logout}
                        className="rounded-lg bg-red-600 py-2 px-5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-red-700 active:scale-95"
                    >
                        Logout
                    </button>
                </div>
            )}
          </div>

          {/* --- Filter and Title Section --- */}
          <div className="flex flex-col items-center justify-between gap-6 border-t border-gray-200 pt-8 sm:flex-row">
            <h2 className="text-3xl font-bold text-gray-800">Live Auctions</h2>
            <div className="w-full sm:w-auto">
              <label htmlFor="categoryFilter" className="sr-only">Filter by category</label>
              <select
                id="categoryFilter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`${inputBaseClasses} sm:w-64`}
              >
                <option value="0">All Categories</option>
                {categories.map((c) => (
                  <option key={c.cat_Id} value={c.cat_Id}>{c.cat_Name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* --- Product Cards Grid --- */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products
              .filter((p) => selectedCategory === "0" || p.cat_Id.toString() === selectedCategory)
              .map((p) => (
                <div key={p.product_Id} className="group flex transform-gpu flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2">
                  <div className="overflow-hidden">
                    <img
                      src={`https://localhost:7212/uploads/${p.photo}`}
                      alt={p.product_Name}
                      className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-grow flex-col p-5">
                    <div className="flex items-center justify-between">
                      <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800">
                        {p.categoryName}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          p.status === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {p.status === 1 ? "Live" : "Closed"}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-gray-900 truncate">{p.product_Name}</h3>
                    <p className="mt-2 flex-grow text-sm text-gray-600 line-clamp-3">{p.description}</p>
                    <div className="mt-5 border-t border-gray-100 pt-4">
                      <p className="text-sm text-gray-500">Starting Bid</p>
                      <p className="text-2xl font-bold text-indigo-600">${p.min_Bid_Price?.toFixed(2)}</p>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">
                      Auction ends: {new Date(p.end_Date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => viewProduct(p.product_Id)}
                      className="w-full rounded-lg bg-blue-600 py-3 text-center text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-700 active:scale-95"
                    >
                      {username ? "View & Place Bid" : "Login to View & Bid"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;