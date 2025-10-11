import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
      alert("Please enter both year and month.");
      return;
    }

    try {
      const res = await fetch(`${apiBase}/monthly/${year}/${month}`);
      if (!res.ok) {
        alert("Error fetching report. Please check the year and month.");
        return;
      }
      const blob = await res.blob();
      downloadPDF(blob, `MonthlyReport_${year}_${month}.pdf`);
    } catch (err) {
      console.error(err);
      alert("An error occurred while downloading the PDF.");
    }
  };

  // Common class strings for consistent styling
  const primaryButtonClasses = "w-full rounded-lg bg-indigo-600 py-3 px-5 text-base font-semibold text-white shadow-lg transition-transform duration-300 ease-in-out hover:bg-indigo-700 hover:-translate-y-1 active:scale-95";
  const inputClasses = "w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base transition duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <>
      <Header />
      {/* Full-page container with a subtle background color */}
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4 font-sans">
        
        {/* Main card with modern styling */}
        <div className="w-full max-w-2xl space-y-8 rounded-2xl bg-white p-8 text-center shadow-2xl md:p-12">
          
          {/* Header Section */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <h2 className="mt-2 text-xl text-gray-500">
              Welcome, <span className="font-medium text-gray-800">{username ?? "Admin"}</span>
            </h2>
          </div>

          {/* Navigation Buttons */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button onClick={() => navigate("/productList")} className={primaryButtonClasses}>
              View Products
            </button>
            <button onClick={() => navigate("/userList")} className={primaryButtonClasses}>
              View Users
            </button>
            {role === "Admin" && (
              <button onClick={() => navigate("/paymentInfo")} className={primaryButtonClasses}>
                View Payments
              </button>
            )}
          </div>

          {/* Report Section */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">Generate Monthly Report</h3>
            <div className="flex flex-col gap-4 sm:flex-row">
              <input type="number" id="reportYear" placeholder="Year (e.g., 2025)" className={inputClasses} />
              <input type="number" id="reportMonth" placeholder="Month (1-12)" className={inputClasses} />
            </div>
            <button onClick={downloadMonthlyReport} className={`mt-4 ${primaryButtonClasses}`}>
              Download PDF Report
            </button>
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-200 pt-8">
            <button
              onClick={logout}
              className="w-full rounded-lg bg-red-600 py-3 px-5 text-base font-semibold text-white shadow-lg transition-transform duration-300 ease-in-out hover:bg-red-700 hover:-translate-y-1 active:scale-95"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}

export default Admin;