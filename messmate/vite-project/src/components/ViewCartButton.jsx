import React, { useState } from "react";
import { useCart } from "../pages/CartContext";
import { ShoppingCart } from "lucide-react";
import "../styles/ViewCartButton.css";
import { useNavigate } from "react-router-dom";

const ViewCartButton = () => {
  const { cartItems, calculateTotal, removeFromCart } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!cartItems || cartItems.length === 0) return null;

  const uniqueItemCount = cartItems.length;

  const handleViewCart = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCheckout = () => {
    setOpen(false);
    navigate("/checkout");
  };

  return (
    <>
      {/* ===== Bottom Bar ===== */}
      <div className="view-cart-bar">
        <div className="cart-info">
          <ShoppingCart size={20} />
          <span className="cart-summary">
            {uniqueItemCount} item{uniqueItemCount > 1 ? "s" : ""} · ₹
            {calculateTotal().toFixed(2)}
          </span>
        </div>
        <button className="view-cart-btn" onClick={handleViewCart}>
          View Cart
        </button>
      </div>

      {/* ===== Expanded Popup ===== */}
      {open && (
        <div className="cart-popup-overlay" onClick={handleClose}>
          <div
            className="cart-popup"
            onClick={(e) => e.stopPropagation()} // Prevent background click
          >
            <div className="cart-popup-header">
              <h3>Your Cart 🛒</h3>
              <button className="close-popup" onClick={handleClose}>
                ✕
              </button>
            </div>

            <div className="cart-popup-content">
              {cartItems.map((item) => (
                <div key={item.name} className="popup-cart-item">
                  <img
                    src={
                      item.image?.startsWith("http")
                        ? item.image
                        : `/assets/${item.image || "default.png"}`
                    }
                    alt={item.name}
                    onError={(e) => (e.target.src = "/assets/default.png")}
                    className="popup-cart-img"
                  />
                  <div className="popup-cart-details">
                    <h4>{item.name}</h4>
                    <p>₹{item.price} × {item.quantity}</p>
                    <p className="popup-cart-total">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    className="popup-remove-btn"
                    onClick={() => removeFromCart(item)}
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-popup-footer">
              <div className="popup-total">
                <span>Total:</span>
                <strong>₹{calculateTotal().toFixed(2)}</strong>
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewCartButton;
