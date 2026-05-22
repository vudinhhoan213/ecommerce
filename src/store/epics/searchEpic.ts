import { ofType } from "redux-observable";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from "rxjs/operators";
import { of } from "rxjs";
import type { Action } from "@reduxjs/toolkit";
import type { Observable } from "rxjs";
import { createAction } from "@reduxjs/toolkit";

// === ACTION CREATORS ===

export const setSearchTerm = createAction<string>("product/setSearchTerm");

export const setDebouncedSearch = createAction<string>(
  "product/setDebouncedSearch",
);

// === EPIC ===

export const searchEpic = (action$: Observable<Action>): Observable<Action> =>
  action$.pipe(
    ofType(setSearchTerm.type),
    debounceTime(400),
    distinctUntilChanged(
      (prev, curr) =>
        (prev as ReturnType<typeof setSearchTerm>).payload ===
        (curr as ReturnType<typeof setSearchTerm>).payload,
    ),
    switchMap((action) => {
      const term = (action as ReturnType<typeof setSearchTerm>).payload;
      return of(setDebouncedSearch(term));
    }),
  );
