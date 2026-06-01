import { combineEpics, Epic } from "redux-observable";
import type { Action } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { searchEpic } from "./searchEpic";
import { cartBatchEpic } from "./cartEpic";
import { searchSuggestEpic } from "./searchSuggestEpic";
import { initAuthEpic } from "./initAuthEpic";
import {
  fetchProductsEpic,
  fetchProductByIdEpic,
  createProductEpic,
  searchProductsEpic,
  updateProductEpic,
  deleteProductEpic,
} from "./productEpic";
import { fetchUserProfileEpic, loginUserEpic } from "./authEpic";

const rootEpic: Epic<Action, Action, RootState> = combineEpics(
  // App init
  initAuthEpic,
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
  // Auth
  fetchUserProfileEpic,
  loginUserEpic,
);

export default rootEpic;
