import { ofType } from "redux-observable";
import { of } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
  catchError,
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { createAction } from "@reduxjs/toolkit";
import type { Action } from "@reduxjs/toolkit";
import type { Observable } from "rxjs";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

// =============================================
// TYPES
// =============================================

export interface SuggestResult {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
}

// =============================================
// ACTIONS
// =============================================

// Input: user gõ vào ô tìm kiếm → gợi ý sản phẩm
export const searchSuggest = createAction<string>("searchSuggest/search");

// Output: kết quả gợi ý từ API
export const searchSuggestSuccess = createAction<SuggestResult[]>(
  "searchSuggest/success",
);

export const searchSuggestFailed = createAction<string>(
  "searchSuggest/failed",
);

// Clear kết quả gợi ý (khi user chọn hoặc đóng dropdown)
export const searchSuggestClear = createAction("searchSuggest/clear");

// =============================================
// EPIC
// =============================================

export const searchSuggestEpic = (
  action$: Observable<Action>,
): Observable<Action> =>
  action$.pipe(
    ofType(searchSuggest.type),
    debounceTime(300),
    distinctUntilChanged(
      (prev, curr) =>
        (prev as ReturnType<typeof searchSuggest>).payload ===
        (curr as ReturnType<typeof searchSuggest>).payload,
    ),
    switchMap((action) => {
      const keyword = (action as ReturnType<typeof searchSuggest>).payload;

      if (!keyword.trim()) {
        return of(searchSuggestClear());
      }

      return ajax
        .getJSON<{ products: SuggestResult[] }>(
          `${BASE_URL}/products/search?q=${encodeURIComponent(keyword)}&limit=8`,
        )
        .pipe(
          map((data) => searchSuggestSuccess(data.products)),
          catchError((err) => {
            const msg = err instanceof Error ? err.message : "Lỗi tìm kiếm";
            return of(searchSuggestFailed(msg));
          }),
        );
    }),
  );
