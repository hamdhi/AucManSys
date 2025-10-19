import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function UpdateProduct() {
  // --- State and Hooks  ---
  const [catId, setCatId] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [minBid, setMinBid] = useState("");
  const [status, setStatus] = useState("");
  const [photo, setPhoto] = useState("");
  const [endDate, setEndDate] = useState("");
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  
  // State for category dropdown
  const [categories, setCategories] = useState([]);

  const username = sessionStorage.getItem("username") ?? "Unknown";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = parseInt(searchParams.get("id"));

  // --- Data Fetching Logic (with added category fetch) ---
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(`https://localhost:7212/api/Product/getById/${productId}`);
        const p = await res.json();
        setCatId(p.cat_Id);
        setProductName(p.product_Name);
        setDescription(p.description);
        setMinBid(p.min_Bid_Price);
        setStatus(p.status);
        setPhoto(p.photo);
        // Ensure date is formatted correctly for the input type="date"
        setEndDate(new Date(p.end_Date).toISOString().split("T")[0]);
      } catch (err) {
        console.error("Error loading product:", err);
        alert("Could not load product data.");
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
    
    loadProduct();
    loadCategories();
  }, [productId]);

  // --- Form Submission Logic (Unchanged) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("cat_Id", catId);
    formData.append("username", username);
    formData.append("product_Name", productName);
    formData.append("description", description);
    formData.append("min_Bid_Price", minBid);
    formData.append("status", status);
    formData.append("photo", photo); // old photo name
    formData.append("end_Date", endDate);
    if (newPhotoFile) {
      formData.append("newPhoto", newPhotoFile); // new photo file
    }

    try {
      const res = await fetch(`https://localhost:7212/api/Product/update/${productId}`, {
        method: "PUT",
        body: formData,
      });
      if (res.ok) {
        alert("Product updated successfully!");
        navigate("/productList");
      } else {
        const error = await res.text();
        alert("Update failed: " + error);
      }
    } catch (err) {
      console.error("Error updating product:", err);
      alert("An unexpected error occurred during the update.");
    }
  };
  
  // --- Reusable Tailwind Class Strings ---
  //Added 'border' and changed background to 'bg-white' for better contrast
  const inputClasses = "block w-full rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-gray-900 shadow-sm transition duration-300 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6";
  const labelClasses = "block text-sm font-medium leading-6 text-gray-700";

  return (
    <>
      <Header />
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 py-12 font-sans">
        <div className="w-full max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl bg-white p-8 shadow-2xl">
            {/* --- Form Header --- */}
            <div className="border-b border-gray-900/10 pb-8">
              <h2 className="text-center text-3xl font-bold leading-7 text-gray-900">Update Product Details</h2>
              <p className="mt-2 text-center text-sm leading-6 text-gray-600">
                Editing product ID: {productId} as <span className="font-semibold">{username}</span>
              </p>
            </div>

            {/* --- Form Fields --- */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="productName" className={labelClasses}>Product Name</label>
                <input type="text" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} required className={inputClasses} />
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="description" className={labelClasses}>Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className={inputClasses} />
              </div>

              <div>
                <label htmlFor="catId" className={labelClasses}>Category</label>
                <select id="catId" value={catId} onChange={(e) => setCatId(e.target.value)} required className={inputClasses}>
                  <option value="" disabled>Select a category...</option>
                  {categories.map((c) => (<option key={c.cat_Id} value={c.cat_Id}>{c.cat_Name}</option>))}
                </select>
              </div>

              <div>
                <label htmlFor="minBid" className={labelClasses}>Minimum Bid Price ($)</label>
                <input type="number" id="minBid" value={minBid} onChange={(e) => setMinBid(e.target.value)} required className={inputClasses} step="0.01"/>
              </div>

              <div>
                <label htmlFor="status" className={labelClasses}>Status</label>
                <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} required className={inputClasses}>
                  <option value="1">Available for Bidding</option>
                  <option value="0">Not Available / Closed</option>
                </select>
              </div>

              <div>
                <label htmlFor="endDate" className={labelClasses}>Auction End Date</label>
                <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className={inputClasses} />
              </div>

              {photo && (
                <div className="sm:col-span-2 text-center">
                    <label className={labelClasses}>Current Photo</label>
                    <img src={`https://localhost:7212/uploads/${photo}`} alt="Current product" className="mt-2 mx-auto h-auto max-h-60 w-auto rounded-lg object-contain shadow-md"/>
                </div>
              )}

              <div className="sm:col-span-2">
                  <label htmlFor="newPhotoFile" className={labelClasses}>Upload New Photo (Optional)</label>
                  <input type="file" id="newPhotoFile" accept="image/*" onChange={(e) => setNewPhotoFile(e.target.files[0])} className={`${inputClasses} mt-2 p-2 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-100 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-200`}/>
                  <p className="mt-1 text-xs text-gray-500">Only upload a new photo if you wish to replace the current one.</p>
              </div>
            </div>
            
            {/* --- Action Buttons --- */}
            <div className="mt-8 flex items-center justify-end gap-x-4 border-t border-gray-900/10 pt-8">
              <button type="button" onClick={() => navigate("/productList")} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300">
                Cancel
              </button>
              <button type="submit" className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Update Product
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UpdateProduct;