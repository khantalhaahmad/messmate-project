import React, { useState } from "react";
import "../styles/UserDashboard.css";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Home,
  ShoppingBag,
  Star,
  Settings,
  LogOut,
  MapPin,
  Bell,
  BarChart3,
  Wallet,
} from "lucide-react";
import LogoutPopup from "../components/LogoutPopup";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const UserDashboard = () => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();

  const userName = "Talha";
  const role = "STUDENT";

  // Chart Data
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Orders",
        data: [2, 3, 1, 4, 2, 5, 3],
        backgroundColor: "#FF5722",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  // Recommended Messes (Local PNG Images)
  const recommendedMesses = [
    {
      id: 1,
      name: "Campus Delight Mess",
      rating: "4.5",
      distance: "1.2 km",
      image: "/assets/mess1.png",
    },
    {
      id: 2,
      name: "Spice Hub Tiffin",
      rating: "4.7",
      distance: "0.8 km",
      image: "/assets/mess2.png",
    },
    {
      id: 3,
      name: "Daily Dabba Service",
      rating: "4.6",
      distance: "1.5 km",
      image: "/assets/mess3.png",
    },
  ];

  // Order History
  const orderHistory = [
    {
      mess: "Spice Hub Tiffin",
      items: "Veg Thali, Roti, Paneer Curry",
      date: "Oct 17, 2025",
      amount: "₹120",
      rated: true,
    },
    {
      mess: "Campus Delight Mess",
      items: "Dal Rice, Salad",
      date: "Oct 15, 2025",
      amount: "₹100",
      rated: false,
    },
    {
      mess: "Daily Dabba Service",
      items: "Biryani Combo",
      date: "Oct 14, 2025",
      amount: "₹90",
      rated: true,
    },
  ];

  const handleLogoutClick = () => setShowLogoutPopup(true);
  const handleCancelLogout = () => setShowLogoutPopup(false);
  const handleConfirmLogout = () => {
    localStorage.clear();
    alert("You have been logged out successfully!");
    window.location.href = "/";
  };

  const handleMessClick = (id) => {
    navigate(`/messes/id/${id}`); // Navigate to Mess Detail page
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1 className="logo">MessMate 🍽️</h1>
        <nav className="menu">
          <a href="#" className="menu-item active">
            <Home size={18} /> <span>Home</span>
          </a>
          <a href="#" className="menu-item">
            <ShoppingBag size={18} /> <span>My Orders</span>
          </a>
          <a href="#" className="menu-item">
            <Star size={18} /> <span>Reviews</span>
          </a>
          <a href="#" className="menu-item">
            <Settings size={18} /> <span>Settings</span>
          </a>
        </nav>

        <button className="logout-btn" onClick={handleLogoutClick}>
          <LogOut size={18} /> <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="main">
        {/* Header */}
        <div className="header">
          <div className="user-info">
            <img
              src="https://source.unsplash.com/100x100/?student,profile"
              alt="User"
            />
            <div>
              <h2>Welcome, {userName}! 👋</h2>
              <p>Role: {role}</p>
            </div>
          </div>
          <div className="notifications">
            <Bell size={22} />
            <span className="badge">3</span>
          </div>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="card">
            <BarChart3 className="icon orange" />
            <h3>Orders This Week</h3>
            <p>12</p>
          </div>
          <div className="card">
            <Wallet className="icon green" />
            <h3>Total Savings</h3>
            <p>₹540</p>
          </div>
          <div className="card">
            <Star className="icon yellow" />
            <h3>Average Rating</h3>
            <p>4.3 / 5</p>
          </div>
        </div>

        {/* Chart */}
        <section className="chart-section">
          <h3>Your Weekly Orders 📊</h3>
          <Bar data={data} options={options} />
        </section>

        {/* Recommended Messes */}
        <section className="recommended">
          <h3>Recommended Messes 🍱</h3>
          <div className="mess-grid">
            {recommendedMesses.map((mess) => (
              <div
                key={mess.id}
                className="mess-card"
                onClick={() => handleMessClick(mess.id)}
              >
                <img src={mess.image} alt={mess.name} />
                <h4>{mess.name}</h4>
                <div className="mess-info">
                  <span className="rating">
                    <Star size={14} className="yellow" /> {mess.rating}
                  </span>
                  <span className="distance">
                    <MapPin size={14} /> {mess.distance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Order History */}
        <section className="order-history">
          <h3>Your Order History 🍛</h3>
          <table>
            <thead>
              <tr>
                <th>Mess Name</th>
                <th>Items Ordered</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map((order, i) => (
                <tr key={i}>
                  <td>{order.mess}</td>
                  <td>{order.items}</td>
                  <td>{order.date}</td>
                  <td>{order.amount}</td>
                  <td>
                    {order.rated ? (
                      <span className="rated-tag">⭐ Rated</span>
                    ) : (
                      <button className="rate-btn">Rate Now</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* Logout Popup */}
      {showLogoutPopup && (
        <LogoutPopup
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      )}
    </div>
  );
};

export default UserDashboard;
