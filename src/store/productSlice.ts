import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../types";
import type { RootState } from "./store";
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
  fetchLoading: boolean;
  mutateLoading: boolean;
  error: string;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  fetchLoading: false,
  mutateLoading: false,
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
      .addCase(fetchProducts.pending, (state) => {
        state.fetchLoading = true;
        state.error = "";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.fetchLoading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.fetchLoading = true;
        state.error = "";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
        state.fetchLoading = false;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createProduct.pending, (state) => {
        state.mutateLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.mutateLoading = false;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.mutateLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProduct.pending, (state) => {
        state.mutateLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
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
      .addCase(updateProduct.rejected, (state, action) => {
        state.mutateLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.mutateLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
        state.mutateLoading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.mutateLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectProducts = (state: RootState) => state.product.products;
export const selectCurrentProduct = (state: RootState) =>
  state.product.currentProduct;
export const selectFetchLoading = (state: RootState) =>
  state.product.fetchLoading;
export const selectMutateLoading = (state: RootState) =>
  state.product.mutateLoading;
export const selectProductError = (state: RootState) => state.product.error;

export const { clearCurrentProduct, clearProductError } = productSlice.actions;
export default productSlice.reducer;
