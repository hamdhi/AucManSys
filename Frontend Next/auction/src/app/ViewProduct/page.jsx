"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ViewProductPage({ searchParams }) {
  const productId = searchParams?.productId;
  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [currentMinBid, setCurrentMinBid] = useState(0);

  useEffect(() => {
    if (!productId) return;
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    const res = await fetch(`https://localhost:7212/api/Product/getById/${productId}`);
    const data = await res.json();
    setProduct(data);
    setCurrentMinBid(data.min_Bid_Price);
    loadBids();
  };

  const loadBids = async () => {
    const res = await fetch(`https://localhost:7212/api/Bids/getByProduct/${productId}`);
    const data = await res.json();
    setBids(data);

    // Update current min bid
    let maxBid = data.reduce((max, b) => (b.bidAmount > max ? b.bidAmount : max), 0);
    if (maxBid > currentMinBid) setCurrentMinBid(maxBid);
  };

  const placeBid = async () => {
    const amount = parseFloat(bidAmount);
    if (!amount || amount <= currentMinBid) {
      alert(`Your bid must be higher than current minimum bid: ${currentMinBid}`);
      return;
    }

    const res = await fetch("https://localhost:7212/api/Bids/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ProductId: parseInt(productId), BidAmount: amount }),
      credentials: "include",
    });

    if (res.ok) {
      alert("Bid placed successfully!");
      setBidAmount("");
      loadBids();
    } else {
      const err = await res.text();
      alert("Error placing bid: " + err);
    }
  };


  //Convert Time Logic
  const formatTime = (iso) => {
  if (!iso) return "";

  // Ensure ISO string is valid UTC
  let date = new Date(iso);
  if (isNaN(date.getTime())) {
    // fallback: manually parse
    date = new Date(iso + "Z"); // append Z for UTC
  }

  // Convert to Colombo timezone (+05:30)
  const colomboTime = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);

  // Format as "dd MMM yyyy, hh:mm AM/PM"
  return colomboTime.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

  if (!product) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="min-h-screen p-4 bg-gray-50 font-sans text-sm max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-1">{product.product_Name}</h2>
      <p className="text-gray-700 mb-2">{product.description}</p>
     <Image
  src={product.photo ? `/images/${product.photo}` : "/images/placeholder.png"} // fallback if no photo
  alt={product.product_Name}
  width={300} // set fixed width
  height={200} // set fixed height
  className="mb-2 rounded shadow-sm object-cover"
/>

   <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Enter your bid"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="border rounded px-2 py-1 w-36 text-sm"
        />
        <button
          onClick={placeBid}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm"
        >
          Place Bid
        </button>
      </div>

      <p className="mb-4">
        Minimum Bid: <span className="font-semibold">{currentMinBid}</span>
      </p>

      <h3 className="font-semibold mb-2">Current Bids</h3>
      <ul className="mb-4">
        {bids.length === 0 ? (
          <li className="text-gray-500">No bids yet.</li>
        ) : (
          bids.map((b) => (
            <li key={b.id} className="flex justify-between border-b py-1">
              <span className="font-bold">{b.username}</span>
              <span className="text-green-600 font-semibold">{b.bidAmount}</span>
              <span className="text-gray-500 text-xs">{formatTime(b.bidTime)}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
