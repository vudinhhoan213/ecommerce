import { combineEpics, Epic } from "redux-observable";
import type { Action } from "@reduxjs/toolkit";
import { searchEpic } from "./searchEpic";
import { cartBatchEpic } from "./cartEpic";
import { searchSuggestEpic } from "./searchSuggestEpic";
import { initAuthEpic } from "./initAuthEpic";
import {
  fetchProductsEpic,
  fetchProductByIdEpic,
  createProductEpic,
  updateProductEpic,
  deleteProductEpic,
} from "./productEpic";
import { fetchUserProfileEpic, loginUserEpic } from "./authEpic";

const rootEpic: Epic<Action, Action, void> = combineEpics(
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
  updateProductEpic,
  deleteProductEpic,
  // Auth
  fetchUserProfileEpic,
  loginUserEpic,
);

export default rootEpic;
