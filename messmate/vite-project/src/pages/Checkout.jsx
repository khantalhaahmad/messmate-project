import React from "react";
import "../styles/Checkout.css";
import { useCart } from "./CartContext";

const Checkout = () => {
  const { cartItems, calculateTotal, clearCart } = useCart();

  const handlePlaceOrder = () => {
    alert("✅ Order placed successfully!");
    clearCart();
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Your Cart 🛒</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div className="cart-item" key={index}>
                <img
                  src={`/assets/${item.image || item.name
                    .toLowerCase()
                    .replace(/\s+/g, "")
                    .replace(/[()]/g, "")}.png`}
                  alt={item.name}
                  className="cart-item-img"
                  onError={(e) => (e.target.src = "/assets/default.png")}
                />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>Qty: {item.quantity}</p>
                  <p>Price: ₹{item.price}</p>
                  <p>Total: ₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <h3>Total Amount: ₹{calculateTotal().toFixed(2)}</h3>
            <button className="place-order-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
