// src/components/ViewCartButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../pages/CartContext";
import "../styles/ViewCartButton.css";

const ViewCartButton = () => {
  const navigate = useNavigate();
  const { cartItems, calculateTotal } = useCart();

  // Only show if cart has items
  if (cartItems.length === 0) return null;

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = calculateTotal();

  return (
    <div className="viewcart-bar" onClick={() => navigate("/checkout")}>
      <div className="viewcart-content">
        <span className="cart-info">
          🛒 {totalItems} item{totalItems > 1 ? "s" : ""} • ₹{totalAmount.toFixed(2)}
        </span>
        <button className="viewcart-btn">View Cart</button>
      </div>
    </div>
  );
};

export default ViewCartButton;
