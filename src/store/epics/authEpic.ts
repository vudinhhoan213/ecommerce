import { ofType } from "redux-observable";
import { from, of } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import { createAction } from "@reduxjs/toolkit";
import type { Action } from "@reduxjs/toolkit";
import type { Observable } from "rxjs";
import { authService } from "../../services";
import type { UserData, LoginCredentials } from "../../types";

// =============================================
// ACTIONS
// =============================================

// Fetch user profile
export const fetchUserProfile = createAction<string>("auth/fetchUserProfile");
export const fetchUserProfileSuccess = createAction<UserData>(
  "auth/fetchUserProfileSuccess",
);
export const fetchUserProfileFailed = createAction<string>(
  "auth/fetchUserProfileFailed",
);

// Login
export const loginUser = createAction<LoginCredentials>("auth/loginUser");
export const loginUserSuccess = createAction<string>("auth/loginUserSuccess");
export const loginUserFailed = createAction<string>("auth/loginUserFailed");

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
      return from(authService.getProfile(token)).pipe(
        map((data) =>
          fetchUserProfileSuccess({
            ...data,
            name: `${data.firstName} ${data.lastName}`,
            avatar: data.image,
            dob: data.birthDate || "N/A",
            companyAddress: data.company?.address?.address || "N/A",
            homeAddress: data.address?.address || "N/A",
          } as UserData),
        ),
        catchError((err) => {
          const msg = err instanceof Error ? err.message : String(err);
          return of(fetchUserProfileFailed(msg));
        }),
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
      return from(authService.login(credentials)).pipe(
        switchMap((data) => {
          const token = data.accessToken || data.token;
          if (!token) {
            return of(loginUserFailed("Không nhận được token"));
          }
          localStorage.setItem("accessToken", token);
          // Sau khi login thành công → dispatch fetchUserProfile
          return of(loginUserSuccess(token), fetchUserProfile(token));
        }),
        catchError((err) => {
          const msg = err instanceof Error ? err.message : String(err);
          return of(loginUserFailed(msg));
        }),
      );
    }),
  );
