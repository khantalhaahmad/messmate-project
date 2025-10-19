// src/pages/MessMenu.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapPin, Clock, Star } from "lucide-react";
import "../styles/MessMenu.css";
import FoodPopup from "../components/FoodPopup";
import ViewCartButton from "../components/ViewCartButton";

const MessMenu = () => {
  const { id } = useParams();
  const [mess, setMess] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Deep comparison to prevent unnecessary re-renders
  const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  useEffect(() => {
    let isMounted = true;

    const fetchMess = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/messes/id/${id}`);
        if (isMounted && !isEqual(res.data, mess)) {
          setMess(res.data);
          setLoading(false);
        }
      } catch (err) {
        console.error("❌ Error fetching mess:", err);
        setLoading(false);
      }
    };

    fetchMess();

    // Optional refresh every 5 minutes
    const interval = setInterval(fetchMess, 300000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [id, mess]);

  // ✅ Popup open handler (clean and stable)
  const handleAddClick = useCallback(
    (item) => {
      console.log("🟢 Opening popup for:", item.name);
      setSelectedItem(item);
      setShowPopup(true);
    },
    [] // no dependency → avoids re-renders
  );

  // ✅ Popup close handler
  const handleClosePopup = useCallback(() => {
    console.log("🔴 Closing popup");
    setShowPopup(false);
    setSelectedItem(null);
  }, []);

  if (loading) return <div className="loading">Loading menu...</div>;
  if (!mess) return <div className="error">No menu found.</div>;

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
        {mess.menu?.items?.map((item, index) => (
          <div key={index} className="messmenu-item">
            <div className="messmenu-item-info">
              <div className="veg-dot">
                <span
                  className={`dot ${
                    item.veg ? "veg-dot-green" : "veg-dot-red"
                  }`}
                ></span>
              </div>

              <h4>{item.name}</h4>
              <p className="price">₹{item.price}</p>
              <p className="desc">{item.desc}</p>
            </div>

            <div className="messmenu-item-image">
              <img
                src={`/assets/${item.image}`}
                alt={item.name}
                onError={(e) => (e.target.src = "/assets/default.png")}
              />
              <button className="add-btn" onClick={() => handleAddClick(item)}>
                ADD +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Popup Section ===== */}
      {showPopup && selectedItem && (
        <FoodPopup item={selectedItem} onClose={handleClosePopup} />
      )}

      {/* ===== Floating "View Cart" Button ===== */}
      <ViewCartButton />
    </div>
  );
};

export default MessMenu;
