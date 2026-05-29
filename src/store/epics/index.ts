export { default as rootEpic } from "./rootEpic";
export { searchEpic } from "./searchEpic";
export { cartBatchEpic } from "./cartEpic";
export { searchSuggestEpic } from "./searchSuggestEpic";
export { initAuthEpic, appInit } from "./initAuthEpic";

// Re-export actions from slices (for backward compatibility)
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
} from "../product/productSlice";

export {
  fetchUserProfile,
  fetchUserProfileSuccess,
  fetchUserProfileFailed,
  loginUser,
  loginUserSuccess,
  loginUserFailed,
} from "../auth/authSlice";

export {
  searchSuggest,
  searchSuggestSuccess,
  searchSuggestFailed,
  searchSuggestClear,
} from "../product/searchSuggestSlice";

export { cartBatchNotified } from "../cart/cartSlice";
