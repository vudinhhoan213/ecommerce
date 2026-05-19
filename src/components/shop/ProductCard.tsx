import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { message } from "antd";
import RatingStars from "../common/RatingStars";
import { addToCart } from "../../store/cartSlice";
import styles from "../../pages/shop/ShopPage.module.css";
import type { Product } from "../../types";
import type { AppDispatch } from "../../store/store";

interface ProductCardProps {
  product: Product;
  formatVND: (num: number) => string;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  formatVND,
  onEdit,
  onDelete,
  isLoading,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultColor = product.colors?.[0] || "Default";
    dispatch(addToCart({ product, color: defaultColor }));
    message.success(t("productDetail.addedToCart", { name: product.title, color: defaultColor }));
  };

  return (
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
        <button className={styles.editBtn} onClick={() => onEdit(product)} disabled={isLoading}>✎</button>
        <button className={styles.deleteBtn} onClick={() => onDelete(product.id)} disabled={isLoading}>✕</button>
      </div>
      <button className={styles.addToCartBtn} onClick={handleAddToCart}>
        <ShoppingCartOutlined /> {t("productDetail.addToCart")}
      </button>
    </div>
  );
};

export default ProductCard;
