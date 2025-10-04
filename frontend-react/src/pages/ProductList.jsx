import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("0"); // 0 = All
  const username = sessionStorage.getItem("username");
  const role = sessionStorage.getItem("userRole");
  const apiBase = "https://localhost:7212/api/Report";

  // Load products
  const loadProducts = async () => {
    try {
      const res = await fetch("https://localhost:7212/api/Product/getAll");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const res = await fetch("https://localhost:7212/api/Category/getAll");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
    if (role !== "Admin" && role !== "Seller" && role !== "Bidder") {
      alert("Access denied! Redirecting to login.");
      navigate("/login");
    }
  }, [navigate, role]);

  // Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Cat_Id", e.target.catId.value);
    formData.append("Username", username);
    formData.append("Product_Name", e.target.name.value);
    formData.append("Description", e.target.description.value);
    formData.append("Min_Bid_Price", e.target.minBid.value);
    formData.append("Status", e.target.status.value);
    const photoFile = e.target.photo.files[0];
    if (photoFile) formData.append("Photo", photoFile);
    formData.append("End_Date", e.target.endDate.value);

    try {
      const response = await fetch("https://localhost:7212/api/Product/add", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        loadProducts();
        e.target.reset();
      } else {
        const error = await response.text();
        alert("Error: " + error);
      }
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Error adding product: " + err.message);
    }
  };

  // Delete Product
  const deleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await fetch(`https://localhost:7212/api/Product/delete/${id}`, {
          method: "DELETE",
        });
        loadProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  // Edit / View / Logout / Download PDF
  const editProduct = (id) => navigate(`/updateProduct?id=${id}`);
  const viewProduct = (id) => navigate(`/viewProduct?productId=${id}`);
  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };
  const downloadPDF = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };
  const downloadAuctionReport = async (idValue) => {
    if (role !== "Admin") {
      alert("Only Admins can download reports.");
      return;
    }
    const proceed = window.confirm(
      "Do you want to download the auction report PDF?"
    );
    if (!proceed) return;
    if (!idValue) {
      alert("Enter auction ID");
      return;
    }
    try {
      const res = await fetch(`${apiBase}/auction/${idValue}`, { method: "GET" });
      if (!res.ok) {
        alert("Error fetching report");
        return;
      }
      const blob = await res.blob();
      downloadPDF(blob, `AuctionReport_${idValue}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Error downloading PDF");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          {/* Add Product Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Logged in as: {username ?? "Unknown"}</h2>
              <div className="flex gap-4">
                {role === "Admin" && (
                  <button
                    onClick={() => navigate("/userList")}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    View Users List
                  </button>
                )}
                <button
                  onClick={logout}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-700">Add New Product</h3>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select id="catId" required className="border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
                {categories.map((c) => (
                  <option key={c.cat_Id} value={c.cat_Id}>{c.cat_Name}</option>
                ))}
              </select>
              <input type="text" id="name" placeholder="Product Name" required className="border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
              <input type="text" id="description" placeholder="Description" required className="border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
              <input type="number" id="minBid" placeholder="Min Bid" required className="border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
              <select id="status" required className="border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="0">Not Available</option>
                <option value="1">Available</option>
              </select>
              <input type="file" id="photo" accept="image/*" className="border-gray-300 rounded-lg px-3 py-2" />
              <input type="date" id="endDate" required className="border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
              <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                Add Product
              </button>
            </form>
          </div>

          {/* Category Filter */}
          <div className="mb-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="0">All Categories</option>
              {categories.map((c) => (
                <option key={c.cat_Id} value={c.cat_Id}>{c.cat_Name}</option>
              ))}
            </select>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products
              .filter((p) => selectedCategory === "0" || p.cat_Id.toString() === selectedCategory)
              .map((p) => (
              <div key={p.product_Id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                {p.photo && (
                  <img
                    src={`https://localhost:7212/uploads/${p.photo}`}
                    alt={p.product_Name}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-6 space-y-2">
                  <span className="text-sm font-semibold text-indigo-600">{p.categoryName}</span>
                  <h3 className="text-xl font-bold text-gray-800">{p.product_Name}</h3>
                  <p className="text-gray-600">{p.description}</p>
                  <div className="text-lg font-bold text-gray-800">
                    Min Bid: ${p.min_Bid_Price}
                  </div>
                  <div className="text-sm text-gray-500">
                    Status: {p.status === 1 ? "Available" : "Not Available"}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button onClick={() => editProduct(p.product_Id)} className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition-colors">Edit</button>
                    <button onClick={() => deleteProduct(p.product_Id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">Delete</button>
                    <button onClick={() => viewProduct(p.product_Id)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors">View</button>
                    <button onClick={() => downloadAuctionReport(p.product_Id)} className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors">Download PDF</button>
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    Ends on: {new Date(p.end_Date).toLocaleDateString()}
                  </div>
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

export default ProductList;
