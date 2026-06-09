import type { RootState } from "../../../lib/store";

export const selectProducts = (state: RootState) => state.product.products;

export const selectCurrentProduct = (state: RootState) =>
  state.product.currentProduct;

export const selectFetchLoading = (state: RootState) =>
  state.product.fetchLoading;

export const selectMutateLoading = (state: RootState) =>
  state.product.mutateLoading;

export const selectProductError = (state: RootState) => state.product.error;

export const selectSearchTerm = (state: RootState) => state.product.searchTerm;

export const selectDebouncedSearch = (state: RootState) =>
  state.product.debouncedSearch;
