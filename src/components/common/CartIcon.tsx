import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTotalItems } from "../../store/cartSlice";
import { Cart } from "../../assets";
import styles from "./CartIcon.module.css";

const CartIcon: React.FC = () => {
  const totalItems = useSelector(selectTotalItems);
  return (
    <Link to="/cart" className={styles.cartWrapper}>
      <img src={Cart} alt="Shopping Cart" className={styles.cartIcon} />
      {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
    </Link>
  );
};

export default CartIcon;
