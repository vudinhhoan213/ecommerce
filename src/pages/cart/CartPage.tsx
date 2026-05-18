import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import type { CartItem } from "../../types";
import type { AppDispatch } from "../../store/store";
import {
  selectCartList,
  selectCartTotals,
  selectTotalItems,
  updateQuantity,
  removeFromCart,
} from "../../store/cartSlice";
import { formatVND } from "../../utils/format";
import styles from "./CartPage.module.css";
import { InputNumber } from "antd";

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const cartList = useSelector(selectCartList);
  const totalItems = useSelector(selectTotalItems);
  const { subTotal, tax, total } = useSelector(selectCartTotals);

  return (
    <div className={styles.container}>
      <div className={styles.cartHeader}>
        <h2>{t("cart.title")}</h2>
        <span>{t("cart.itemCount", { count: totalItems })}</span>
      </div>

      {cartList.length === 0 ? (
        <p className={styles.emptyCart}>{t("cart.empty")}</p>
      ) : (
        <div className={styles.cartContent}>
          <div className={styles.itemList}>
            {cartList.map((item: CartItem) => (
              <div key={`${item.id}-${item.selectedColor}`}>
                <img
                  src={item.thumbnail || item.image}
                  alt={item.title || item.name}
                  className={styles.itemImage}
                />
                <div className={styles.itemInfo}>
                  <h4>
                    {t("cart.phone")} {item.title || item.name}
                  </h4>
                  <p>{item.description}</p>
                  <div className={styles.itemPrice}>
                    {formatVND(item.price)}
                  </div>
                </div>
                <div className={styles.qtyController}>
                  <InputNumber
                    min={1}
                    value={item.quantity}
                    onChange={(value) => {
                      if (value !== null && value > 0) {
                        dispatch(
                          updateQuantity({
                            productId: item.id,
                            color: item.selectedColor,
                            newQuantity: value,
                          }),
                        );
                      }
                    }}
                    style={{ width: "120px", margin: "0 10px" }}
                  />
                  <button
                    onClick={() =>
                      dispatch(
                        removeFromCart({
                          productId: item.id,
                          color: item.selectedColor,
                        }),
                      )
                    }
                    className={styles.removeBtn}
                  >
                    {t("cart.removeItem")}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.billingSection}>
            <div className={styles.billingRow}>
              <span>{t("cart.subTotal")}</span>
              <span>{formatVND(subTotal)}</span>
            </div>
            <div className={styles.billingRow}>
              <span>{t("cart.tax")}</span>
              <span>{formatVND(tax)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>{t("cart.total")}</span>
              <span>{formatVND(total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
