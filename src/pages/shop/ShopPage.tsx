import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Input, Space, Modal, message, Skeleton, Card } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import ProductCard from "../../components/shop/ProductCard";
import ProductModal from "../../components/shop/ProductModal";
import Pagination from "../../components/shop/Pagination";
import {
  selectProducts,
  selectProductLoading,
  selectProductError,
} from "../../store/productSlice";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../store/productThunk";
import type { Product } from "../../types";
import type { AppDispatch } from "../../store/store";
import styles from "./ShopPage.module.css";

const PRODUCTS_PER_PAGE = 20;

const ShopPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  // Lấy data từ Redux store — KHÔNG dùng local state cho products
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch products khi mount — qua Redux thunk
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const formatVND = (num: number): string =>
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

  const handleOpenModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (formData: Partial<Product>) => {
    setIsLoading(true);
    try {
      if (editingProduct) {
        await dispatch(
          updateProduct({ id: editingProduct.id, data: formData }),
        ).unwrap();
        message.success(t("shop.updateSuccess"));
      } else {
        await dispatch(createProduct(formData)).unwrap();
        message.success(t("shop.addSuccess"));
      }
      handleCloseModal();
    } catch (err: any) {
      message.error(err || t("shop.saveError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = (productId: number) => {
    Modal.confirm({
      title: t("shop.confirmDelete"),
      icon: <ExclamationCircleOutlined />,
      content: t("shop.confirmDeleteContent"),
      okText: t("common.delete"),
      okType: "danger",
      cancelText: t("common.cancel"),
      onOk: async () => {
        try {
          await dispatch(deleteProduct(productId)).unwrap();
          message.success(t("shop.deleteSuccess"));
        } catch (err: any) {
          message.error(err || t("shop.saveError"));
        }
      },
    });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Skeleton loading cho cards
  const renderSkeletons = () => (
    <div className={styles.productGrid}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} style={{ borderRadius: 12 }}>
          <Skeleton.Image active style={{ width: "100%", height: 160 }} />
          <Skeleton active paragraph={{ rows: 2 }} style={{ marginTop: 12 }} />
        </Card>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.shopHeader}>
          <h2>{t("shop.title")}</h2>
          <div className={styles.searchFilter}>
            <Space wrap align="center" className={styles.antHeaderActions}>
              <Input.Search
                placeholder={t("common.search")}
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
                {t("shop.addProduct")}
              </Button>
            </Space>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        {loading ? (
          renderSkeletons()
        ) : error ? (
          <p className={styles.noResult}>{error}</p>
        ) : paginatedProducts.length === 0 ? (
          <p className={styles.noResult}>
            {filteredProducts.length === 0
              ? t("shop.noSearchResult", { term: searchTerm })
              : t("shop.noProducts")}
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
