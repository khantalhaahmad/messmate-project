import React, { useEffect, useState, useContext } from "react";
import api from "../services/api";
import "../styles/AdminDashboard.css";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Fetch data from backend
  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [summaryRes, earningsRes] = await Promise.all([
        api.get("/admin/daily-summary", config),
        api.get("/admin/mess-earnings", config),
      ]);

      setSummary(summaryRes.data);
      setEarnings(earningsRes.data);
    } catch (error) {
      console.error("❌ Error fetching admin data:", error);
    }
  };

  // ✅ Fetch once on load
  useEffect(() => {
    fetchAdminData();
  }, []);

  // ✅ Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ⏳ Loading state
  if (!summary) {
    return (
      <div className="admin-loading-screen">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* ===== HEADER BAR ===== */}
      <header className="admin-header">
        <h1>MessMate Admin Dashboard</h1>
        <div className="admin-header-right">
          <span className="admin-info">
            👋 {user?.name || "Admin"}
          </span>
          <span className="admin-date">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* ===== SUMMARY CARDS ===== */}
      <section className="summary-section">
        <div className="summary-card">
          <h3>Total Orders (Today)</h3>
          <p>{summary.totalOrders}</p>
        </div>

        <div className="summary-card">
          <h3>Total Revenue (₹)</h3>
          <p>{summary.totalRevenue}</p>
        </div>

        <div className="summary-card">
          <h3>Total Mess Owners</h3>
          <p>{summary.totalOwners}</p>
        </div>

        <div className="summary-card">
          <h3>Total Students</h3>
          <p>{summary.totalStudents}</p>
        </div>
      </section>

      {/* ===== MESS EARNINGS TABLE ===== */}
      <section className="table-section">
        <h2>Mess-wise Earnings (Today)</h2>
        <table className="earnings-table">
          <thead>
            <tr>
              <th>Mess Name</th>
              <th>Owner Name</th>
              <th>Owner Email</th>
              <th>Total Orders</th>
              <th>Total Earnings (₹)</th>
            </tr>
          </thead>
          <tbody>
            {earnings.length > 0 ? (
              earnings.map((item, index) => (
                <tr key={index}>
                  <td>{item.mess_name}</td>
                  <td>{item.owner_name}</td>
                  <td>{item.owner_email}</td>
                  <td>{item.totalOrders}</td>
                  <td className="earning-value">{item.totalEarnings}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No earnings data available today.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;
