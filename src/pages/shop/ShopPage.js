import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RatingStars from "../../components/common/RatingStars";
import SearchIcon from "../../assets/Icon/Look.png";
import FilterIcon from "../../assets/Icon/filter.png";
import styles from "./ShopPage.module.css";

const ShopPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        if (!response.ok) {
          throw new Error("Không tải được danh sách sản phẩm.");
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message || "Lỗi khi tải sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatVND = (num) =>
    new Intl.NumberFormat("vi-VN").format(num) + " VND";

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.shopHeader}>
          <h2>Shop</h2>
          <div className={styles.searchFilter}>
            <div className={styles.searchWrapper}>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className={styles.searchBtn}>
                <img src={SearchIcon} alt="Search" />
              </button>
            </div>
            <button className={styles.filterBtn}>
              <img src={FilterIcon} alt="Filter" />
            </button>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        {loading ? (
          <p className={styles.noResult}>Đang tải sản phẩm...</p>
        ) : error ? (
          <p className={styles.noResult}>{error}</p>
        ) : filteredProducts.length === 0 ? (
          <p className={styles.noResult}>
            Không tìm thấy sản phẩm nào phù hợp với "{searchTerm}"
          </p>
        ) : (
          <div className={styles.productGrid}>
            {filteredProducts.map((product) => (
              <div key={product.id}>
                <Link to={`/shop/${product.id}`} className={styles.productCard}>
                  <img
                    src={product.thumbnail || product.images?.[0]}
                    alt={product.title}
                  />
                  <div className={styles.productInfo}>
                    <h3>{product.title}</h3>
                    <div className={styles.price}>
                      {formatVND(product.price)}
                    </div>
                    <RatingStars rating={product.rating} />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
