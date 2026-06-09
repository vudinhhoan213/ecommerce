// Product Slice
export { default as productReducer } from "./productSlice";
export {
  setSearchTerm,
  setDebouncedSearch,
  fetchProducts,
  fetchProductsSuccess,
  fetchProductsFailed,
  fetchProductById,
  fetchProductByIdSuccess,
  fetchProductByIdFailed,
  createProduct,
  createProductSuccess,
  createProductFailed,
  updateProduct,
  updateProductSuccess,
  updateProductFailed,
  deleteProduct,
  deleteProductSuccess,
  deleteProductFailed,
  clearCurrentProduct,
  clearProductError,
} from "./productSlice";

// Product Selectors
export * from "./productSelectors";

// SearchSuggest Slice
export { default as searchSuggestReducer } from "./searchSuggestSlice";
export {
  searchSuggest,
  searchSuggestSuccess,
  searchSuggestFailed,
  searchSuggestClear,
  selectSuggestResults,
  selectSuggestLoading,
} from "./searchSuggestSlice";
export type { SuggestResult } from "./searchSuggestSlice";

// Epics
export {
  fetchProductsEpic,
  fetchProductByIdEpic,
  createProductEpic,
  searchProductsEpic,
  updateProductEpic,
  deleteProductEpic,
} from "./productEpic";
export { searchEpic } from "./searchEpic";
export { searchSuggestEpic } from "./searchSuggestEpic";
