import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { slugify } from "../../../utils/slugify";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Spin } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import RatingStars from "../../../components/ui/RatingStars";
import CartIcon from "../../cart/components/CartIcon";
import PageContainer from "../../../components/ui/PageContainer";
import { useRequireAuth } from "../../auth/hooks/useRequireAuth";
import { addToCart } from "../../cart/store/cartSlice";
import {
  selectCurrentProduct,
  selectFetchLoading,
  selectProductError,
  fetchProductById,
  clearCurrentProduct,
} from "../store";
import type { AppDispatch } from "../../../lib/store";
import styles from "./ProductDetailPage.module.css";
import { formatVND } from "../../../utils/format";

const FALLBACK_IMAGES_BY_COLOR: Record<string, string> = {
  Đen: "https://dummyjson.com/image/400x300/282828/ffffff?text=M%C3%A0u+%C4%90en",
  Trắng:
    "https://dummyjson.com/image/400x300/f5f5f5/333333?text=M%C3%A0u+Tr%E1%BA%AFng",
  Xanh: "https://dummyjson.com/image/400x300/1a73e8/ffffff?text=M%C3%A0u+Xanh",
};

const ProductDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const requireAuth = useRequireAuth();

  const product = useSelector(selectCurrentProduct);
  const loading = useSelector(selectFetchLoading);
  const error = useSelector(selectProductError);

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const defaultColors = useMemo(
    () => [
      t("productDetail.colorBlack"),
      t("productDetail.colorWhite"),
      t("productDetail.colorBlue"),
    ],
    [t],
  );

  useEffect(() => {
    if (!slug) return;

    const findAndFetch = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_BASE_URL || "";
        const searchTerm = slug.replace(/-/g, " ");
        const response = await fetch(
          `${baseUrl}/products/search?q=${encodeURIComponent(searchTerm)}&limit=10`,
        );
        const data = await response.json();
        const matched = data.products?.find(
          (p: { title: string }) => slugify(p.title) === slug,
        );
        if (matched) {
          dispatch(fetchProductById(matched.id));
        }
      } catch {
        // error handled by epic
      }
    };

    findAndFetch();

    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [slug, dispatch]);

  const colors = useMemo(
    () => product?.colors ?? defaultColors,
    [product, defaultColors],
  );

  const images = useMemo(() => {
    if (!product) return [];
    const apiImages = product.images || [];
    if (apiImages.length >= colors.length) return apiImages;

    const result: string[] = [];
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
  }, [product, colors]);

  const handleColorSelect = useCallback(
    (index: number) => {
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

  const handleAddToCart = (goToCart = false) => {
    requireAuth(() => {
      if (!product) return;
      dispatch(addToCart({ product, color: colors[selectedColorIndex] }));
      if (goToCart) {
        navigate("/cart");
      }
    });
  };

  return (
    <PageContainer
      title={
        <>
          <Link to="/shop" className={styles.breadcrumbLink}>
            {t("shop.title")}
          </Link>
          {" / "}
          {t("productDetail.breadcrumb")}
        </>
      }
      headerRight={<CartIcon />}
    >
      {loading ? (
        <div className={styles.loading}>
          <Spin size="large" tip={t("productDetail.loadingDetail")} />
        </div>
      ) : error ? (
        <div className={styles.loading}>{error}</div>
      ) : product ? (
        <div className={styles.productSection}>
          <div className={styles.imageGallery}>
            <div className={styles.imageSlider}>
              <button
                type="button"
                className={`${styles.arrowBtn} ${styles.arrowBtnLeft}`}
                onClick={handlePrevImage}
              >
                <LeftOutlined />
              </button>
              <div className={styles.mainImageWrapper}>
                <img
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt={product.title}
                  className={styles.mainImage}
                />
              </div>
              <button
                type="button"
                className={`${styles.arrowBtn} ${styles.arrowBtnRight}`}
                onClick={handleNextImage}
              >
                <RightOutlined />
              </button>
              {images.length > 1 && (
                <span className={styles.imageCounter}>
                  {currentImageIndex + 1}/{images.length}
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className={styles.thumbnailList}>
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={colors[index] || `Image ${index + 1}`}
                    className={`${styles.thumbnailItem} ${index === currentImageIndex ? styles.thumbnailActive : ""}`}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setSelectedColorIndex(index % colors.length);
                    }}
                  />
                ))}
              </div>
            )}

            <div className={styles.colorSection}>
              <span className={styles.colorLabel}>
                {t("productDetail.selectColor")}
              </span>
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

          <div className={styles.infoSection}>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <div className={styles.price}>{formatVND(product.price)}</div>
            <RatingStars rating={product.rating} />
            <div className={styles.selectedColorText}>
              {t("productDetail.selectedColor")}:{" "}
              <strong>{colors[selectedColorIndex]}</strong>
            </div>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.buyNowBtn}
                onClick={() => handleAddToCart(true)}
              >
                {t("productDetail.buyNow")}
              </button>
              <button
                type="button"
                className={styles.addToCartBtn}
                onClick={() => handleAddToCart(false)}
              >
                {t("productDetail.addToCart")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PageContainer>
  );
};

export default ProductDetailPage;
