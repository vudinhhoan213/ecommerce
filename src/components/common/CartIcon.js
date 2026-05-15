import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Cart } from "../../assets";
import styles from "./CartIcon.module.css";

const CartIcon = () => {
  const { totalItems } = useCart();
  return (
    <Link to="/cart" className={styles.cartWrapper}>
      <img src={Cart} alt="Shopping Cart" className={styles.cartIcon} />
      {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
    </Link>
  );
};

export default CartIcon;
