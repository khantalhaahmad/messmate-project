import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapPin, Clock, Star } from "lucide-react";
import "../styles/MessMenu.css";
import FoodPopup from "../components/FoodPopup";
import ViewCartButton from "../components/ViewCartButton";

const MessMenu = () => {
  const { id } = useParams(); // mess_id (numeric id)
  const [mess, setMess] = useState(null);
  const [menuItems, setMenuItems] = useState([]); // ✅ Stores the menu array
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🟢 Use your backend URL
  const backendURL = "http://localhost:4000";

  // ✅ Fetch mess by ID
  useEffect(() => {
    let isMounted = true;

    const fetchMess = async () => {
      try {
        const res = await axios.get(`${backendURL}/messes/id/${id}`);
        if (!isMounted) return;

        const data = res.data;

        // ✅ Always check for "menu.items" structure
        const items =
          data.menu?.items && Array.isArray(data.menu.items)
            ? data.menu.items
            : Array.isArray(data.menu)
            ? data.menu
            : [];

        setMess(data);
        setMenuItems(items);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching mess:", err);
        setLoading(false);
      }
    };

    fetchMess();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddClick = useCallback((item) => {
    setSelectedItem(item);
    setShowPopup(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setShowPopup(false);
    setSelectedItem(null);
  }, []);

  if (loading) return <div className="loading">Loading menu...</div>;
  if (!mess) return <div className="error">No mess found.</div>;

  return (
    <div className="messmenu-container">
      {/* ===== Header Section ===== */}
      <div className="messmenu-header">
        <h2 className="messmenu-name">{mess.name}</h2>

        <div className="messmenu-meta">
          <div className="meta-item">
            <MapPin size={16} />
            <span>{mess.location || "Nearby"}</span>
          </div>
          <div className="meta-item">
            <Clock size={16} />
            <span>{mess.delivery_time || "25–30 mins"}</span>
          </div>
          <div className="meta-item">
            <Star size={16} color="#00a884" />
            <span>{Number(mess.rating || 4.2).toFixed(1)}</span>
          </div>
        </div>

        {mess.offer && <p className="messmenu-offer">{mess.offer}</p>}

        <div className="messmenu-tags">
          <span>Veg</span>
          <span>Non-Veg</span>
          <span>Highly reordered</span>
        </div>
      </div>

      {/* ===== Menu Section ===== */}
      <h3 className="menu-section">Recommended for you</h3>

      <div className="messmenu-list">
        {menuItems.length > 0 ? (
          menuItems.map((item, index) => (
            <div key={index} className="messmenu-item">
              {/* ===== Left Info ===== */}
              <div className="messmenu-item-info">
                <div className="veg-dot">
                  <span
                    className={`dot ${
                      item.isVeg === false ? "veg-dot-red" : "veg-dot-green"
                    }`}
                  ></span>
                </div>

                <h4>{item.name}</h4>
                {item.price && <p className="price">₹{item.price}</p>}
                {item.description && <p className="desc">{item.description}</p>}
              </div>

              {/* ===== Right Image + Button ===== */}
              <div className="messmenu-item-image">
                <img
                  src={
                    item.image
                      ? item.image.startsWith("http")
                        ? item.image
                        : `${import.meta.env.BASE_URL}assets/${item.image}`
                      : `${import.meta.env.BASE_URL}assets/default.png`
                  }
                  alt={item.name}
                  onError={(e) =>
                    (e.target.src = `${import.meta.env.BASE_URL}assets/default.png`)
                  }
                />
                <button className="add-btn" onClick={() => handleAddClick(item)}>
                  ADD +
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-menu">No menu items available.</p>
        )}
      </div>

      {/* ===== Popup ===== */}
      {showPopup && selectedItem && (
        <FoodPopup item={selectedItem} onClose={handleClosePopup} />
      )}

      {/* ===== Floating "View Cart" Button ===== */}
      <ViewCartButton />
    </div>
  );
};

export default MessMenu;
