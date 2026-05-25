import { ofType } from "redux-observable";
import { of } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { createAction } from "@reduxjs/toolkit";
import type { Action } from "@reduxjs/toolkit";
import type { Observable } from "rxjs";
import type { Product } from "../../types";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

// =============================================
// ACTIONS
// =============================================

export const fetchProducts = createAction("product/fetchProducts");
export const fetchProductsSuccess = createAction<Product[]>(
  "product/fetchProductsSuccess",
);
export const fetchProductsFailed = createAction<string>(
  "product/fetchProductsFailed",
);

export const fetchProductById = createAction<string | number>(
  "product/fetchProductById",
);
export const fetchProductByIdSuccess = createAction<Product>(
  "product/fetchProductByIdSuccess",
);
export const fetchProductByIdFailed = createAction<string>(
  "product/fetchProductByIdFailed",
);

export const createProduct = createAction<Partial<Product>>(
  "product/createProduct",
);
export const createProductSuccess = createAction<Product>(
  "product/createProductSuccess",
);
export const createProductFailed = createAction<string>(
  "product/createProductFailed",
);

export const updateProduct = createAction<{
  id: number;
  data: Partial<Product>;
}>("product/updateProduct");
export const updateProductSuccess = createAction<Product>(
  "product/updateProductSuccess",
);
export const updateProductFailed = createAction<string>(
  "product/updateProductFailed",
);

export const deleteProduct = createAction<number>("product/deleteProduct");
export const deleteProductSuccess = createAction<number>(
  "product/deleteProductSuccess",
);
export const deleteProductFailed = createAction<string>(
  "product/deleteProductFailed",
);

// =============================================
// HELPER
// =============================================

const getHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleError = (err: unknown): string =>
  err instanceof Error ? err.message : String(err);

// =============================================
// EPICS
// =============================================

export const fetchProductsEpic = (
  action$: Observable<Action>,
): Observable<Action> =>
  action$.pipe(
    ofType(fetchProducts.type),
    switchMap(() =>
      ajax
        .get<{ products: Product[] }>(`${BASE_URL}/products`, getHeaders())
        .pipe(
          map((res) => fetchProductsSuccess(res.response.products)),
          catchError((err) => of(fetchProductsFailed(handleError(err)))),
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
      return ajax
        .get<Product>(`${BASE_URL}/products/${id}`, getHeaders())
        .pipe(
          map((res) => fetchProductByIdSuccess(res.response)),
          catchError((err) => of(fetchProductByIdFailed(handleError(err)))),
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
      return ajax
        .post<Product>(`${BASE_URL}/products/add`, product, getHeaders())
        .pipe(
          map((res) => createProductSuccess(res.response)),
          catchError((err) => of(createProductFailed(handleError(err)))),
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
      return ajax
        .put<Product>(`${BASE_URL}/products/${id}`, data, getHeaders())
        .pipe(
          map((res) => updateProductSuccess(res.response)),
          catchError((err) => of(updateProductFailed(handleError(err)))),
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
      return ajax
        .delete<Product>(`${BASE_URL}/products/${id}`, getHeaders())
        .pipe(
          map(() => deleteProductSuccess(id)),
          catchError((err) => of(deleteProductFailed(handleError(err)))),
        );
    }),
  );
