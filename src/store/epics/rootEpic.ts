import { combineEpics, Epic } from "redux-observable";
import type { Action } from "@reduxjs/toolkit";
import { searchEpic } from "./searchEpic";
import { cartBatchEpic } from "./cartEpic";

const rootEpic: Epic<Action, Action, void> = combineEpics(
  searchEpic,
  cartBatchEpic,
);

export default rootEpic;
