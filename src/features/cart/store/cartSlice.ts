import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartState, Product } from "../../../types";

const initialState: CartState = {
  cartList: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; color: string }>,
    ) => {
      const { product, color } = action.payload;
      const existing = state.cartList.find(
        (item) => item.id === product.id && item.selectedColor === color,
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.cartList.push({ ...product, selectedColor: color, quantity: 1 });
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{
        productId: number;
        color: string;
        newQuantity: number;
      }>,
    ) => {
      const { productId, color, newQuantity } = action.payload;
      if (newQuantity < 1) {
        state.cartList = state.cartList.filter(
          (item) => !(item.id === productId && item.selectedColor === color),
        );
      } else {
        const item = state.cartList.find(
          (item) => item.id === productId && item.selectedColor === color,
        );
        if (item) item.quantity = newQuantity;
      }
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ productId: number; color: string }>,
    ) => {
      const { productId, color } = action.payload;
      state.cartList = state.cartList.filter(
        (item) => !(item.id === productId && item.selectedColor === color),
      );
    },
    clearCart: (state) => {
      state.cartList = [];
    },
    cartBatchNotified: (state, action: PayloadAction<number>) => {},
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  cartBatchNotified,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
export default cartSlice.reducer;
