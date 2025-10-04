import { useEffect } from "react";
import "./Admin.css";  // import the new CSS
import { useNavigate, Link } from "react-router-dom";
import FormHeader from "../components/Header";
import Header from "../components/Header";
import Footer from "../components/Footer";


function Admin() {
  const username = sessionStorage.getItem("username");
  const role = sessionStorage.getItem("userRole");
  const apiBase = "https://localhost:7212/api/Report"; 
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "Admin") {
      alert("Access denied! Redirecting to login.");
      navigate("/login");

    }
  }, [navigate, role]);

  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

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

  const downloadMonthlyReport = async () => {
    const year = document.getElementById("reportYear").value;
    const month = document.getElementById("reportMonth").value;
    if (!year || !month) {
      alert("Enter year and month");
      return;
    }

    try {
      const res = await fetch(`${apiBase}/monthly/${year}/${month}`);
      if (!res.ok) {
        alert("Error fetching report");
        return;
      }
      const blob = await res.blob();
      downloadPDF(blob, `MonthlyReport_${year}_${month}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Error downloading PDF");
    }
  };

  return (
    <>
    <Header/>
    <div className="admin-container">
      <div className="admin-card">
        <h1>Admin Panel</h1>
        <h2>Username: {username ?? "Unknown"}</h2>

        <button onClick={() => navigate("/productList")}>
          View Products
        </button>
        <button onClick={() => navigate("/userList")}>
          View Users
        </button>

        {role === "Admin" && (
  <button onClick={() => navigate("/paymentInfo")}>
    View Payment Info
  </button>
)}


        <div>
          <h3>Monthly Report</h3>
          <input type="number" id="reportYear" placeholder="Year (e.g. 2025)" />
          <input type="number" id="reportMonth" placeholder="Month (1-12)" />
          <button onClick={downloadMonthlyReport}>Download PDF</button>
        </div>

        <button onClick={logout}>Logout</button>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default Admin;
