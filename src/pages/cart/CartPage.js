import React from "react";
import { useCart } from "../../context/CartContext";
import styles from "./CartPage.module.css";
import { InputNumber } from "antd";

const CartPage = () => {
  const { cartList, updateQuantity, removeFromCart, subTotal, tax, total } =
    useCart();
  const formatVND = (num) =>
    new Intl.NumberFormat("vi-VN").format(num) + " VND";

  return (
    <div className={styles.container}>
      <div className={styles.cartHeader}>
        <h2>Cart</h2>
        <span>{cartList.length} items in bag</span>
      </div>

      {cartList.length === 0 ? (
        <p className={styles.emptyCart}>Không có sản phẩm nào trong giỏ.</p>
      ) : (
        <div className={styles.cartContent}>
          <div className={styles.itemList}>
            {cartList.map((item, index) => (
              <div key={`${item.id}-${index}`} className={styles.cartItem}>
                <img
                  src={item.thumbnail || item.image}
                  alt={item.title || item.name}
                  className={styles.itemImage}
                />

                <div className={styles.itemInfo}>
                  <h4>Điện thoại {item.title || item.name}</h4>
                  <p>{item.description}</p>
                  <div className={styles.itemPrice}>
                    {formatVND(item.price)}
                  </div>
                </div>

                <div className={styles.qtyController}>
                  <InputNumber
                    mode="spinner"
                    min={1}
                    value={item.quantity}
                    onChange={(value) => {
                      // Antd trả về trực tiếp giá trị số học (value).
                      // Nếu người dùng xóa trắng, giá trị sẽ là null, ta cần chặn lại.
                      if (value !== null && value > 0) {
                        updateQuantity(item.id, item.selectedColor, value);
                      }
                    }}
                    style={{ width: "120px", margin: "0 10px" }} // Độ rộng tùy chỉnh cho vừa mắt
                  />

                  <button
                    onClick={() => removeFromCart(item.id, item.selectedColor)}
                    className={styles.removeBtn}
                  >
                    Xóa món
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.billingSection}>
            <div className={styles.billingRow}>
              <span>SubTotal</span>
              <span>{formatVND(subTotal)}</span>
            </div>
            <div className={styles.billingRow}>
              <span>Tax</span>
              <span>{formatVND(tax)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>{formatVND(total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
