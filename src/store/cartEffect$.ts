import { Subject } from "rxjs";
import { buffer, debounceTime, filter } from "rxjs/operators";
import { message } from "antd";

/**
 * cartEffect$ — Batch nhiều lần "Add to Cart" liên tiếp thành 1 toast
 *
 * Vấn đề: User click nhanh 5 lần → 5 toast "Đã thêm SP" → phiền
 * Giải pháp: Gom tất cả events trong 1.5s → hiện 1 toast duy nhất
 *
 * Flow:
 *   click "Add" → emitCartAdd("iPhone")
 *   click "Add" → emitCartAdd("iPad")     ← trong vòng 1.5s
 *   click "Add" → emitCartAdd("AirPods")  ← trong vòng 1.5s
 *   (ngừng 1.5s)
 *   → Toast: "Đã thêm 3 sản phẩm vào giỏ hàng"
 *
 * @example
 * import { emitCartAdd } from "../store/cartEffect$";
 *
 * dispatch(addToCart({ product, color }));
 * emitCartAdd(product.title);  // ← gọi sau dispatch
 */

// Subject nhận tên sản phẩm mỗi lần addToCart
const cartAdd$ = new Subject<string>();

// Gom events: đợi 1.5s không có event mới → emit batch
const batched$ = cartAdd$.pipe(
  buffer(cartAdd$.pipe(debounceTime(1500))),
  filter((items) => items.length > 0),
);

// Subscribe 1 lần duy nhất (module-level singleton)
batched$.subscribe((items) => {
  if (items.length === 1) {
    message.success(`Đã thêm "${items[0]}" vào giỏ hàng`);
  } else {
    message.success(`Đã thêm ${items.length} sản phẩm vào giỏ hàng`);
  }
});

// Export function để component gọi
export const emitCartAdd = (productName: string) => cartAdd$.next(productName);
