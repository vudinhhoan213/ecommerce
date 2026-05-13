import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartList, setCartList] = useState([]);

  const addToCart = (product, color) => {
    setCartList((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id && item.selectedColor === color,
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id && item.selectedColor === color
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prevItems, { ...product, selectedColor: color, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, color, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, color);
      return;
    }
    setCartList((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && item.selectedColor === color
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  const removeFromCart = (productId, color) => {
    setCartList((prevItems) =>
      prevItems.filter(
        (item) => !(item.id === productId && item.selectedColor === color),
      ),
    );
  };

  const clearCart = () => setCartList([]);

  const totalItems = cartList.reduce((sum, item) => sum + item.quantity, 0);

  const subTotal = cartList.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = Math.round(subTotal * 0.1); // Thuế 10%
  const total = subTotal + tax;

  return (
    <CartContext.Provider
      value={{
        cartList,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subTotal,
        tax,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
