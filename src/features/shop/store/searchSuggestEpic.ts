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
import type { Action } from "@reduxjs/toolkit";
import type { Observable } from "rxjs";
import { mapSuggestResults } from "../../../mappers";
import i18n from "../../../lib/i18n";
import {
  searchSuggest,
  searchSuggestSuccess,
  searchSuggestFailed,
  searchSuggestClear,
  type SuggestResult,
} from "./searchSuggestSlice";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

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
          map((data) => searchSuggestSuccess(mapSuggestResults(data.products))),
          catchError((err) => {
            const msg = err instanceof Error ? err.message : i18n.t("error.searchFailed");
            return of(searchSuggestFailed(msg));
          }),
        );
    }),
  );
