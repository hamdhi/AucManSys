import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function ViewProduct() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");

  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [currentMinBid, setCurrentMinBid] = useState(0);
  const [countdown, setCountdown] = useState("");

  // Load product
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(
          `https://localhost:7212/api/Product/getById/${productId}`
        );
        const data = await res.json();
        setProduct(data);
        setCurrentMinBid(data.min_Bid_Price);
      } catch (err) {
        console.error("Error loading product:", err);
      }
    };

    if (productId) loadProduct();
  }, [productId]);

  // Load bids
  const loadBids = async () => {
    try {
      const res = await fetch(
        `https://localhost:7212/api/Bids/getByProduct/${productId}`
      );
      const data = await res.json();

      // Update currentMinBid
      let maxBid = product?.min_Bid_Price ?? 0;
      data.forEach((b) => {
        if (b.bidAmount > maxBid) maxBid = b.bidAmount;
      });
      setCurrentMinBid(maxBid);

      setBids(data);
    } catch (err) {
      console.error("Error loading bids:", err);
    }
  };

  useEffect(() => {
    if (!product) return;

    const interval = setInterval(() => {
      const endTime = new Date(product.end_Date).getTime();
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance <= 0) {
        setCountdown("⏳ Auction Ended!");
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

  // Place bid
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

      alert("Bid placed successfully!");
      setBidAmount("");
      loadBids();
    } catch (err) {
      alert("Error placing bid: " + err.message);
    }
  };

  return (
    <div>
      {product ? (
        <>
          <h2>{product.product_Name}</h2>
          <p>{product.description}</p>
          <img
            src={`/images/${product.photo}`}
            alt="Product"
            style={{ maxWidth: "300px", display: "block", margin: "10px 0" }}
          />
          <p>Minimum Bid: {currentMinBid}</p>
          <p>{countdown}</p>

          <div>
            <input
              type="number"
              placeholder="Enter your bid"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              disabled={countdown === "⏳ Auction Ended!"}
            />
            <button
              onClick={placeBid}
              disabled={countdown === "⏳ Auction Ended!"}
            >
              Place Bid
            </button>
          </div>

          <h3>Current Bids</h3>
          <ul>
            {bids.length === 0 ? (
              <li>No bids yet.</li>
            ) : (
              bids.map((b, index) => (
                <li key={index}>
                  <span className="bid-user">{b.username}</span> -{" "}
                  <span className="bid-amount">{b.bidAmount}</span> -{" "}
                  <span className="bid-time">
                    {new Date(b.bidTime).toLocaleString("en-GB", {
                      timeZone: "Asia/Colombo",
                    })}
                  </span>
                </li>
              ))
            )}
          </ul>
        </>
      ) : (
        <p>Loading product...</p>
      )}
    </div>
  );
}

export default ViewProduct;
