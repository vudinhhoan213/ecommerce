import React from "react";
import { Link } from "react-router-dom";
import RatingStars from "../common/RatingStars";
import styles from "../../pages/shop/ShopPage.module.css";

const ProductCard = ({ product, formatVND, onEdit, onDelete, isLoading }) => (
  <div className={styles.productCardWrapper}>
    <Link to={`/shop/${product.id}`} className={styles.productCard}>
      <img src={product.thumbnail || product.images?.[0]} alt={product.title} />
      <div className={styles.productInfo}>
        <h3>{product.title}</h3>
        <div className={styles.price}>{formatVND(product.price)}</div>
        <RatingStars rating={product.rating} />
      </div>
    </Link>
    <div className={styles.productActions}>
      <button
        className={styles.editBtn}
        onClick={() => onEdit(product)}
        disabled={isLoading}
      >
        ✎
      </button>
      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(product.id)}
        disabled={isLoading}
      >
        ✕
      </button>
    </div>
  </div>
);

export default ProductCard;
