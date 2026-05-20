import React from "react";
import { Button, Select, Divider } from "antd";
import { useTranslation } from "react-i18next";
import { formatVND } from "../../utils/format";

const PRICE_OPTIONS = [0, 1000, 5000, 10000, 20000, 50000, 100000];
const RATING_OPTIONS = [0, 1, 2, 3, 4, 5];

export interface FilterState {
  priceFrom: number;
  priceTo: number;
  ratingFrom: number;
  ratingTo: number;
}

export const DEFAULT_FILTER: FilterState = {
  priceFrom: 0,
  priceTo: 100000,
  ratingFrom: 0,
  ratingTo: 5,
};

interface FilterPopoverProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  onReset: () => void;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({
  filter,
  onFilterChange,
  onReset,
}) => {
  const { t } = useTranslation();

  const updateFilter = (partial: Partial<FilterState>) => {
    onFilterChange({ ...filter, ...partial });
  };

  return (
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
            onChange={(val) => updateFilter({ priceFrom: val })}
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
            onChange={(val) => updateFilter({ priceTo: val })}
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
            onChange={(val) => updateFilter({ ratingFrom: val })}
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
            onChange={(val) => updateFilter({ ratingTo: val })}
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
      <Button block onClick={onReset}>
        {t("shop.filter.reset")}
      </Button>
    </div>
  );
};

export default FilterPopover;
