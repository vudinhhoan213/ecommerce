// src/components/common/CartIcon.jsx
import React from "react";
import { useCart } from "../../context/CartContext";
import { Cart } from "../../assets";
import styles from "./CartIcon.module.css";

const CartIcon = () => {
  const { totalItems } = useCart();
  return (
    <div className={styles.cartWrapper}>
      <img src={Cart} alt="Shopping Cart" className={styles.cartIcon} />

      {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
    </div>
  );
};

export default CartIcon;
