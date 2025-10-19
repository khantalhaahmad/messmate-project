import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useCart } from "../pages/CartContext";
import "../styles/FoodPopup.css";

const FoodPopup = ({ item, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [visible, setVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  if (!item) return null;

  const handleAdd = () => {
    addToCart({ ...item, quantity });
    handleCloseAll();
  };

  const handleCloseAll = () => {
    setConfirmVisible(false);
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const handleAttemptClose = (e) => {
    e.stopPropagation();
    setConfirmVisible(true);
  };

  return ReactDOM.createPortal(
    <>
      {/* ===== Food Popup (Centered Vertical) ===== */}
      {visible && (
        <div className="food-popup-overlay" onClick={handleAttemptClose}>
          <div
            className="food-popup-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="popup-close" onClick={handleAttemptClose}>
              ✕
            </button>

            <div className="food-popup-content-vertical">
              <img
                src={
                  item.image
                    ? `/assets/${item.image}`
                    : "/assets/default.png"
                }
                alt={item.name}
                className="food-popup-img-vertical"
                onError={(e) => (e.target.src = "/assets/default.png")}
              />

              <h2 className="food-popup-title">{item.name}</h2>
              <p className="food-popup-price">₹{item.price}</p>

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

              <button className="add-item-btn-vertical" onClick={handleAdd}>
                Add item – ₹{(item.price * quantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Confirmation Popup ===== */}
      {confirmVisible &&
        ReactDOM.createPortal(
          <div className="confirm-overlay" onClick={() => setConfirmVisible(false)}>
            <div
              className="confirm-popup"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Unsaved Item</h3>
              <p>
                Do you want to add <strong>{item.name}</strong> to your cart before closing?
              </p>
              <div className="confirm-buttons">
                <button className="yes-btn" onClick={handleAdd}>
                  ✅ Yes, Add
                </button>
                <button className="no-btn" onClick={handleCloseAll}>
                  ❌ No
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>,
    document.body
  );
};

export default React.memo(FoodPopup);
