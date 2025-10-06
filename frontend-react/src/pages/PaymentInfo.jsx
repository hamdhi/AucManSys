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

  // Group payments by userId
  const paymentsByUser = payments.reduce((acc, payment) => {
    if (!acc[payment.userId]) acc[payment.userId] = [];
    acc[payment.userId].push(payment);
    return acc;
  }, {});

  const userIds = ["All", ...Object.keys(paymentsByUser)];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Payment Information
        </h1>

        {/* Filter Dropdown */}
        <div className="flex justify-center mb-8">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {userIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>

        {payments.length === 0 ? (
          <p className="text-center text-gray-500">No payments found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(paymentsByUser)
              .filter(([userId]) => selectedUser === "All" || selectedUser === userId)
              .map(([userId, userPayments]) => (
                <div
                  key={userId}
                  className="bg-white shadow-md rounded-lg p-5 border border-gray-200"
                >
                  <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2">
                    User: {userId}
                  </h2>

                  {userPayments.map((p) => (
                    <div
                      key={p.id}
                      className="mb-4 p-4 border border-gray-100 rounded hover:bg-gray-50 transition"
                    >
                      <p>
                        <span className="font-semibold">Payment ID:</span> {p.id}
                      </p>
                      <p>
                        <span className="font-semibold">Product ID:</span> {p.productId || "-"}
                      </p>
                      <p>
                        <span className="font-semibold">Product Name:</span> {p.productName || "-"}
                      </p>
                      <p>
                        <span className="font-semibold">Amount:</span> {p.amount}
                      </p>
                      <p>
                        <span className="font-semibold">Method:</span> {p.method}
                      </p>
                      <p>
                        <span className="font-semibold">Date:</span>{" "}
                        {new Date(p.date).toLocaleString("en-GB", {
                          timeZone: "Asia/Colombo",
                        })}
                      </p>
                      <p>
                        <span className="font-semibold">Status:</span> {p.status}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => navigate("/admin")}
          >
            Back to Admin Panel
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PaymentInfo;
