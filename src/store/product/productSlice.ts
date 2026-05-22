import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../../types";
import { setSearchTerm, setDebouncedSearch } from "../epics/searchEpic";
import {
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
} from "../epics/productEpic";

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

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearProductError: (state) => {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Search epic
      .addCase(setSearchTerm, (state, action) => {
        state.searchTerm = action.payload;
      })
      .addCase(setDebouncedSearch, (state, action) => {
        state.debouncedSearch = action.payload;
      })
      // Fetch products
      .addCase(fetchProducts, (state) => {
        state.fetchLoading = true;
        state.error = "";
      })
      .addCase(fetchProductsSuccess, (state, action) => {
        state.products = action.payload;
        state.fetchLoading = false;
      })
      .addCase(fetchProductsFailed, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload;
      })
      // Fetch product by id
      .addCase(fetchProductById, (state) => {
        state.fetchLoading = true;
        state.error = "";
      })
      .addCase(fetchProductByIdSuccess, (state, action) => {
        state.currentProduct = action.payload;
        state.fetchLoading = false;
      })
      .addCase(fetchProductByIdFailed, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createProduct, (state) => {
        state.mutateLoading = true;
      })
      .addCase(createProductSuccess, (state, action) => {
        state.products.push(action.payload);
        state.mutateLoading = false;
      })
      .addCase(createProductFailed, (state, action) => {
        state.mutateLoading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateProduct, (state) => {
        state.mutateLoading = true;
      })
      .addCase(updateProductSuccess, (state, action) => {
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) {
          state.products[index] = {
            ...state.products[index],
            ...action.payload,
          };
        }
        state.mutateLoading = false;
      })
      .addCase(updateProductFailed, (state, action) => {
        state.mutateLoading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteProduct, (state) => {
        state.mutateLoading = true;
      })
      .addCase(deleteProductSuccess, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
        state.mutateLoading = false;
      })
      .addCase(deleteProductFailed, (state, action) => {
        state.mutateLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentProduct, clearProductError } = productSlice.actions;
export default productSlice.reducer;
