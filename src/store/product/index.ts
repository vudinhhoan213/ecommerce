export { default as productReducer } from "./productSlice";
export { clearCurrentProduct, clearProductError } from "./productSlice";
export * from "./productSelectors";
export {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./productThunk";
