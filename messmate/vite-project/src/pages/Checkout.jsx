import React from "react";
import "../styles/Checkout.css";
import { useCart } from "./CartContext";

const Checkout = () => {
  const { cartItems, calculateTotal, clearCart, removeFromCart } = useCart();

  const handlePlaceOrder = () => {
    alert("✅ Order placed successfully!");
    clearCart();
  };

  const getImagePath = (item) => {
    if (item.image) {
      return item.image.startsWith("http")
        ? item.image
        : `${import.meta.env.BASE_URL}assets/${item.image}`;
    }

    const generatedName = item.name
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[()]/g, "");
    return `${import.meta.env.BASE_URL}assets/${generatedName}.png`;
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Your Cart 🛒</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id ?? item.name}>
                {/* ===== Left: Food Image ===== */}
                <div className="cart-item-left">
                  <img
                    src={getImagePath(item)}
                    alt={item.name}
                    className="cart-item-img"
                    onError={(e) =>
                      (e.target.src = `${import.meta.env.BASE_URL}assets/default.png`)
                    }
                  />
                </div>

                {/* ===== Right: Food Details ===== */}
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>Qty: {item.quantity}</p>
                  <p>Per Price: ₹{item.price}</p>
                  <p>Total: ₹{(item.price * item.quantity).toFixed(2)}</p>

                  {/* 🗑️ Remove button */}
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item)}
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ===== Cart Summary Section ===== */}
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
