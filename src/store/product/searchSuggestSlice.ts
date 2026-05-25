import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import {
  searchSuggest,
  searchSuggestSuccess,
  searchSuggestFailed,
  searchSuggestClear,
  type SuggestResult,
} from "../epics/searchSuggestEpic";

interface SearchSuggestState {
  results: SuggestResult[];
  loading: boolean;
  error: string;
}

const initialState: SearchSuggestState = {
  results: [],
  loading: false,
  error: "",
};

const searchSuggestSlice = createSlice({
  name: "searchSuggest",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchSuggest, (state, action) => {
        if (action.payload.trim()) {
          state.loading = true;
          state.error = "";
        }
      })
      .addCase(searchSuggestSuccess, (state, action) => {
        state.results = action.payload;
        state.loading = false;
      })
      .addCase(searchSuggestFailed, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchSuggestClear, (state) => {
        state.results = [];
        state.loading = false;
        state.error = "";
      });
  },
});

// Selectors
export const selectSuggestResults = (state: RootState) =>
  state.searchSuggest.results;
export const selectSuggestLoading = (state: RootState) =>
  state.searchSuggest.loading;

export default searchSuggestSlice.reducer;
