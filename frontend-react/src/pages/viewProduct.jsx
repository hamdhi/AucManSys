import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function ViewProduct() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [currentMinBid, setCurrentMinBid] = useState(0);
  const [countdown, setCountdown] = useState("");
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [highestBid, setHighestBid] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);

  const loggedInUser = sessionStorage.getItem("username");

  // Load product
  useEffect(() => {
    if (!productId) return;

    fetch(`https://localhost:7212/api/Product/getById/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setCurrentMinBid(data.min_Bid_Price);
      })
      .catch(console.error);
  }, [productId]);

  // Load bids once on mount
  useEffect(() => {
    if (!productId) return;

    fetch(`https://localhost:7212/api/Bids/getByProduct/${productId}`)
      .then((res) => res.json())
      .then((data) => setBids(data))
      .catch(console.error);
  }, [productId]);

  // Compute highest bid whenever bids change
  useEffect(() => {
    if (bids.length === 0) {
      setHighestBid(null);
      setCurrentMinBid(product?.min_Bid_Price ?? 0);
      return;
    }

    const topBid = bids.reduce((prev, curr) =>
      curr.bidAmount > prev.bidAmount ? curr : prev
    );

    setHighestBid(topBid);
    setCurrentMinBid(topBid.bidAmount);
  }, [bids, product?.min_Bid_Price]);

  // Countdown timer
  useEffect(() => {
    if (!product) return;

    const interval = setInterval(() => {
      const endTime = new Date(product.end_Date).getTime();
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance <= 0) {
        setCountdown("⏳ Auction Ended!");
        setAuctionEnded(true);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [product]);

  // Place bid instantly updates state
  const placeBid = async () => {
    const amount = parseFloat(bidAmount);
    if (!amount || amount <= 0) {
      alert("Enter a valid bid amount");
      return;
    }
    if (amount <= currentMinBid) {
      alert("Your bid must be higher than the current minimum bid: " + currentMinBid);
      return;
    }

    try {
      const res = await fetch("https://localhost:7212/api/Bids/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ProductId: parseInt(productId), BidAmount: amount }),
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const newBid = await res.json();

      // React-style instant update
      setBids((prev) => [...prev, newBid]);
      setBidAmount("");
      alert("Bid placed successfully!");
    } catch (err) {
      alert("Error placing bid: " + err.message);
    }
  };

  // Buy now (highest bidder only)
  const buyNow = async () => {
  try { // <-- open try here
    if (!highestBid || highestBid.username !== loggedInUser) {
      alert("Only the highest bidder can buy this product.");
      return;
    }

    const paymentPayload = {
      id: 0, // usually ignored by backend
      userId: loggedInUser,
      amount: highestBid.bidAmount,
      method: "Card",
      date: new Date().toISOString(),
      status: "Paid",
    };

 const res = await fetch("https://localhost:7212/api/Payments", { // correct URL
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(paymentPayload),
  credentials: "include",
});

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    alert("Payment successful! Thank you for your purchase.");
    setPaymentDone(true);
    navigate("/productList");

  } catch (err) { 
    alert("Error processing payment: " + err.message);
  }
};

  return (
    <>
      <Header />
      <div className="admin-container">
        {product ? (
          <div className="admin-card">
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded mb-4 hover:bg-gray-400"
              onClick={() => navigate("/productList")}
            >
              &larr; Back to Product List
            </button>

            <h2>{product.product_Name}</h2>
            <p>{product.description}</p>
            {product.photo ? (
              <img
                src={`https://localhost:7212/uploads/${product.photo}`}
                alt={product.product_Name}
                className="product-image"
              />
            ) : (
              <p>No image available</p>
            )}

            <p>Minimum Bid: {currentMinBid}</p>
            <p>{countdown}</p>

            {!auctionEnded && (
              <div>
                <input
                  className="admin-input"
                  type="number"
                  placeholder="Enter your bid"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
                <button className="admin-button" onClick={placeBid}>
                  Place Bid
                </button>
              </div>
            )}

            {/* Buy Now button appears instantly for highest bidder */}
            {auctionEnded && highestBid?.username === loggedInUser && !paymentDone && (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded mt-4 hover:bg-green-700"
                onClick={buyNow}
              >
                Buy Now
              </button>
            )}

            <h3 className="mt-6">Current Bids</h3>
            {bids.length === 0 ? (
              <p>No bids yet.</p>
            ) : (
              <table className="w-full border border-gray-300 mt-2">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">Username</th>
                    <th className="border px-4 py-2 text-left">Bid Amount</th>
                    <th className="border px-4 py-2 text-left">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.map((b, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{b.username}</td>
                      <td className="border px-4 py-2">{b.bidAmount}</td>
                      <td className="border px-4 py-2">
                        {new Date(b.bidTime).toLocaleString("en-GB", {
                          timeZone: "Asia/Colombo",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <p>Loading product...</p>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ViewProduct;
