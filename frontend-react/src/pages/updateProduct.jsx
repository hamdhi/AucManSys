import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./updateProduct.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

function UpdateProduct() {
  const [catId, setCatId] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [minBid, setMinBid] = useState("");
  const [status, setStatus] = useState("");
  const [photo, setPhoto] = useState("");
  const [endDate, setEndDate] = useState("");
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const username = sessionStorage.getItem("username") ?? "Unknown";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = parseInt(searchParams.get("id"));

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(
          `https://localhost:7212/api/Product/getById/${productId}`
        );
        const p = await res.json();
        setCatId(p.cat_Id);
        setProductName(p.product_Name);
        setDescription(p.description);
        setMinBid(p.min_Bid_Price);
        setStatus(p.status);
        setPhoto(p.photo);
        setEndDate(new Date(p.end_Date).toISOString().split("T")[0]);
      } catch (err) {
        console.error("Error loading product:", err);
      }
    };
    loadProduct();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("cat_Id", catId);
    formData.append("username", username);
    formData.append("product_Name", productName);
    formData.append("description", description);
    formData.append("min_Bid_Price", minBid);
    formData.append("status", status);
    formData.append("photo", photo);
    formData.append("end_Date", endDate);
    if (newPhotoFile) formData.append("newPhoto", newPhotoFile);

    try {
      const res = await fetch(
        `https://localhost:7212/api/Product/update/${productId}`,
        { method: "PUT", body: formData }
      );
      if (res.ok) {
        alert("Product updated!");
        navigate("/productList");
      } else {
        const error = await res.text();
        alert("Update failed: " + error);
      }
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Update failed");
    }
  };

  return (
    <>
    <Header />
    <div className="update-container">
      <div className="update-card">
        <h2>Update Product</h2>
        <h3>Logged in as: {username}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Category ID"
            value={catId}
            onChange={(e) => setCatId(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Min Bid"
            value={minBid}
            onChange={(e) => setMinBid(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Status (1/0)"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
          {photo && (
            <div className="current-photo">
              <p>Current Photo:</p>
              <img
                src={`https://localhost:7212/uploads/${photo}`}
                alt="Current product"
                className="product-image"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewPhotoFile(e.target.files[0])}
          />
          <input
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          <button type="submit">Update Product</button>
        </form>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default UpdateProduct;
