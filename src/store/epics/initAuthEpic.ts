import { ofType } from "redux-observable";
import { map } from "rxjs/operators";
import { createAction } from "@reduxjs/toolkit";
import type { Action } from "@reduxjs/toolkit";
import type { Observable } from "rxjs";
import { fetchUserProfile, setUnauthenticated } from "../auth/authSlice";

// =============================================
// ACTION (chỉ còn appInit là action riêng vì không thuộc slice nào)
// =============================================

export const appInit = createAction("app/init");

// =============================================
// EPIC
// =============================================

export const initAuthEpic = (action$: Observable<Action>): Observable<Action> =>
  action$.pipe(
    ofType(appInit.type),
    map(() => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        return fetchUserProfile(token);
      }
      return setUnauthenticated();
    }),
  );
