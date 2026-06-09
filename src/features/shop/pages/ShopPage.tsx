import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Space, Modal, message, Skeleton, Card, Popover } from "antd";
import {
  FilterOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import SearchAutocomplete from "../components/SearchAutocomplete";
import FilterPopover, {
  DEFAULT_FILTER,
  type FilterState,
} from "../components/FilterPopover";
import PageContainer from "../../../components/ui/PageContainer";
import Pagination from "../../../components/ui/Pagination";
import {
  selectProducts,
  selectFetchLoading,
  selectMutateLoading,
  selectProductError,
  selectDebouncedSearch,
  selectSearchTerm,
  fetchProducts,
  setSearchTerm,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../store";
import type { Product } from "../../../types";
import type { AppDispatch } from "../../../lib/store";
import styles from "./ShopPage.module.css";
import { formatVND } from "../../../utils/format";

const PRODUCTS_PER_PAGE = 20;

const ShopPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const products = useSelector(selectProducts);
  const fetchLoading = useSelector(selectFetchLoading);
  const mutateLoading = useSelector(selectMutateLoading);
  const error = useSelector(selectProductError);
  const searchTerm = useSelector(selectSearchTerm);
  const debouncedSearch = useSelector(selectDebouncedSearch);

  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [filterOpen, setFilterOpen] = useState(false);

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
      const matchPrice =
        product.price >= filter.priceFrom && product.price <= filter.priceTo;
      const matchRating =
        product.rating >= filter.ratingFrom &&
        product.rating <= filter.ratingTo;
      return matchPrice && matchRating;
    });
  }, [products, filter]);

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

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "ArrowLeft" && currentPage > 1) {
        handlePageChange(currentPage - 1);
      } else if (e.key === "ArrowRight" && currentPage < totalPages) {
        handlePageChange(currentPage + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages, handlePageChange]);

  const handleOpenModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = (formData: Partial<Product>) => {
    if (editingProduct) {
      dispatch(updateProduct({ id: editingProduct.id, data: formData }));
    } else {
      dispatch(createProduct(formData));
    }
    handleCloseModal();
    message.success(
      editingProduct ? t("shop.updateSuccess") : t("shop.addSuccess"),
    );
  };

  const handleDeleteProduct = (productId: number) => {
    Modal.confirm({
      title: t("shop.confirmDelete"),
      icon: <ExclamationCircleOutlined />,
      content: t("shop.confirmDeleteContent"),
      okText: t("common.delete"),
      okType: "danger",
      cancelText: t("common.cancel"),
      onOk: () => {
        dispatch(deleteProduct(productId));
        message.success(t("shop.deleteSuccess"));
      },
    });
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
      <SearchAutocomplete
        value={searchTerm}
        onChange={(val) => {
          dispatch(setSearchTerm(val));
        }}
        onSearch={(val) => {
          dispatch(setSearchTerm(val));
        }}
        onSelectProduct={(slug) => navigate(`/shop/${slug}`)}
        className={styles.searchInput}
      />
      <Popover
        content={
          <FilterPopover
            filter={filter}
            onFilterChange={setFilter}
            onReset={() => setFilter(DEFAULT_FILTER)}
          />
        }
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
    <PageContainer
      title={t("shop.title")}
      headerRight={headerActions}
      footer={
        totalPages > 1 ? (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        ) : undefined
      }
    >
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
