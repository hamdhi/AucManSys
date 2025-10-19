import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("0"); // "0" means All
  const username = sessionStorage.getItem("username");
  const role = sessionStorage.getItem("userRole");
  const apiBase = "https://localhost:7212/api/Report";

  // --- Data Fetching and Logic ---
  const loadProducts = async () => {
    try {
      const res = await fetch("https://localhost:7212/api/Product/getAll");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

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
        alert("Product added successfully!");
      } else {
        const error = await response.text();
        alert("Error: " + error);
      }
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Error adding product: " + err.message);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
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
    if (!window.confirm("Download the auction report PDF for this product?")) return;
    try {
      const res = await fetch(`${apiBase}/auction/${idValue}`);
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

  // --- Reusable Tailwind Class Strings for Consistency ---
  const inputBaseClasses = "block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4 shadow-sm transition duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const buttonBaseClasses = "rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 ease-in-out hover:-translate-y-0.5 active:scale-95";

  return (
    <>
      <Header />
      <div className="min-h-screen w-full bg-gray-100 font-sans">
        <div className="container mx-auto space-y-12 px-4 py-12">

          {/* --- Add Product Form Section --- */}
          <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Product Dashboard</h2>
                <p className="text-sm text-gray-500">Logged in as: {username ?? "Unknown"}</p>
              </div>
              <div className="flex gap-3">
                {role === "Admin" && (
                  <button onClick={() => navigate("/userList")} className={`${buttonBaseClasses} bg-indigo-600 hover:bg-indigo-700`}>View Users</button>
                )}
                <button onClick={logout} className={`${buttonBaseClasses} bg-red-600 hover:bg-red-700`}>Logout</button>
              </div>
            </div>
            
            <form onSubmit={handleAddProduct} className="mt-6">
              <h3 className="mb-6 text-xl font-bold text-gray-700">Add a New Product for Auction</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <input type="text" id="name" placeholder="Product Name" required className={inputBaseClasses} />
                <input type="text" id="description" placeholder="Description" required className={inputBaseClasses} />
                <input type="number" id="minBid" placeholder="Minimum Bid Price ($)" required className={inputBaseClasses} step="0.01" />
                <select id="catId" required className={inputBaseClasses}>
                  <option value="" disabled selected>Select a Category</option>
                  {categories.map((c) => (<option key={c.cat_Id} value={c.cat_Id}>{c.cat_Name}</option>))}
                </select>
                <select id="status" required className={inputBaseClasses}>
                  <option value="1">Available for Bidding</option>
                  <option value="0">Not Available</option>
                </select>
                <input type="date" id="endDate" required className={inputBaseClasses} />
                <div className="lg:col-span-2">
                  <label htmlFor="photo" className="text-sm font-medium text-gray-600">Product Photo</label>
                  <input type="file" id="photo" accept="image/*" className={`${inputBaseClasses} mt-1 p-2 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-100 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-200`}/>
                </div>
                <div className="flex items-end">
                  <button type="submit" className={`${buttonBaseClasses} w-full bg-green-600 hover:bg-green-700`}>Add Product</button>
                </div>
              </div>
            </form>
          </div>

          {/* --- Product Listing Section --- */}
          <div>
            <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <h2 className="text-3xl font-bold text-gray-800">Available Products</h2>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={`${inputBaseClasses} w-full sm:w-64`}>
                <option value="0">All Categories</option>
                {categories.map((c) => (<option key={c.cat_Id} value={c.cat_Id}>{c.cat_Name}</option>))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products
                .filter((p) => selectedCategory === "0" || p.cat_Id.toString() === selectedCategory)
                .map((p) => (
                  <div key={p.product_Id} className="group flex transform-gpu flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1.5">
                    <div className="overflow-hidden">
                      <img src={`https://localhost:7212/uploads/${p.photo}`} alt={p.product_Name} className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-grow flex-col p-5">
                      <div className="flex items-center justify-between">
                        <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800">{p.categoryName}</span>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${ p.status === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800" }`}>
                          {p.status === 1 ? "Available" : "Closed"}
                        </span>
                      </div>
                      <h3 className="mt-3 text-xl font-bold text-gray-900 truncate">{p.product_Name}</h3>
                      <p className="text-xs text-gray-500">Listed by: <span className="font-medium">{p.username}</span></p>
                      <p className="mt-2 flex-grow text-sm text-gray-600 line-clamp-2">{p.description}</p>
                      <div className="mt-4 border-t pt-4">
                        <p className="text-sm text-gray-500">Starting Bid</p>
                        <p className="text-2xl font-bold text-indigo-600">${p.min_Bid_Price?.toFixed(2)}</p>
                      </div>
                      <p className="mt-2 text-xs text-gray-400">Auction ends: {new Date(p.end_Date).toLocaleDateString()}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-4 pt-0">
                      {/*Buttons only rendered if user has permission */}
                      {(role === 'Admin' || username === p.username) && (
                        <>
                          <button onClick={() => navigate(`/updateProduct?id=${p.product_Id}`)} className={`${buttonBaseClasses} w-full text-center bg-yellow-500 hover:bg-yellow-600`}>Edit</button>
                          <button onClick={() => deleteProduct(p.product_Id)} className={`${buttonBaseClasses} w-full text-center bg-red-500 hover:bg-red-600`}>Delete</button>
                        </>
                      )}
                       <button onClick={() => viewProduct(p.product_Id)} className={`${buttonBaseClasses} col-span-2 w-full text-center bg-blue-600 hover:bg-blue-700`}>View & Bid</button>
                       {role === "Admin" && (
                          <button onClick={() => downloadAuctionReport(p.product_Id)} className={`${buttonBaseClasses} col-span-2 w-full text-center bg-gray-700 hover:bg-gray-800`}>Download Report</button>
                       )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductList;