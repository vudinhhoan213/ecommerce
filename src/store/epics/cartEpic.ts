import { ofType } from "redux-observable";
import { buffer, debounceTime, filter, map, share } from "rxjs/operators";
import { message } from "antd";
import type { Action } from "@reduxjs/toolkit";
import type { Observable } from "rxjs";
import { createAction } from "@reduxjs/toolkit";
import { addToCart } from "../cart";

export const cartBatchNotified = createAction<number>("cart/batchNotified");

export const cartBatchEpic = (
  action$: Observable<Action>,
): Observable<Action> => {
  const addToCart$ = action$.pipe(ofType(addToCart.type), share());

  return addToCart$.pipe(
    buffer(addToCart$.pipe(debounceTime(500))),

    filter((actions) => actions.length > 0),

    map((actions) => {
      const items = actions.map(
        (a) => (a as ReturnType<typeof addToCart>).payload.product.title,
      );

      if (items.length === 1) {
        message.success(`Đã thêm "${items[0]}" vào giỏ hàng`);
      } else {
        message.success(`Đã thêm ${items.length} sản phẩm vào giỏ hàng`);
      }

      return cartBatchNotified(items.length);
    }),
  );
};
