import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import RatingStars from "../../components/common/RatingStars";
import CartIcon from "../../components/common/CartIcon";
import { useCart } from "../../context/CartContext";
import styles from "./ProductDetailPage.module.css";

const DEFAULT_COLORS = ["Đen", "Trắng", "Xanh"];

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("Đen");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://dummyjson.com/products/${productId}`,
        );
        if (!response.ok) {
          throw new Error("Không tìm thấy sản phẩm.");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message || "Lỗi khi tải chi tiết sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const formatVND = (num) =>
    new Intl.NumberFormat("vi-VN").format(num) + " VND";

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.breadcrumb}>
          <div className={styles.breadcrumbContainer}>
            <div className={styles.breadcrumbText}>
              <h2>
                <Link to="/shop" className={styles.breadcrumbLink}>
                  Shop
                </Link>{" "}
                / Product
              </h2>
            </div>
            <div className={styles.cartIconScaleWrapper}>
              <CartIcon />
            </div>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Đang tải chi tiết sản phẩm...</div>
        ) : error ? (
          <div className={styles.loading}>{error}</div>
        ) : product ? (
          <div className={styles.productSection}>
            <div className={styles.imageGallery}>
              <img
                src={product.images?.[0] || product.thumbnail}
                alt={product.title}
                className={styles.mainImage}
              />
              <div className={styles.colorList}>
                {(product.colors || DEFAULT_COLORS).map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={
                      selectedColor === color ? styles.colorOptionActive : ""
                    }
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.infoSection}>
              <h2>{product.title}</h2>
              <p>{product.description}</p>
              <div className={styles.price}>{formatVND(product.price)}</div>

              <RatingStars rating={product.rating} />

              <div className={styles.actions}>
                <button
                  className={styles.buyNowBtn}
                  onClick={() => {
                    addToCart(product, selectedColor);
                    navigate("/cart");
                  }}
                >
                  Mua Ngay
                </button>
                <button
                  className={styles.addToCartBtn}
                  onClick={() => {
                    addToCart(product, selectedColor);
                    alert(
                      `Đã thêm ${product.title} (${selectedColor}) vào giỏ hàng!`,
                    );
                  }}
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductDetailPage;
