"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [products, setProducts] = useState([]);

  const [catId, setCatId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [minBid, setMinBid] = useState("");
  const [status, setStatus] = useState("");
  const [photo, setPhoto] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const storedRole = sessionStorage.getItem("userRole");
    const storedUsername = sessionStorage.getItem("username");

    if (!["Admin", "Seller", "Bidder"].includes(storedRole)) {
      alert("Access denied! Redirecting to login.");
      router.push("/Login");
      return;
    }

    setUsername(storedUsername);
    setRole(storedRole);
    loadProducts();
  }, [router]);

  const loadProducts = async () => {
    const res = await fetch("https://localhost:7212/api/Product/getAll");
    const data = await res.json();
    setProducts(data);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const dto = {
      cat_Id: +catId,
      username,
      product_Name: name,
      description,
      min_Bid_Price: +minBid,
      status: +status,
      photo,
      end_Date: endDate,
    };
    await fetch("https://localhost:7212/api/Product/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    loadProducts();
  };

  const deleteProduct = async (id) => {
    if (confirm("Delete this product?")) {
      await fetch(`https://localhost:7212/api/Product/delete/${id}`, {
        method: "DELETE",
      });
      loadProducts();
    }
  };

  const editProduct = (id) => router.push(`/UpdateProduct?id=${id}`);
  const viewProduct = (id) => router.push(`/ViewProduct?productId=${id}`);
  const logout = () => {
    sessionStorage.clear();
    router.push("/Login");
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50 text-sm font-sans">
      <div className="max-w-6xl mx-auto bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-gray-700 text-base">
            Logged in as: {username}
          </h2>
          <div className="flex gap-2">
            {role === "Admin" && (
              <button
                onClick={() => router.push("/UserList")}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs transition"
              >
                Users List
              </button>
            )}
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs transition"
            >
              Logout
            </button>
          </div>
        </div>

        <form
          onSubmit={handleAddProduct}
          className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-4"
        >
          <input
            type="number"
            placeholder="Category ID"
            required
            value={catId}
            onChange={(e) => setCatId(e.target.value)}
            className="p-1 border rounded text-xs w-full sm:w-auto"
          />
          <input
            type="text"
            placeholder="Product Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-1 border rounded text-xs w-full sm:w-auto"
          />
          <input
            type="text"
            placeholder="Description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-1 border rounded text-xs w-full sm:w-auto"
          />
          <input
            type="number"
            placeholder="Min Bid"
            required
            value={minBid}
            onChange={(e) => setMinBid(e.target.value)}
            className="p-1 border rounded text-xs w-full sm:w-auto"
          />
          <input
            type="number"
            placeholder="Status"
            required
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-1 border rounded text-xs w-full sm:w-auto"
          />
          <input
            type="text"
            placeholder="Photo URL"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            className="p-1 border rounded text-xs w-full sm:w-auto"
          />
          <input
            type="date"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-1 border rounded text-xs w-full sm:w-auto"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs transition"
          >
            Add
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-xs">
            <thead className="bg-gray-200">
              <tr>
                {[
                  "ID",
                  "Category",
                  "Username",
                  "Name",
                  "Description",
                  "Min Bid",
                  "Status",
                  "Photo",
                  "Start",
                  "End",
                  "Actions",
                ].map((th) => (
                  <th key={th} className="p-1 border font-medium">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.product_Id} className="hover:bg-gray-50">
                  <td className="p-1 border">{p.product_Id}</td>
                  <td className="p-1 border">{p.categoryName}</td>
                  <td className="p-1 border">{p.username}</td>
                  <td className="p-1 border">{p.product_Name}</td>
                  <td className="p-1 border">{p.description}</td>
                  <td className="p-1 border">{p.min_Bid_Price}</td>
                  <td className="p-1 border">
                    {p.status === 1 ? "Available" : "Not Available"}
                  </td>
                  <td className="p-1 border">{p.photo}</td>
                  <td className="p-1 border">
                    {new Date(p.start_Date).toLocaleString()}
                  </td>
                  <td className="p-1 border">
                    {new Date(p.end_Date).toLocaleDateString()}
                  </td>
                  <td className="p-1 border flex flex-col gap-1">
                    <button
                      onClick={() => editProduct(p.product_Id)}
                      className="bg-yellow-500 text-white px-2 py-0.5 rounded hover:bg-yellow-600 text-xs transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p.product_Id)}
                      className="bg-red-500 text-white px-2 py-0.5 rounded hover:bg-red-600 text-xs transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => viewProduct(p.product_Id)}
                      className="bg-blue-500 text-white px-2 py-0.5 rounded hover:bg-blue-600 text-xs transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
