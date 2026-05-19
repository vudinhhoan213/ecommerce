import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import type { CartItem } from "../../types";
import type { AppDispatch } from "../../store/store";
import PageContainer from "../../components/common/PageContainer";
import {
  selectCartList,
  selectCartTotals,
  selectTotalItems,
  updateQuantity,
  removeFromCart,
} from "../../store/cartSlice";
import { formatVND } from "../../utils/format";
import styles from "./CartPage.module.css";

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const cartList = useSelector(selectCartList);
  const totalItems = useSelector(selectTotalItems);
  const { subTotal, tax, total } = useSelector(selectCartTotals);

  return (
    <PageContainer
      title={t("cart.title")}
    >
      {cartList.length === 0 ? (
        <p className={styles.emptyCart}>{t("cart.empty")}</p>
      ) : (
        <div className={styles.cartContent}>
          <span className={styles.itemCount}>
            {t("cart.itemCount", { count: totalItems })}
          </span>
          <div className={styles.itemList}>
            {cartList.map((item: CartItem) => (
              <div
                key={`${item.id}-${item.selectedColor}`}
                className={styles.cartItem}
              >
                <div className={styles.itemImageWrapper}>
                  <img
                    src={item.thumbnail || item.image}
                    alt={item.title || item.name}
                    className={styles.itemImage}
                  />
                </div>

                <div className={styles.itemInfo}>
                  <h4 className={styles.itemTitle}>
                    {t("cart.phone")} {item.title || item.name}
                  </h4>
                  <p className={styles.itemDescription}>{item.description}</p>
                  <div className={styles.itemPrice}>
                    {formatVND(item.price * item.quantity)}
                  </div>
                </div>

                <div className={styles.itemActions}>
                  <div className={styles.qtyController}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: item.id,
                            color: item.selectedColor,
                            newQuantity: item.quantity + 1,
                          }),
                        )
                      }
                    >
                      +
                    </button>
                    <input
                      type="number"
                      className={styles.qtyInput}
                      value={item.quantity}
                      min={1}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val > 0) {
                          dispatch(
                            updateQuantity({
                              productId: item.id,
                              color: item.selectedColor,
                              newQuantity: val,
                            }),
                          );
                        }
                      }}
                    />
                    <button
                      className={styles.qtyBtn}
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: item.id,
                            color: item.selectedColor,
                            newQuantity: item.quantity - 1,
                          }),
                        )
                      }
                    >
                      -
                    </button>
                  </div>
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
                    ✕
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
    </PageContainer>
  );
};

export default CartPage;
