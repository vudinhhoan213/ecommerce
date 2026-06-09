import { ofType } from "redux-observable";
import { of } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import type { Action } from "@reduxjs/toolkit";
import type { Observable } from "rxjs";
import type { ApiUserData } from "../../../types";
import i18n from "../../../lib/i18n";
import { mapUserProfile } from "../../../mappers";
import {
  fetchUserProfile,
  fetchUserProfileSuccess,
  fetchUserProfileFailed,
  loginUser,
  loginUserSuccess,
  loginUserFailed,
} from "./authSlice";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

// =============================================
// HELPER
// =============================================

const handleError = (err: unknown): string =>
  err instanceof Error ? err.message : String(err);

// =============================================
// EPICS
// =============================================

export const fetchUserProfileEpic = (
  action$: Observable<Action>,
): Observable<Action> =>
  action$.pipe(
    ofType(fetchUserProfile.type),
    switchMap((action) => {
      const token = (action as ReturnType<typeof fetchUserProfile>).payload;
      return ajax
        .get<ApiUserData>(`${BASE_URL}/auth/me`, {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        })
        .pipe(
          map((res) => fetchUserProfileSuccess(mapUserProfile(res.response))),
          catchError((err) => of(fetchUserProfileFailed(handleError(err)))),
        );
    }),
  );

export const loginUserEpic = (
  action$: Observable<Action>,
): Observable<Action> =>
  action$.pipe(
    ofType(loginUser.type),
    switchMap((action) => {
      const credentials = (action as ReturnType<typeof loginUser>).payload;
      return ajax
        .post<{ accessToken?: string; token?: string }>(
          `${BASE_URL}/auth/login`,
          {
            username: credentials.username.trim(),
            password: credentials.password,
            expiresInMins: 30,
          },
          { "Content-Type": "application/json" },
        )
        .pipe(
          switchMap((res) => {
            const token = res.response.accessToken || res.response.token;
            if (!token) {
              return of(loginUserFailed(i18n.t("error.noToken")));
            }
            localStorage.setItem("accessToken", token);
            return of(loginUserSuccess(token), fetchUserProfile(token));
          }),
          catchError((err) => of(loginUserFailed(handleError(err)))),
        );
    }),
  );
