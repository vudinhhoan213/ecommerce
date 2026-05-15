import React, { useState, useEffect } from "react";
import { Button, Input, Space, Modal, message } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import ProductCard from "../../components/shop/ProductCard";
import ProductModal from "../../components/shop/ProductModal";
import Pagination from "../../components/shop/Pagination";
import styles from "./ShopPage.module.css";

const PRODUCTS_PER_PAGE = 20;

const ShopPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (formData) => {
    setIsLoading(true);
    try {
      let response;
      if (editingProduct) {
        response = await fetch(
          `https://dummyjson.com/products/${editingProduct.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          },
        );
      } else {
        response = await fetch("https://dummyjson.com/products/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        throw new Error("Lỗi khi lưu sản phẩm");
      }

      const savedProduct = await response.json();

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id ? { ...p, ...savedProduct } : p,
          ),
        );
        message.success("Cập nhật sản phẩm thành công!");
      } else {
        setProducts((prev) => [...prev, savedProduct]);
        message.success("Thêm sản phẩm thành công!");
      }

      handleCloseModal();
    } catch (err) {
      message.error("Lỗi: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = (productId) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn chắc chắn muốn xóa sản phẩm này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await fetch(
            `https://dummyjson.com/products/${productId}`,
            { method: "DELETE" },
          );

          if (!response.ok) {
            throw new Error("Lỗi khi xóa sản phẩm");
          }

          setProducts((prev) => prev.filter((p) => p.id !== productId));
          message.success("Xóa sản phẩm thành công!");
        } catch (err) {
          message.error("Lỗi: " + err.message);
        }
      },
    });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.shopHeader}>
          <h2>Shop</h2>
          <div className={styles.searchFilter}>
            <Space wrap align="center" className={styles.antHeaderActions}>
              <Input.Search
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onSearch={(value) => setSearchTerm(value)}
                enterButton={<SearchOutlined />}
                className={styles.searchInput}
                allowClear
              />
              <Button icon={<FilterOutlined />} className={styles.filterBtn} />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleOpenModal()}
                className={styles.addBtn}
              >
                Thêm Sản Phẩm
              </Button>
            </Space>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        {loading ? (
          <p className={styles.noResult}>Đang tải sản phẩm...</p>
        ) : error ? (
          <p className={styles.noResult}>{error}</p>
        ) : paginatedProducts.length === 0 ? (
          <p className={styles.noResult}>
            {filteredProducts.length === 0
              ? `Không tìm thấy sản phẩm nào phù hợp với "${searchTerm}"`
              : "Không có sản phẩm"}
          </p>
        ) : (
          <>
            <div className={styles.productGrid}>
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  formatVND={formatVND}
                  onEdit={handleOpenModal}
                  onDelete={handleDeleteProduct}
                  isLoading={isLoading}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      <ProductModal
        open={showModal}
        editingProduct={editingProduct}
        onSave={handleSaveProduct}
        onCancel={handleCloseModal}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ShopPage;
