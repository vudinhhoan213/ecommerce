import { ofType } from "redux-observable";
import { of } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { createAction } from "@reduxjs/toolkit";
import type { Action } from "@reduxjs/toolkit";
import type { Observable } from "rxjs";
import type { UserData, LoginCredentials, ApiUserData } from "../../types";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

// =============================================
// ACTIONS
// =============================================

export const fetchUserProfile = createAction<string>("auth/fetchUserProfile");
export const fetchUserProfileSuccess = createAction<UserData>(
  "auth/fetchUserProfileSuccess",
);
export const fetchUserProfileFailed = createAction<string>(
  "auth/fetchUserProfileFailed",
);

export const loginUser = createAction<LoginCredentials>("auth/loginUser");
export const loginUserSuccess = createAction<string>("auth/loginUserSuccess");
export const loginUserFailed = createAction<string>("auth/loginUserFailed");

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
          map((res) => {
            const data = res.response;
            return fetchUserProfileSuccess({
              ...data,
              name: `${data.firstName} ${data.lastName}`,
              avatar: data.image,
              dob: data.birthDate || "N/A",
              companyAddress: data.company?.address?.address || "N/A",
              homeAddress: data.address?.address || "N/A",
            } as UserData);
          }),
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
              return of(loginUserFailed("Không nhận được token"));
            }
            localStorage.setItem("accessToken", token);
            return of(loginUserSuccess(token), fetchUserProfile(token));
          }),
          catchError((err) => of(loginUserFailed(handleError(err)))),
        );
    }),
  );
