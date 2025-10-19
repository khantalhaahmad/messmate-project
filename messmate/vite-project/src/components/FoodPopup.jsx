import React, { useState, useEffect } from "react";
import { useCart } from "../pages/CartContext";
import "../styles/FoodPopup.css";

const FoodPopup = ({ item, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Smooth fade-in without flicker
    requestAnimationFrame(() => setVisible(true));
  }, []);

  if (!item) return null;

  const handleAdd = () => {
    addToCart({ ...item, quantity });
    onClose();
  };

  return (
    <div
      className={`food-popup-overlay ${visible ? "show" : ""}`}
      onClick={onClose}
    >
      <div
        className={`food-popup-centered ${visible ? "show" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="popup-close" onClick={onClose}>
          ✕
        </button>

        <div className="food-popup-content">
          <img
            src={`/assets/${item.image || item.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .replace(/[()]/g, "")}.png`}
            alt={item.name}
            className="food-popup-img"
            onError={(e) => (e.target.src = "/assets/default.png")}
          />

          <h2 className="food-popup-title">{item.name}</h2>
          <p className="food-popup-desc">{item.desc}</p>
          <p className="food-popup-price">₹{item.price}</p>

          <div className="food-popup-footer">
            <div className="quantity-control">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="qty-btn minus"
              >
                −
              </button>
              <span className="qty">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="qty-btn plus"
              >
                +
              </button>
            </div>

            <button className="add-item-btn" onClick={handleAdd}>
              Add item – ₹{(item.price * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Prevent unnecessary re-renders and blinking
export default React.memo(FoodPopup);
