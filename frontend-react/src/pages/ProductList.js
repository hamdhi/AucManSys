import React, { useState, useEffect } from "react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const username = sessionStorage.getItem("username");
  const role = sessionStorage.getItem("userRole");

  const apiBase = "https://localhost:7212/api/Report"; // change if needed

  // Load products from API
  const loadProducts = async () => {
    try {
      const res = await fetch("https://localhost:7212/api/Product/getAll");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  useEffect(() => {
    loadProducts();

    // Security check
    if (role !== "Admin" && role !== "Seller" && role !== "Bidder") {
      alert("Access denied! Redirecting to login.");
      window.location.href = "login.html";
    }
  }, []);

  // Add product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const dto = {
      cat_Id: +e.target.catId.value,
      username,
      product_Name: e.target.name.value,
      description: e.target.description.value,
      min_Bid_Price: +e.target.minBid.value,
      status: +e.target.status.value,
      photo: e.target.photo.value,
      end_Date: e.target.endDate.value,
    };

    try {
      await fetch("https://localhost:7212/api/Product/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });
      loadProducts();
      e.target.reset(); // clear form
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // Delete product
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

  // Edit product
  const editProduct = (id) => {
    window.location.href = `updateProduct.html?id=${id}`;
  };

  // View product
  const viewProduct = (id) => {
    window.location.href = `viewProduct.html?productId=${id}`;
  };

  // Logout
  const logout = () => {
    sessionStorage.clear();
    window.location.href = "login.html";
  };

  // Download PDF
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
    <div>
      <h2>Logged in as: {username ?? "Unknown"}</h2>

      {role === "Admin" && (
        <div>
          <button onClick={() => (window.location.href = "UserList.html")}>
            View Users List
          </button>
        </div>
      )}

      <button onClick={logout}>Logout</button>

      <h3>Add New Product</h3>
      <form onSubmit={handleAddProduct}>
        <select id="catId" required>
          <option value="1">Electronic</option>
          <option value="2">Fashion</option>
          <option value="3">Home and Furniture</option>
        </select>

        <input type="text" id="name" placeholder="Product Name" required />
        <input type="text" id="description" placeholder="Description" required />
        <input type="number" id="minBid" placeholder="Min Bid" required />
        <select id="status" required>
          <option value="0">Not Available</option>
          <option value="1">Available</option>
        </select>
        <input type="text" id="photo" placeholder="Photo URL" />
        <input type="date" id="endDate" required />
        <button type="submit">Add Product</button>
      </form>

      <h1>Products</h1>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category Name</th>
            <th>Username</th>
            <th>Name</th>
            <th>Description</th>
            <th>Min Bid Price</th>
            <th>Status</th>
            <th>Photo</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.product_Id}>
              <td>{p.product_Id}</td>
              <td>{p.categoryName}</td>
              <td>{p.username}</td>
              <td>{p.product_Name}</td>
              <td>{p.description}</td>
              <td>{p.min_Bid_Price}</td>
              <td>{p.status === 1 ? "Available" : "Not Available"}</td>
              <td>{p.photo}</td>
              <td>{new Date(p.start_Date).toLocaleString()}</td>
              <td>{new Date(p.end_Date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => editProduct(p.product_Id)}>Edit</button>
                <button onClick={() => deleteProduct(p.product_Id)}>Delete</button>
                <button onClick={() => viewProduct(p.product_Id)}>View</button>
                <button onClick={() => downloadAuctionReport(p.product_Id)}>
                  Download PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
