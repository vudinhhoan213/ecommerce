// src/controllers/useCartController.js
import { useState, useMemo } from "react";

export const useCartController = () => {
  // Quản lý danh sách sản phẩm trong giỏ hàng
  const [cartList, setCartList] = useState([]);

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (product, color) => {
    setCartList((prevList) => {
      // Tìm xem sản phẩm cùng màu đã tồn tại trong giỏ chưa
      const existingIndex = prevList.findIndex(
        (item) => item.id === product.id && item.selectedColor === color,
      );

      if (existingIndex > -1) {
        // Nếu đã có, tăng số lượng lên 1
        const newList = [...prevList];
        newList[existingIndex].quantity += 1;
        return newList;
      } else {
        // Nếu chưa có, thêm mới sản phẩm với quantity = 1
        return [...prevList, { ...product, quantity: 1, selectedColor: color }];
      }
    });
  };

  // Hàm cập nhật số lượng trực tiếp (+ hoặc -)
  const updateQuantity = (productId, color, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId, color);
      return;
    }
    setCartList((prevList) =>
      prevList.map((item) =>
        item.id === productId && item.selectedColor === color
          ? { ...item, quantity: newQty }
          : item,
      ),
    );
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId, color) => {
    setCartList((prevList) =>
      prevList.filter(
        (item) => !(item.id === productId && item.selectedColor === color),
      ),
    );
  };

  // Tự động tính toán hóa đơn bằng useMemo để tối ưu hóa hiệu năng
  const billing = useMemo(() => {
    const subTotal = cartList.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const tax = Math.round(subTotal * 0.1); // Thuế 10% VAT như trên Figma
    const total = subTotal + tax;
    return { subTotal, tax, total };
  }, [cartList]);

  return {
    cartList,
    addToCart,
    updateQuantity,
    removeFromCart,
    ...billing,
  };
};
