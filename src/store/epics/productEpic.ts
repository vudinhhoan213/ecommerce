import { ofType } from "redux-observable";
import { from, of } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import { createAction } from "@reduxjs/toolkit";
import type { Action } from "@reduxjs/toolkit";
import type { Observable } from "rxjs";
import { productService } from "../../services";
import type { Product } from "../../types";

// =============================================
// ACTIONS — mỗi thunk cũ = 1 trigger + 1 success + 1 failed
// =============================================

// Fetch all products
export const fetchProducts = createAction("product/fetchProducts");
export const fetchProductsSuccess = createAction<Product[]>(
  "product/fetchProductsSuccess",
);
export const fetchProductsFailed = createAction<string>(
  "product/fetchProductsFailed",
);

// Fetch product by id
export const fetchProductById = createAction<string | number>(
  "product/fetchProductById",
);
export const fetchProductByIdSuccess = createAction<Product>(
  "product/fetchProductByIdSuccess",
);
export const fetchProductByIdFailed = createAction<string>(
  "product/fetchProductByIdFailed",
);

// Create product
export const createProduct = createAction<Partial<Product>>(
  "product/createProduct",
);
export const createProductSuccess = createAction<Product>(
  "product/createProductSuccess",
);
export const createProductFailed = createAction<string>(
  "product/createProductFailed",
);

// Update product
export const updateProduct = createAction<{ id: number; data: Partial<Product> }>(
  "product/updateProduct",
);
export const updateProductSuccess = createAction<Product>(
  "product/updateProductSuccess",
);
export const updateProductFailed = createAction<string>(
  "product/updateProductFailed",
);

// Delete product
export const deleteProduct = createAction<number>("product/deleteProduct");
export const deleteProductSuccess = createAction<number>(
  "product/deleteProductSuccess",
);
export const deleteProductFailed = createAction<string>(
  "product/deleteProductFailed",
);

// =============================================
// EPICS
// =============================================

export const fetchProductsEpic = (
  action$: Observable<Action>,
): Observable<Action> =>
  action$.pipe(
    ofType(fetchProducts.type),
    switchMap(() =>
      from(productService.getAll()).pipe(
        map((data) => fetchProductsSuccess(data.products)),
        catchError((err) => {
          const msg = err instanceof Error ? err.message : String(err);
          return of(fetchProductsFailed(msg));
        }),
      ),
    ),
  );

export const fetchProductByIdEpic = (
  action$: Observable<Action>,
): Observable<Action> =>
  action$.pipe(
    ofType(fetchProductById.type),
    switchMap((action) => {
      const id = (action as ReturnType<typeof fetchProductById>).payload;
      return from(productService.getById(id)).pipe(
        map((product) => fetchProductByIdSuccess(product)),
        catchError((err) => {
          const msg = err instanceof Error ? err.message : String(err);
          return of(fetchProductByIdFailed(msg));
        }),
      );
    }),
  );

export const createProductEpic = (
  action$: Observable<Action>,
): Observable<Action> =>
  action$.pipe(
    ofType(createProduct.type),
    switchMap((action) => {
      const product = (action as ReturnType<typeof createProduct>).payload;
      return from(productService.create(product)).pipe(
        map((created) => createProductSuccess(created)),
        catchError((err) => {
          const msg = err instanceof Error ? err.message : String(err);
          return of(createProductFailed(msg));
        }),
      );
    }),
  );

export const updateProductEpic = (
  action$: Observable<Action>,
): Observable<Action> =>
  action$.pipe(
    ofType(updateProduct.type),
    switchMap((action) => {
      const { id, data } = (action as ReturnType<typeof updateProduct>).payload;
      return from(productService.update(id, data)).pipe(
        map((updated) => updateProductSuccess(updated)),
        catchError((err) => {
          const msg = err instanceof Error ? err.message : String(err);
          return of(updateProductFailed(msg));
        }),
      );
    }),
  );

export const deleteProductEpic = (
  action$: Observable<Action>,
): Observable<Action> =>
  action$.pipe(
    ofType(deleteProduct.type),
    switchMap((action) => {
      const id = (action as ReturnType<typeof deleteProduct>).payload;
      return from(productService.delete(id)).pipe(
        map(() => deleteProductSuccess(id)),
        catchError((err) => {
          const msg = err instanceof Error ? err.message : String(err);
          return of(deleteProductFailed(msg));
        }),
      );
    }),
  );
