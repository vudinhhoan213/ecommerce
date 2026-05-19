import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Input,
  Space,
  Modal,
  message,
  Skeleton,
  Card,
  Popover,
  Select,
  Divider,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import ProductCard from "../../components/shop/ProductCard";
import ProductModal from "../../components/shop/ProductModal";
import PageContainer from "../../components/common/PageContainer";
import Pagination from "../../components/shop/Pagination";
import {
  selectProducts,
  selectFetchLoading,
  selectMutateLoading,
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
import { formatVND } from "../../utils/format";

const PRODUCTS_PER_PAGE = 20;

const PRICE_OPTIONS = [0, 1000, 5000, 10000, 20000, 50000, 100000];

const RATING_OPTIONS = [0, 1, 2, 3, 4, 5];

interface FilterState {
  priceFrom: number;
  priceTo: number;
  ratingFrom: number;
  ratingTo: number;
}

const DEFAULT_FILTER: FilterState = {
  priceFrom: 0,
  priceTo: 100000,
  ratingFrom: 0,
  ratingTo: 5,
};

const ShopPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const products = useSelector(selectProducts);
  const fetchLoading = useSelector(selectFetchLoading);
  const mutateLoading = useSelector(selectMutateLoading);
  const error = useSelector(selectProductError);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [filterOpen, setFilterOpen] = useState(false);

  // Debounce search — chỉ filter sau 500ms ngừng nhập
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchTerm]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const isFilterActive =
    filter.priceFrom !== DEFAULT_FILTER.priceFrom ||
    filter.priceTo !== DEFAULT_FILTER.priceTo ||
    filter.ratingFrom !== DEFAULT_FILTER.ratingFrom ||
    filter.ratingTo !== DEFAULT_FILTER.ratingTo;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.title
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
      const matchPrice =
        product.price >= filter.priceFrom && product.price <= filter.priceTo;
      const matchRating =
        product.rating >= filter.ratingFrom &&
        product.rating <= filter.ratingTo;
      return matchSearch && matchPrice && matchRating;
    });
  }, [products, debouncedSearch, filter]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filter]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [products.length, totalPages, currentPage]);

  const handleResetFilter = () => {
    setFilter(DEFAULT_FILTER);
  };

  const filterContent = (
    <div style={{ width: 280, padding: "8px 0" }}>
      <h4 style={{ textAlign: "center", margin: "0 0 12px" }}>
        {t("shop.filter.title")}
      </h4>
      <Divider style={{ margin: "8px 0" }} />

      <div style={{ marginBottom: 16 }}>
        <strong>{t("shop.filter.price")}</strong>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
          }}
        >
          <span>{t("shop.filter.from")}:</span>
          <Select
            value={filter.priceFrom}
            onChange={(val) => setFilter((f) => ({ ...f, priceFrom: val }))}
            style={{ flex: 1 }}
            options={PRICE_OPTIONS.filter((p) => p <= filter.priceTo).map(
              (p) => ({ value: p, label: formatVND(p) }),
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
          }}
        >
          <span>{t("shop.filter.to")}:</span>
          <Select
            value={filter.priceTo}
            onChange={(val) => setFilter((f) => ({ ...f, priceTo: val }))}
            style={{ flex: 1 }}
            options={PRICE_OPTIONS.filter((p) => p >= filter.priceFrom).map(
              (p) => ({ value: p, label: formatVND(p) }),
            )}
          />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <strong>{t("shop.filter.rating")}</strong>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
          }}
        >
          <span>{t("shop.filter.from")}:</span>
          <Select
            value={filter.ratingFrom}
            onChange={(val) => setFilter((f) => ({ ...f, ratingFrom: val }))}
            style={{ flex: 1 }}
            options={RATING_OPTIONS.filter((r) => r <= filter.ratingTo).map(
              (r) => ({
                value: r,
                label: `${r} ${t("shop.filter.stars")}`,
              }),
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
          }}
        >
          <span>{t("shop.filter.to")}:</span>
          <Select
            value={filter.ratingTo}
            onChange={(val) => setFilter((f) => ({ ...f, ratingTo: val }))}
            style={{ flex: 1 }}
            options={RATING_OPTIONS.filter((r) => r >= filter.ratingFrom).map(
              (r) => ({
                value: r,
                label: `${r} ${t("shop.filter.stars")}`,
              }),
            )}
          />
        </div>
      </div>

      <Divider style={{ margin: "8px 0" }} />
      <Button block onClick={handleResetFilter}>
        {t("shop.filter.reset")}
      </Button>
    </div>
  );

  const handleOpenModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (formData: Partial<Product>) => {
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
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      message.error(errMsg || t("shop.saveError"));
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
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          message.error(errMsg || t("shop.saveError"));
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

  const headerActions = (
    <Space wrap align="center">
      <Input.Search
        placeholder={t("common.search")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onSearch={(value) => setSearchTerm(value)}
        enterButton={<SearchOutlined />}
        className={styles.searchInput}
        allowClear
      />
      <Popover
        content={filterContent}
        trigger="click"
        open={filterOpen}
        onOpenChange={setFilterOpen}
        placement="bottomRight"
      >
        <Button
          icon={<FilterOutlined />}
          className={styles.filterBtn}
          type={isFilterActive ? "primary" : "default"}
        />
      </Popover>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => handleOpenModal()}
        className={styles.addBtn}
      >
        {t("shop.addProduct")}
      </Button>
    </Space>
  );

  return (
    <PageContainer title={t("shop.title")} headerRight={headerActions}>
      {fetchLoading ? (
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
                isLoading={mutateLoading}
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

      <ProductModal
        open={showModal}
        editingProduct={editingProduct}
        onSave={handleSaveProduct}
        onCancel={handleCloseModal}
        isLoading={mutateLoading}
      />
    </PageContainer>
  );
};

export default ShopPage;
