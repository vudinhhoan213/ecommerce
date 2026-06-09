import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../../types";

// =============================================
// STATE
// =============================================

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  fetchLoading: boolean;
  mutateLoading: boolean;
  error: string;
  searchTerm: string;
  debouncedSearch: string;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  fetchLoading: false,
  mutateLoading: false,
  error: "",
  searchTerm: "",
  debouncedSearch: "",
};

// =============================================
// SLICE
// =============================================

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // --- SEARCH ---
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setDebouncedSearch: (state, action: PayloadAction<string>) => {
      state.debouncedSearch = action.payload;
    },

    // --- FETCH PRODUCTS ---
    fetchProducts: (state) => {},
    fetchProductsSuccess: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.fetchLoading = false;
    },
    fetchProductsFailed: (state, action: PayloadAction<string>) => {
      state.fetchLoading = false;
      state.error = action.payload;
    },

    // --- FETCH PRODUCT BY ID ---
    fetchProductById: (state, _action: PayloadAction<string | number>) => {
      state.fetchLoading = true;
      state.error = "";
    },
    fetchProductByIdSuccess: (state, action: PayloadAction<Product>) => {
      state.currentProduct = action.payload;
      state.fetchLoading = false;
    },
    fetchProductByIdFailed: (state, action: PayloadAction<string>) => {
      state.fetchLoading = false;
      state.error = action.payload;
    },

    // --- CREATE PRODUCT ---
    createProduct: (state, _action: PayloadAction<Partial<Product>>) => {
      state.mutateLoading = true;
    },
    createProductSuccess: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
      state.mutateLoading = false;
    },
    createProductFailed: (state, action: PayloadAction<string>) => {
      state.mutateLoading = false;
      state.error = action.payload;
    },

    // --- UPDATE PRODUCT ---
    updateProduct: (
      state,
      action: PayloadAction<{ id: number; data: Partial<Product> }>,
    ) => {
      state.mutateLoading = true;
    },
    updateProductSuccess: (state, action: PayloadAction<Product>) => {
      const updated = action.payload;
      const index = state.products.findIndex((p) => p.id === updated.id);
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...updated };
      }
      if (state.currentProduct?.id === updated.id) {
        state.currentProduct = { ...state.currentProduct, ...updated };
      }
      state.mutateLoading = false;
    },
    updateProductFailed: (state, action: PayloadAction<string>) => {
      state.mutateLoading = false;
      state.error = action.payload;
    },

    // --- DELETE PRODUCT ---
    deleteProduct: (state, _action: PayloadAction<number>) => {
      state.mutateLoading = true;
    },
    deleteProductSuccess: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
      state.mutateLoading = false;
    },
    deleteProductFailed: (state, action: PayloadAction<string>) => {
      state.mutateLoading = false;
      state.error = action.payload;
    },

    // --- UTILITIES ---
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearProductError: (state) => {
      state.error = "";
    },
  },
});

export const {
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
} = productSlice.actions;

export const productReducer = productSlice.reducer;
export default productSlice.reducer;
