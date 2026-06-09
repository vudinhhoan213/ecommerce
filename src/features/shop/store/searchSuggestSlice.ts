import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../lib/store";

// =============================================
// TYPES
// =============================================

export interface SuggestResult {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
}

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

// =============================================
// SLICE
// =============================================

const searchSuggestSlice = createSlice({
  name: "searchSuggest",
  initialState,
  reducers: {
    searchSuggest: (state, action: PayloadAction<string>) => {
      if (action.payload.trim()) {
        state.loading = true;
        state.error = "";
      }
    },
    searchSuggestSuccess: (state, action: PayloadAction<SuggestResult[]>) => {
      state.results = action.payload;
      state.loading = false;
    },
    searchSuggestFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    searchSuggestClear: (state) => {
      state.results = [];
      state.loading = false;
      state.error = "";
    },
  },
});

export const {
  searchSuggest,
  searchSuggestSuccess,
  searchSuggestFailed,
  searchSuggestClear,
} = searchSuggestSlice.actions;

// Selectors
export const selectSuggestResults = (state: RootState) =>
  state.searchSuggest.results;
export const selectSuggestLoading = (state: RootState) =>
  state.searchSuggest.loading;

export const searchSuggestReducer = searchSuggestSlice.reducer;
export default searchSuggestSlice.reducer;
