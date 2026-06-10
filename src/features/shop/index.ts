// =============================================
// Public API of Shop feature (React Query version)
// =============================================

// API Layer
export { productApi } from "./api";
export { searchSuggestApi } from "./api";
export type { SuggestResult } from "./api";

// Hooks (chính — components dùng trực tiếp)
export {
  productKeys,
  useProducts,
  useSearchProducts,
  useProductById,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  suggestKeys,
  useSearchSuggest,
} from "./hooks";
