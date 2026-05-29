import React, { useState, useRef, useEffect } from "react";
import { Input, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSuggestResults,
  selectSuggestLoading,
} from "../../store/product/searchSuggestSlice";
import { searchSuggest, searchSuggestClear } from "../../store/epics";
import { formatVND } from "../../utils/format";
import { slugify } from "../../utils/slugify";
import styles from "./SearchAutocomplete.module.css";

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  onSelectProduct?: (slug: string) => void;
  className?: string;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  value,
  onChange,
  onSearch,
  onSelectProduct,
  className,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const results = useSelector(selectSuggestResults);
  const loading = useSelector(selectSuggestLoading);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    dispatch(searchSuggest(val));
    setShowDropdown(true);
  };

  const handleSearch = (val: string) => {
    onSearch(val);
    setShowDropdown(false);
    dispatch(searchSuggestClear());
  };

  const handleSelect = (title: string) => {
    onChange(title);
    onSearch(title);
    setShowDropdown(false);
    dispatch(searchSuggestClear());
    onSelectProduct?.(slugify(title));
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <Input.Search
        placeholder={t("common.search")}
        value={value}
        onChange={handleChange}
        onSearch={handleSearch}
        onFocus={() => results.length > 0 && setShowDropdown(true)}
        enterButton={<SearchOutlined />}
        className={className}
        allowClear
      />

      {showDropdown && (results.length > 0 || loading) && (
        <div className={styles.dropdown}>
          {loading && (
            <div className={styles.loadingRow}>
              <Spin size="small" />
              <span>{t("common.searching") || "Đang tìm..."}</span>
            </div>
          )}

          {results.map((product) => (
            <div
              key={product.id}
              className={styles.item}
              onMouseDown={() => handleSelect(product.title)}
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className={styles.thumbnail}
              />
              <div className={styles.info}>
                <span className={styles.title}>{product.title}</span>
                <span className={styles.price}>{formatVND(product.price)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
