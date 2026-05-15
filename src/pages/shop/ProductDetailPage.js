import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { message } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import RatingStars from "../../components/common/RatingStars";
import CartIcon from "../../components/common/CartIcon";
import { useCart } from "../../context/CartContext";
import styles from "./ProductDetailPage.module.css";

const DEFAULT_COLORS = ["Đen", "Trắng", "Xanh"];

// Ảnh placeholder cho mỗi màu — giả lập sản phẩm có nhiều biến thể
const FALLBACK_IMAGES_BY_COLOR = {
  "Đen": "https://dummyjson.com/image/400x300/282828/ffffff?text=M%C3%A0u+%C4%90en",
  "Trắng": "https://dummyjson.com/image/400x300/f5f5f5/333333?text=M%C3%A0u+Tr%E1%BA%AFng",
  "Xanh": "https://dummyjson.com/image/400x300/1a73e8/ffffff?text=M%C3%A0u+Xanh",
};

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  // Tạo mảng ảnh: bổ sung placeholder nếu API không đủ ảnh cho mỗi màu
  const getImages = () => {
    if (!product) return [];
    const apiImages = product.images || [];
    const colors = product.colors || DEFAULT_COLORS;

    if (apiImages.length >= colors.length) {
      return apiImages;
    }

    const result = [];
    for (let i = 0; i < colors.length; i++) {
      if (apiImages[i]) {
        result.push(apiImages[i]);
      } else if (FALLBACK_IMAGES_BY_COLOR[colors[i]]) {
        result.push(FALLBACK_IMAGES_BY_COLOR[colors[i]]);
      } else {
        result.push(
          `https://dummyjson.com/image/400x300/cccccc/333333?text=${encodeURIComponent(colors[i])}`,
        );
      }
    }
    return result;
  };

  const images = getImages();
  const colors = product?.colors || DEFAULT_COLORS;

  const handleColorSelect = useCallback(
    (index) => {
      setSelectedColorIndex(index);
      setCurrentImageIndex(index % images.length);
    },
    [images.length],
  );

  const handlePrevImage = useCallback(() => {
    if (images.length <= 1) return;
    const newIndex =
      currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    setSelectedColorIndex(newIndex % colors.length);
  }, [currentImageIndex, images.length, colors.length]);

  const handleNextImage = useCallback(() => {
    if (images.length <= 1) return;
    const newIndex =
      currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    setSelectedColorIndex(newIndex % colors.length);
  }, [currentImageIndex, images.length, colors.length]);

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
              {/* Image Slider */}
              <div className={styles.imageSlider}>
                <button
                  type="button"
                  className={`${styles.arrowBtn} ${styles.arrowBtnLeft}`}
                  onClick={handlePrevImage}
                  aria-label="Ảnh trước"
                >
                  <LeftOutlined />
                </button>

                <div className={styles.mainImageWrapper}>
                  <img
                    key={currentImageIndex}
                    src={images[currentImageIndex]}
                    alt={`${product.title} - ${colors[selectedColorIndex]}`}
                    className={styles.mainImage}
                  />
                </div>

                <button
                  type="button"
                  className={`${styles.arrowBtn} ${styles.arrowBtnRight}`}
                  onClick={handleNextImage}
                  aria-label="Ảnh tiếp"
                >
                  <RightOutlined />
                </button>

                {/* Image counter */}
                {images.length > 1 && (
                  <span className={styles.imageCounter}>
                    {currentImageIndex + 1}/{images.length}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className={styles.thumbnailList}>
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={colors[index] || `Ảnh ${index + 1}`}
                      className={`${styles.thumbnailItem} ${
                        index === currentImageIndex
                          ? styles.thumbnailActive
                          : ""
                      }`}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setSelectedColorIndex(index % colors.length);
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Color selector */}
              <div className={styles.colorSection}>
                <span className={styles.colorLabel}>Chọn màu sắc</span>
                <div className={styles.colorList}>
                  {colors.map((color, index) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(index)}
                      className={
                        selectedColorIndex === index
                          ? styles.colorOptionActive
                          : ""
                      }
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className={styles.infoSection}>
              <h2>{product.title}</h2>
              <p>{product.description}</p>
              <div className={styles.price}>{formatVND(product.price)}</div>

              <RatingStars rating={product.rating} />

              <div className={styles.selectedColorText}>
                Màu đã chọn: <strong>{colors[selectedColorIndex]}</strong>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.buyNowBtn}
                  onClick={() => {
                    addToCart(product, colors[selectedColorIndex]);
                    navigate("/cart");
                  }}
                >
                  Mua Ngay
                </button>
                <button
                  type="button"
                  className={styles.addToCartBtn}
                  onClick={() => {
                    addToCart(product, colors[selectedColorIndex]);
                    message.success(
                      `Đã thêm ${product.title} (${colors[selectedColorIndex]}) vào giỏ hàng!`,
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
