import { createSelector } from "@reduxjs/toolkit";
import type { CartItem } from "../../../types";
import type { RootState } from "../../../lib/store";

const TAX_RATE = 0.1;

export const selectCartList = (state: RootState) => state.cart.cartList;

export const selectTotalItems = (state: RootState) =>
  state.cart.cartList.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0,
  );

export const selectCartTotals = createSelector(
  selectCartList,
  (cartList) => {
    const subTotal = cartList.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0,
    );
    const tax = Math.round(subTotal * TAX_RATE);
    return { subTotal, tax, total: subTotal + tax };
  },
);
