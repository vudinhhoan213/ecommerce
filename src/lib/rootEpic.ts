import { combineEpics, Epic } from "redux-observable";
import type { Action } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import {
  initAuthEpic,
  fetchUserProfileEpic,
  loginUserEpic,
} from "../features/auth";
import { cartBatchEpic } from "../features/cart";

// =============================================
// ROOT EPIC
//
// Chỉ còn Auth + Cart epics.
// Shop feature đã chuyển sang React Query hoàn toàn.
// =============================================

export const rootEpic: Epic<Action, Action, RootState> = combineEpics(
  // App init
  initAuthEpic,
  // Auth
  fetchUserProfileEpic,
  loginUserEpic,
  // Cart
  cartBatchEpic,
);
