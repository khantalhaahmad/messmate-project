import React, { useState } from "react";
import "../styles/OwnerDashboard.css";
import LogoutPopup from "../components/LogoutPopup";
import {
  Utensils,
  Users,
  Star,
  LogOut,
  Plus,
  Settings,
  TrendingUp,
  Bell,
  IndianRupee,
  Edit3,
  Trash2,
} from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const OwnerDashboard = () => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showAddDishForm, setShowAddDishForm] = useState(false);
  const [newDish, setNewDish] = useState({ name: "", price: "", image: "" });

  const [menu, setMenu] = useState([
  { name: "Veg Thali", price: 90, image: "/assets/thali.png" },
  { name: "Masala Dosa", price: 70, image: "/assets/dosa.png" },
  { name: "Chicken Biryani", price: 120, image: "/assets/biryani.png" },
]);


  const [reviews] = useState([
    { name: "Talha Khan", rating: 5, comment: "Delicious food and quick service!" },
    { name: "Aman Sharma", rating: 4, comment: "Good taste, packaging can improve." },
    { name: "Sana Ali", rating: 5, comment: "Loved the variety and hygiene!" },
  ]);

  const [orders] = useState([
    { id: "#ORD123", dish: "Veg Thali", customer: "Ravi Kumar", price: "₹90", status: "Delivered" },
    { id: "#ORD124", dish: "Biryani", customer: "Sahil Khan", price: "₹120", status: "Pending" },
    { id: "#ORD125", dish: "Dosa", customer: "Anjali Singh", price: "₹70", status: "Delivered" },
  ]);

  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Orders",
        data: [12, 18, 10, 22, 15, 25, 20],
        backgroundColor: "#ff5722",
        borderRadius: 6,
      },
    ],
  };

  const revenueData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [4200, 5300, 6100, 7500],
        backgroundColor: "#4caf50",
        borderRadius: 6,
      },
    ],
  };

  const handleLogoutClick = () => setShowLogoutPopup(true);
  const handleCancelLogout = () => setShowLogoutPopup(false);
  const handleConfirmLogout = () => {
    localStorage.clear();
    alert("You have been logged out successfully!");
    window.location.href = "/";
  };

  const handleAddDish = (e) => {
    e.preventDefault();
    setMenu([...menu, newDish]);
    setNewDish({ name: "", price: "", image: "" });
    setShowAddDishForm(false);
  };

  const handleDeleteDish = (index) => {
    const updatedMenu = [...menu];
    updatedMenu.splice(index, 1);
    setMenu(updatedMenu);
  };

  return (
    <div className="owner-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1 className="logo">MessMate 🧑‍🍳</h1>
        <nav className="menu">
          <a href="#overview" className="menu-item active">
            <TrendingUp size={18} /> <span>Overview</span>
          </a>
          <a href="#menu" className="menu-item">
            <Utensils size={18} /> <span>Menu</span>
          </a>
          <a href="#orders" className="menu-item">
            <Users size={18} /> <span>Orders</span>
          </a>
          <a href="#reviews" className="menu-item">
            <Star size={18} /> <span>Reviews</span>
          </a>
          <a href="#settings" className="menu-item">
            <Settings size={18} /> <span>Settings</span>
          </a>
        </nav>

        <button className="logout-btn" onClick={handleLogoutClick}>
          <LogOut size={18} /> <span>Logout</span>
        </button>
      </aside>

      {/* Main Section */}
      <main className="main">
        {/* Header */}
        <div className="header">
          <div>
            <h2>Welcome, Mess Owner 👋</h2>
            <p>Track and manage your mess efficiently</p>
          </div>
          <div className="notifications">
            <Bell size={24} />
            <span className="badge">4</span>
          </div>
        </div>

        {/* Overview Stats */}
        <section id="overview" className="owner-stats">
          <div className="card">
            <Utensils className="icon orange" />
            <h3>Total Orders</h3>
            <p>124</p>
          </div>
          <div className="card">
            <IndianRupee className="icon green" />
            <h3>Total Revenue</h3>
            <p>₹12,450</p>
          </div>
          <div className="card">
            <Users className="icon blue" />
            <h3>Active Customers</h3>
            <p>58</p>
          </div>
          <div className="card">
            <Star className="icon yellow" />
            <h3>Average Rating</h3>
            <p>4.6 / 5</p>
          </div>
        </section>

        {/* Charts */}
        <section className="charts">
          <div className="chart-box">
            <h3>Weekly Orders 📦</h3>
            <Bar data={weeklyData} />
          </div>
          <div className="chart-box">
            <h3>Monthly Revenue 💰</h3>
            <Bar data={revenueData} />
          </div>
        </section>

        {/* Menu Management */}
        <section id="menu" className="mess-management">
          <div className="header">
            <h3>Manage Your Menu 🍛</h3>
            <button className="add-btn" onClick={() => setShowAddDishForm(true)}>
              <Plus size={16} /> Add Dish
            </button>
          </div>

          {/* Add Dish Form */}
          {showAddDishForm && (
            <form className="add-dish-form" onSubmit={handleAddDish}>
              <input
                type="text"
                placeholder="Dish Name"
                value={newDish.name}
                onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Price (₹)"
                value={newDish.price}
                onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newDish.image}
                onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
              />
              <button type="submit">Save Dish</button>
            </form>
          )}

          {/* Menu Grid */}
          <div className="dish-list">
            {menu.map((dish, i) => (
              <div key={i} className="dish-card">
                <img src={dish.image} alt={dish.name} />
                <div className="dish-info">
                  <h4>{dish.name}</h4>
                  <p>₹{dish.price}</p>
                  <div className="dish-actions">
                    <button className="edit-btn">
                      <Edit3 size={14} />
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteDish(i)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Orders */}
        <section id="orders" className="recent-orders">
          <h3>Recent Orders 🧾</h3>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Dish</th>
                <th>Customer</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={i}>
                  <td>{o.id}</td>
                  <td>{o.dish}</td>
                  <td>{o.customer}</td>
                  <td>{o.price}</td>
                  <td className={o.status === "Delivered" ? "delivered" : "pending"}>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="reviews-section">
          <h3>Customer Reviews ⭐</h3>
          <div className="reviews-list">
            {reviews.map((r, i) => (
              <div key={i} className="review-card">
                <h4>{r.name}</h4>
                <p>"{r.comment}"</p>
                <span>{"⭐".repeat(r.rating)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Settings */}
        <section id="settings" className="settings-section">
          <h3>Mess Profile Settings ⚙️</h3>
          <div className="settings-info">
            <p><strong>Mess Name:</strong> Campus Delight Mess</p>
            <p><strong>Address:</strong> Near Block A, Hostel Campus</p>
            <p><strong>Timings:</strong> 9:00 AM – 10:00 PM</p>
            <p><strong>Contact:</strong> +91 9876543210</p>
            <p><strong>Mess Type:</strong> Veg + Non-Veg</p>
          </div>
        </section>
      </main>

      {/* Logout Popup */}
      {showLogoutPopup && (
        <LogoutPopup onConfirm={handleConfirmLogout} onCancel={handleCancelLogout} />
      )}
    </div>
  );
};

export default OwnerDashboard;
