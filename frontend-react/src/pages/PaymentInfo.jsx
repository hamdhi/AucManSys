import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function PaymentInfo() {
  const role = sessionStorage.getItem("userRole");
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [selectedUser, setSelectedUser] = useState("All");
  const apiBase = "https://localhost:7212/api/Payments";

  useEffect(() => {
    if (role !== "Admin") {
      alert("Access denied! Redirecting to login.");
      navigate("/login");
      return;
    }

    const fetchPayments = async () => {
      try {
        const res = await fetch(apiBase);
        if (!res.ok) throw new Error("Failed to fetch payments");
        const data = await res.json();
        setPayments(data);
      } catch (err) {
        console.error(err);
        alert("Error fetching payment data");
      }
    };

    fetchPayments();
  }, [navigate, role]);

  // Group payments by userId for easier display
  const paymentsByUser = payments.reduce((acc, payment) => {
    const userId = payment.userId || "Unknown User";
    if (!acc[userId]) acc[userId] = [];
    acc[userId].push(payment);
    return acc;
  }, {});

  const userIds = ["All", ...Object.keys(paymentsByUser)];

  return (
    <>
      <Header />
      <div className="min-h-screen w-full bg-gray-100 font-sans">
        <div className="container mx-auto px-4 py-12">
          
          {/* Page Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-gray-800">Payment Information</h1>
            <p className="mt-2 text-lg text-gray-500">Review all transaction records</p>
          </div>

          {/* Filter and Back Button Controls */}
          <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="relative">
              <label htmlFor="userFilter" className="absolute -top-2 left-2 inline-block bg-gray-100 px-1 text-xs font-medium text-gray-600">
                Filter by User
              </label>
              <select
                id="userFilter"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="block w-60 rounded-lg border-gray-300 bg-white py-3 px-4 shadow-sm transition duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {userIds.map((id) => (
                  <option key={id} value={id}>
                    {id === "All" ? "All Users" : `User: ${id}`}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="rounded-lg bg-indigo-600 py-3 px-6 text-base font-semibold text-white shadow-lg transition-transform duration-300 ease-in-out hover:bg-indigo-700 hover:-translate-y-1 active:scale-95"
              onClick={() => navigate("/admin")}
            >
              Back to Admin Panel
            </button>
          </div>

          {/* Payment Cards Grid */}
          {payments.length === 0 ? (
            <p className="mt-20 text-center text-xl text-gray-500">No payment records found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {Object.entries(paymentsByUser)
                .filter(([userId]) => selectedUser === "All" || selectedUser === userId)
                .map(([userId, userPayments]) => (
                  <div key={userId} className="transform-gpu rounded-2xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <div className="border-b-2 border-indigo-100 p-6">
                      <h2 className="text-xl font-bold text-gray-800">User ID:</h2>
                      <p className="truncate font-mono text-gray-600">{userId}</p>
                    </div>
                    
                    <div className="space-y-4 p-6">
                      {userPayments.map((p) => (
                        <div key={p.id} className="space-y-2 border-t border-gray-100 pt-4 first:border-t-0 first:pt-0">
                          <p className="flex justify-between text-sm">
                            <span className="font-semibold text-gray-700">Product:</span>
                            <span className="text-gray-600">{p.productName || "N/A"}</span>
                          </p>
                          <p className="flex justify-between text-sm">
                            <span className="font-semibold text-gray-700">Amount:</span>
                            <span className="font-medium text-green-600">${p.amount?.toFixed(2)}</span>
                          </p>
                          <p className="flex justify-between text-sm">
                            <span className="font-semibold text-gray-700">Date:</span>
                            <span className="text-gray-600">
                              {new Date(p.date).toLocaleString("en-GB", { timeZone: "Asia/Colombo" })}
                            </span>
                          </p>
                          <p className="flex justify-between text-sm">
                            <span className="font-semibold text-gray-700">Status:</span>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${
                                p.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {p.status}
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PaymentInfo;