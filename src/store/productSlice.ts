import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../types";
import {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./productThunk";

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: "",
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
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch single product
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = { ...state.products[index], ...action.payload };
        }
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      });
  },
});

// Selectors
export const selectProducts = (state: { product: ProductState }) => state.product.products;
export const selectCurrentProduct = (state: { product: ProductState }) => state.product.currentProduct;
export const selectProductLoading = (state: { product: ProductState }) => state.product.loading;
export const selectProductError = (state: { product: ProductState }) => state.product.error;

export const { clearCurrentProduct, clearProductError } = productSlice.actions;
export default productSlice.reducer;
