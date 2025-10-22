import React, { useEffect, useState, useContext } from "react";
import api from "../services/api";
import "../styles/AdminDashboard.css";
import LogoutPopup from "../components/LogoutPopup";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [topMesses, setTopMesses] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [requests, setRequests] = useState([]);
  const [messList, setMessList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMess, setSelectedMess] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // ✅ added

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  /* ============================================================
     🚀 Fetch all dashboard data
  ============================================================ */
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        summaryRes,
        trendsRes,
        topRes,
        payoutsRes,
        reviewsRes,
        requestsRes,
        messListRes,
      ] = await Promise.all([
        api.get("/admin-extra/daily-summary", config),
        api.get("/admin-extra/revenue-trends", config),
        api.get("/admin-extra/top-messes", config),
        api.get("/admin-extra/owner-payouts", config),
        api.get("/admin-extra/recent-reviews", config),
        api.get("/admin-extra/mess-requests/pending", config),
        api.get("/admin-extra/mess-list", config),
      ]);

      setSummary(summaryRes.data);
      setTrends(trendsRes.data);
      setTopMesses(topRes.data);
      setPayouts(payoutsRes.data);
      setReviews(reviewsRes.data);
      setRequests(requestsRes.data);
      setMessList(messListRes.data || []);
    } catch (err) {
      console.error("❌ Dashboard fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     💸 Update payout status
  ============================================================ */
  const updatePayoutStatus = async (messName, status) => {
    try {
      await api.patch(`/admin-extra/payout-status/${messName}`, { status }, config);
      setPayouts((prev) =>
        prev.map((p) =>
          p.messName === messName ? { ...p, payoutStatus: status } : p
        )
      );
    } catch (err) {
      console.error("Failed to update payout:", err);
      alert("Failed to update payout status");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  if (loading || !summary)
    return <div className="admin-loading-screen">Loading Admin Dashboard...</div>;

  /* ============================================================
     📊 Handle revenue report navigation
  ============================================================ */
  const handleViewReport = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    navigate(
      `/admin/revenue-report?startDate=${startDate}&endDate=${endDate}&messName=${selectedMess}`
    );
  };

  /* ============================================================
     🚪 Handle Logout Confirmation
  ============================================================ */
  const handleLogoutClick = () => setShowLogoutPopup(true);

  const handleConfirmLogout = () => {
    logout(); // ✅ clears session & redirects to "/"
    setShowLogoutPopup(false);
  };

  const handleCancelLogout = () => setShowLogoutPopup(false);

  /* ============================================================
     🧭 Render Component
  ============================================================ */
  return (
    <div className="admin-dashboard">
      {/* ===== HEADER ===== */}
      <header className="admin-header">
        <h1>MessMate Admin Dashboard</h1>
        <div className="admin-header-right">
          <span>👋 {user?.name || "Admin"}</span>
          <span>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <button className="logout-btn" onClick={handleLogoutClick}>
            Logout
          </button>
        </div>
      </header>

      {/* ===== LOGOUT POPUP ===== */}
      {showLogoutPopup && (
        <LogoutPopup
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      )}

      {/* ===== SUMMARY CARDS ===== */}
      <section className="summary-section">
        <div className="summary-card">
          <h3>🛒 Total Orders (Today)</h3>
          <p>{summary.totalOrders}</p>
        </div>

        <div className="summary-card">
          <h3>💰 Total Revenue (₹)</h3>
          <p>{summary.totalRevenue}</p>
        </div>

        <div
          className="summary-card clickable"
          onClick={() => navigate("/admin/owners")}
        >
          <h3>👨‍🍳 Total Mess Owners</h3>
          <p>{summary.totalOwners}</p>
        </div>

        <div
          className="summary-card clickable"
          onClick={() => navigate("/admin/students")}
        >
          <h3>🎓 Total Students</h3>
          <p>{summary.totalStudents}</p>
        </div>
      </section>

      {/* ===== DATE FILTER ===== */}
      <section className="date-filter">
        <h3>📅 Check Revenue Between Dates</h3>
        <div className="date-inputs">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <select
            value={selectedMess}
            onChange={(e) => setSelectedMess(e.target.value)}
          >
            <option value="all">All Messes</option>
            {messList.map((m) => (
              <option key={m._id} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
          <button onClick={handleViewReport}>View</button>
        </div>
      </section>

      {/* ===== REVENUE TREND ===== */}
      <section className="chart-section">
        <h2>📊 Revenue Trend (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="totalRevenue"
              stroke="#0077ff"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* ===== TOP MESSES ===== */}
      <section className="table-section">
        <h2>🏆 Top Performing Messes (Today)</h2>
        <table className="earnings-table">
          <thead>
            <tr>
              <th>Mess Name</th>
              <th>Orders</th>
              <th>Earnings (₹)</th>
            </tr>
          </thead>
          <tbody>
            {topMesses.length > 0 ? (
              topMesses.map((m, i) => (
                <tr key={i}>
                  <td>{m._id}</td>
                  <td>{m.totalOrders}</td>
                  <td>{m.totalEarnings}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* ===== PENDING REQUESTS ===== */}
      <section className="table-section">
        <h2>📬 Pending Mess Requests</h2>
        <table className="earnings-table">
          <thead>
            <tr>
              <th>Mess Name</th>
              <th>Owner</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((r, i) => (
                <tr key={i}>
                  <td>{r.mess_name}</td>
                  <td>{r.owner_id?.name}</td>
                  <td>{r.owner_id?.email}</td>
                  <td>{r.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">
                  No pending requests
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* ===== PAYOUTS ===== */}
      <section className="table-section">
        <h2>💸 Owner Payouts (This Month)</h2>
        <table className="earnings-table">
          <thead>
            <tr>
              <th>Mess</th>
              <th>Owner</th>
              <th>Email</th>
              <th>Total</th>
              <th>Commission</th>
              <th>Payable</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p, i) => (
              <tr key={i}>
                <td>{p.messName}</td>
                <td>{p.ownerName}</td>
                <td>{p.ownerEmail}</td>
                <td>{p.totalRevenue}</td>
                <td>{p.commission}</td>
                <td>{p.payable}</td>
                <td>
                  <select
                    className={`status-select ${
                      p.payoutStatus === "Paid" ? "paid" : "pending"
                    }`}
                    value={p.payoutStatus}
                    onChange={(e) =>
                      updatePayoutStatus(p.messName, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ===== REVIEWS ===== */}
      <section className="table-section">
        <h2>⭐ Recent Reviews</h2>
        <table className="earnings-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Review</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((r, i) => (
                <tr key={i}>
                  <td>{r.user_id?.name}</td>
                  <td>{r.user_id?.email}</td>
                  <td>{r.comment || "No comment"}</td>
                  <td>{r.rating}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">
                  No recent reviews
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
