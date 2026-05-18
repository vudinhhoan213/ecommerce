import { createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../services";
import type { Product } from "../types";

export const fetchProducts = createAsyncThunk<Product[], void>(
  "product/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const data = await productService.getAll();
      return data.products;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return rejectWithValue(message);
    }
  },
);

export const fetchProductById = createAsyncThunk<Product, string | number>(
  "product/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      return await productService.getById(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return rejectWithValue(message);
    }
  },
);

export const createProduct = createAsyncThunk<Product, Partial<Product>>(
  "product/createProduct",
  async (product, { rejectWithValue }) => {
    try {
      return await productService.create(product);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return rejectWithValue(message);
    }
  },
);

export const updateProduct = createAsyncThunk<
  Product,
  { id: number; data: Partial<Product> }
>(
  "product/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await productService.update(id, data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return rejectWithValue(message);
    }
  },
);

export const deleteProduct = createAsyncThunk<number, number>(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await productService.delete(id);
      return id;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return rejectWithValue(message);
    }
  },
);
