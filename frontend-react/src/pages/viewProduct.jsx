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
  const userRole = sessionStorage.getItem("userRole");

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

  // Send email when auction ends
  useEffect(() => {
    const sendAuctionEndEmail = async () => {
      try {
        if (!auctionEnded || !product) return;
        const emailRes = await fetch("https://localhost:7212/api/UserAuth/getAll");
        if (!emailRes.ok) throw new Error("Failed to fetch users");
        const users = await emailRes.json();
        const winnerEmail = users.find(u => u.username === highestBid?.username)?.email;
        if (winnerEmail) {
          await fetch(
            `https://localhost:7212/api/Emails?receptor=${encodeURIComponent(winnerEmail)}&subject=${encodeURIComponent("Auction Ended")}&body=${encodeURIComponent(`The auction for ${product.product_Name} has ended. You are the highest bidder with a bid of ${highestBid?.bidAmount}.`)}`,
            { method: "POST" }
          );
        }
      } catch (err) {
        console.error("❌ Error sending auction end email:", err);
      }
    };
    sendAuctionEndEmail();
  }, [auctionEnded, highestBid, product]);

  // Place bid
  const placeBid = async () => {
    if (loggedInUser === product?.username) {
      alert("You cannot place a bid on your own product.");
      return;
    }
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
      setBids((prev) => [...prev, newBid]);
      setBidAmount("");
      alert("Bid placed successfully!");
    } catch (err) {
      alert("Error placing bid: " + err.message);
    }
  };

  // Buy Now
  const buyNow = async () => {
    try {
      if (!highestBid || highestBid.username !== loggedInUser) {
        alert("Only the highest bidder can buy this product.");
        return;
      }
      const paymentPayload = {
        id: 0,
        userId: loggedInUser,
        amount: highestBid.bidAmount,
        method: "Card",
        date: new Date().toISOString(),
        status: "Paid",
      };
      const res = await fetch("https://localhost:7212/api/Payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentPayload),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      const emailRes = await fetch("https://localhost:7212/api/UserAuth/getAll");
      if (!emailRes.ok) {
        throw new Error("Failed to fetch user email");
      }
      const emailData = await emailRes.json();
      const userEmail = emailData.find(user => user.username === loggedInUser)?.email;
      if (userEmail) {
        const sendEmailRes = await fetch(
          `https://localhost:7212/api/Emails?receptor=${encodeURIComponent(userEmail)}&subject=${encodeURIComponent("About Payment")}&body=${encodeURIComponent(`Payment successful! Product: ${product.product_Name}, Amount: ${highestBid.bidAmount}`)}`,
          { method: "POST" }
        );
        if (!sendEmailRes.ok) {
          const err = await sendEmailRes.text();
          throw new Error(err);
        }
        alert("Payment successful! Thank you for your purchase.");
      } else {
        throw new Error("User email not found");
      }
      setPaymentDone(true);
      navigate("/productList");
    } catch (err) {
      alert("Error processing payment: " + err.message);
    }
  };

  // A boolean to easily check if the logged-in user is the product owner
  const isOwner = loggedInUser === product?.username;

  return (
    <>
      <Header />
      <main className="bg-gray-100 min-h-screen p-4 sm:p-6 md:p-8">
        {product ? (
          <div className="container mx-auto max-w-6xl">
            <div className="mb-6">
              <button
                className="flex items-center text-gray-600 hover:text-blue-600 font-semibold transition-colors"
                onClick={() => navigate("/productList")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Product List
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-4">
                  {product.photo ? (
                    <img src={`https://localhost:7212/uploads/${product.photo}`} alt={product.product_Name} className="w-full h-full object-cover rounded-lg min-h-[300px] md:min-h-[500px]"/>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg min-h-[300px] md:min-h-[500px]">
                      <p className="text-gray-500">No image available</p>
                    </div>
                  )}
                </div>
                <div className="p-6 md:p-8 flex flex-col">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">{product.product_Name}</h2>
                  <p className="text-sm text-gray-500 mb-4">Listed by: <span className="font-medium text-gray-700">{product.username}</span></p>
                  <p className="text-gray-600 mb-6 flex-grow">{product.description}</p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 border">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">{bids.length > 0 ? "Current Bid" : "Starting Bid"}</p>
                        <p className="text-2xl font-bold text-green-600">${currentMinBid.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Auction Ends In</p>
                        <p className={`text-2xl font-bold ${auctionEnded ? 'text-gray-500' : 'text-red-600'}`}>{countdown}</p>
                      </div>
                    </div>
                  </div>
                  {!auctionEnded && loggedInUser && (
                    <div className="mb-6">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          className="flex-grow w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-200 disabled:cursor-not-allowed"
                          type="number"
                          placeholder={isOwner ? "Bidding not allowed" : `Bid higher than $${currentMinBid}`}
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          disabled={isOwner}
                        />
                        <button
                          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
                          onClick={placeBid}
                          disabled={isOwner}
                        >
                          Place Bid
                        </button>
                      </div>
                      {isOwner && (
                        <p className="text-sm text-red-600 mt-2 text-center sm:text-left">
                          You cannot bid on a product you have listed.
                        </p>
                      )}
                    </div>
                  )}
                  {auctionEnded && highestBid?.username === loggedInUser && !paymentDone && (
                    <button className="w-full bg-green-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-lg" onClick={buyNow}>
                      Buy Now for ${highestBid.bidAmount.toLocaleString()}
                    </button>
                  )}
                  {/*Edit button is now only rendered if user is an Admin or the product owner */}
                  {(userRole === 'Admin' || isOwner) && (
                    <div className="mt-6 pt-6 border-t">
                      <button 
                        onClick={() => navigate(`/updateProduct?id=${productId}`)} 
                        className="w-full bg-yellow-500 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-all duration-300"
                      >
                        Edit Product
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Bid History</h3>
              {bids.length === 0 ? (
                <p className="text-gray-500">No bids have been placed yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="border-b-2 border-gray-200">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-600">Username</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Bid Amount</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...bids].reverse().map((b, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-700">{b.username}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">${b.bidAmount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-gray-500 text-sm">
                            {new Date(b.bidTime).toLocaleString("en-US", {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                              timeZone: "Asia/Colombo",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[60vh]">
            <p className="text-xl text-gray-500">Loading product...</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default ViewProduct;