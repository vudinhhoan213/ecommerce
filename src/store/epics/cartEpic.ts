import { ofType } from "redux-observable";
import { buffer, debounceTime, filter, map, share } from "rxjs/operators";
import { message } from "antd";
import type { Action } from "@reduxjs/toolkit";
import type { Observable } from "rxjs";
import i18n from "../../i18n";
import { addToCart, cartBatchNotified } from "../cart/cartSlice";

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
        message.success(i18n.t("cart.addedSingle", { name: items[0] }));
      } else {
        message.success(i18n.t("cart.addedMultiple", { count: items.length }));
      }

      return cartBatchNotified(items.length);
    }),
  );
};
