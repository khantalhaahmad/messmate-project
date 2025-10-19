import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Add to Cart (Fixes quantity logic)
  const addToCart = (itemToAdd) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === itemToAdd.name);

      if (existingItem) {
        // If item already exists, increase its quantity
        return prevCart.map((item) =>
          item.name === itemToAdd.name
            ? {
                ...item,
                quantity: item.quantity + itemToAdd.quantity,
              }
            : item
        );
      } else {
        // Add new item
        return [...prevCart, { ...itemToAdd }];
      }
    });
  };

  // ✅ Remove single item from cart
  const removeFromCart = (itemToRemove) => {
    setCartItems((prevCart) =>
      prevCart.filter((item) => item.name !== itemToRemove.name)
    );
  };

  // ✅ Clear cart
  const clearCart = () => setCartItems([]);

  // ✅ Total amount (price * quantity)
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // ✅ Count unique items
  const getItemCount = () => cartItems.length;

  // ✅ Count total quantity (if needed elsewhere)
  const getTotalQuantity = () =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        calculateTotal,
        getItemCount,
        getTotalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
