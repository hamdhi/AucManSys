import { useEffect } from "react";
import "../General.css";

function Admin() {
  const username = sessionStorage.getItem("username");
  const role = sessionStorage.getItem("userRole");
  const apiBase = "https://localhost:7212/api/Report"; // change if needed

  // Security check
  useEffect(() => {
    if (role !== "Admin") {
      alert("Access denied! Redirecting to login.");
      window.location.href = "login.html";
    }
  }, [role]);

  // Logout
  const logout = () => {
    sessionStorage.clear();
    window.location.href = "login.html";
  };

  // Download PDF helper
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

  // Download Monthly Report
  const downloadMonthlyReport = async () => {
    const year = document.getElementById("reportYear").value;
    const month = document.getElementById("reportMonth").value;
    if (!year || !month) {
      alert("Enter year and month");
      return;
    }

    try {
      const res = await fetch(`${apiBase}/monthly/${year}/${month}`, {
        method: "GET",
      });
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
    <div>
      <h1>Admin Panel</h1>
      <h2>Username: {username ?? "Unknown"}</h2>

      <button onClick={() => (window.location.href = "ProductList.html")}>
        View Products
      </button>
      <button onClick={() => (window.location.href = "UserList.html")}>
        View Users
      </button>

      <div>
        <h3>Monthly Report</h3>
        <input
          type="number"
          id="reportYear"
          placeholder="Year (e.g. 2025)"
        />
        <input
          type="number"
          id="reportMonth"
          placeholder="Month (1-12)"
        />
        <button onClick={downloadMonthlyReport}>Download PDF</button>
      </div>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Admin;
