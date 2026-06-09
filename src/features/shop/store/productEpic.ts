import { ofType } from "redux-observable";
import { of } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import type { Action } from "@reduxjs/toolkit";
import type { Observable } from "rxjs";
import type { StateObservable } from "redux-observable";
import type { RootState } from "../../../lib/store";
import type { Product } from "../../../types";
import { mapProduct, mapProducts } from "../../../mappers";
import {
  fetchProducts,
  setDebouncedSearch,
  fetchProductsSuccess,
  fetchProductsFailed,
  fetchProductById,
  fetchProductByIdSuccess,
  fetchProductByIdFailed,
  createProduct,
  createProductSuccess,
  createProductFailed,
  updateProduct,
  updateProductSuccess,
  updateProductFailed,
  deleteProduct,
  deleteProductSuccess,
  deleteProductFailed,
} from "./productSlice";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

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
          map((res) =>
            fetchProductsSuccess(mapProducts(res.response.products)),
          ),
          catchError((err) => of(fetchProductsFailed(handleError(err)))),
        ),
    ),
  );

// =============================================
// SEARCH PRODUCTS EPIC
// =============================================

export const searchProductsEpic = (
  action$: Observable<Action>,
): Observable<Action> =>
  action$.pipe(
    ofType(setDebouncedSearch.type),
    switchMap((action) => {
      const term = (action as ReturnType<typeof setDebouncedSearch>).payload;

      if (!term.trim()) {
        return of(fetchProducts());
      }

      return ajax
        .getJSON<{
          products: Product[];
        }>(`${BASE_URL}/products/search?q=${encodeURIComponent(term)}`)
        .pipe(
          map((data) => fetchProductsSuccess(mapProducts(data.products))),
          catchError((err) => of(fetchProductsFailed(handleError(err)))),
        );
    }),
  );

export const fetchProductByIdEpic = (
  action$: Observable<Action>,
): Observable<Action> =>
  action$.pipe(
    ofType(fetchProductById.type),
    switchMap((action) => {
      const id = (action as ReturnType<typeof fetchProductById>).payload;
      return ajax.get<Product>(`${BASE_URL}/products/${id}`, getHeaders()).pipe(
        map((res) => fetchProductByIdSuccess(mapProduct(res.response))),
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
          map((res) => createProductSuccess(mapProduct(res.response))),
          catchError((err) => of(createProductFailed(handleError(err)))),
        );
    }),
  );

export const updateProductEpic = (
  action$: Observable<Action>,
  state$: StateObservable<RootState>,
): Observable<Action> =>
  action$.pipe(
    ofType(updateProduct.type),
    switchMap((action) => {
      const { id, data } = (action as ReturnType<typeof updateProduct>).payload;

      const existing =
        state$.value.product.products.find((p) => p.id === id) ||
        state$.value.product.currentProduct;

      return ajax
        .put<Product>(`${BASE_URL}/products/${id}`, data, getHeaders())
        .pipe(
          map((res) => {
            const merged = mapProduct({
              ...existing,
              ...res.response,
            } as Product);
            return updateProductSuccess(merged);
          }),
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
