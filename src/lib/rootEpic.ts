import { combineEpics, Epic } from "redux-observable";
import type { Action } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import {
  initAuthEpic,
  fetchUserProfileEpic,
  loginUserEpic,
} from "../features/auth";
import {
  fetchProductsEpic,
  fetchProductByIdEpic,
  createProductEpic,
  searchProductsEpic,
  updateProductEpic,
  deleteProductEpic,
  searchEpic,
  searchSuggestEpic,
} from "../features/shop";
import { cartBatchEpic } from "../features/cart";

export const rootEpic: Epic<Action, Action, RootState> = combineEpics(
  // App init
  initAuthEpic,
  // Auth
  fetchUserProfileEpic,
  loginUserEpic,
  // Search & Suggest
  searchEpic,
  searchSuggestEpic,
  // Cart
  cartBatchEpic,
  // Product CRUD
  fetchProductsEpic,
  fetchProductByIdEpic,
  createProductEpic,
  searchProductsEpic,
  updateProductEpic,
  deleteProductEpic,
);
