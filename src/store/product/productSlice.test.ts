import productReducer, {
  clearCurrentProduct,
  clearProductError,
} from "./productSlice";
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
import { setSearchTerm, setDebouncedSearch } from "../epics/searchEpic";
import type { Product } from "../../types";

// ===== MOCK DATA =====
const mockProduct: Product = {
  id: 1,
  title: "iPhone 15",
  description: "A great phone",
  price: 25000000,
  rating: 4.5,
  thumbnail: "thumb.jpg",
  images: ["img1.jpg"],
  colors: ["black"],
};

const mockProduct2: Product = {
  id: 2,
  title: "Galaxy S24",
  description: "Samsung flagship",
  price: 22000000,
  rating: 4.3,
  thumbnail: "galaxy.jpg",
  images: ["galaxy1.jpg"],
  colors: ["blue"],
};

const initialState = {
  products: [],
  currentProduct: null,
  fetchLoading: false,
  mutateLoading: false,
  error: "",
  searchTerm: "",
  debouncedSearch: "",
};

// ============================================================
// TEST SUITE: productSlice
// ============================================================
describe("productSlice", () => {
  // ──────────────────────────────────────────────────────────
  // Local reducers
  // ──────────────────────────────────────────────────────────
  describe("local reducers", () => {
    it("clearCurrentProduct should set currentProduct to null", () => {
      const stateWithProduct = { ...initialState, currentProduct: mockProduct };
      const state = productReducer(stateWithProduct, clearCurrentProduct());
      expect(state.currentProduct).toBeNull();
    });

    it("clearProductError should set error to empty string", () => {
      const stateWithError = { ...initialState, error: "Something went wrong" };
      const state = productReducer(stateWithError, clearProductError());
      expect(state.error).toBe("");
    });
  });

  // ──────────────────────────────────────────────────────────
  // Search actions (from searchEpic)
  // ──────────────────────────────────────────────────────────
  describe("search actions", () => {
    it("setSearchTerm should update searchTerm", () => {
      const state = productReducer(initialState, setSearchTerm("iphone"));
      expect(state.searchTerm).toBe("iphone");
    });

    it("setDebouncedSearch should update debouncedSearch", () => {
      const state = productReducer(initialState, setDebouncedSearch("galaxy"));
      expect(state.debouncedSearch).toBe("galaxy");
    });
  });

  // ──────────────────────────────────────────────────────────
  // fetchProducts flow
  // ──────────────────────────────────────────────────────────
  describe("fetchProducts", () => {
    it("should set fetchLoading=true on fetchProducts", () => {
      const state = productReducer(initialState, fetchProducts());
      expect(state.fetchLoading).toBe(true);
      expect(state.error).toBe("");
    });

    it("should set products on fetchProductsSuccess", () => {
      const loadingState = { ...initialState, fetchLoading: true };
      const state = productReducer(
        loadingState,
        fetchProductsSuccess([mockProduct, mockProduct2])
      );
      expect(state.products).toHaveLength(2);
      expect(state.fetchLoading).toBe(false);
    });

    it("should set error on fetchProductsFailed", () => {
      const loadingState = { ...initialState, fetchLoading: true };
      const state = productReducer(
        loadingState,
        fetchProductsFailed("Network error")
      );
      expect(state.error).toBe("Network error");
      expect(state.fetchLoading).toBe(false);
    });
  });

  // ──────────────────────────────────────────────────────────
  // fetchProductById flow
  // ──────────────────────────────────────────────────────────
  describe("fetchProductById", () => {
    it("should set fetchLoading=true on fetchProductById", () => {
      const state = productReducer(initialState, fetchProductById(1));
      expect(state.fetchLoading).toBe(true);
    });

    it("should set currentProduct on success", () => {
      const state = productReducer(
        initialState,
        fetchProductByIdSuccess(mockProduct)
      );
      expect(state.currentProduct).toEqual(mockProduct);
      expect(state.fetchLoading).toBe(false);
    });

    it("should set error on failure", () => {
      const state = productReducer(
        initialState,
        fetchProductByIdFailed("Not found")
      );
      expect(state.error).toBe("Not found");
    });
  });

  // ──────────────────────────────────────────────────────────
  // createProduct flow
  // ──────────────────────────────────────────────────────────
  describe("createProduct", () => {
    it("should set mutateLoading=true on createProduct", () => {
      const state = productReducer(initialState, createProduct(mockProduct));
      expect(state.mutateLoading).toBe(true);
    });

    it("should push new product on createProductSuccess", () => {
      const stateWithProducts = { ...initialState, products: [mockProduct] };
      const state = productReducer(
        stateWithProducts,
        createProductSuccess(mockProduct2)
      );
      expect(state.products).toHaveLength(2);
      expect(state.products[1]).toEqual(mockProduct2);
      expect(state.mutateLoading).toBe(false);
    });

    it("should set error on createProductFailed", () => {
      const state = productReducer(
        initialState,
        createProductFailed("Server error")
      );
      expect(state.error).toBe("Server error");
      expect(state.mutateLoading).toBe(false);
    });
  });

  // ──────────────────────────────────────────────────────────
  // updateProduct flow
  // ──────────────────────────────────────────────────────────
  describe("updateProduct", () => {
    it("should set mutateLoading=true on updateProduct", () => {
      const state = productReducer(
        initialState,
        updateProduct({ id: 1, data: { title: "Updated" } })
      );
      expect(state.mutateLoading).toBe(true);
    });

    it("should update product in array on success", () => {
      const stateWithProducts = {
        ...initialState,
        products: [mockProduct, mockProduct2],
      };
      const updatedProduct = { ...mockProduct, title: "iPhone 16" };

      const state = productReducer(
        stateWithProducts,
        updateProductSuccess(updatedProduct)
      );

      expect(state.products[0].title).toBe("iPhone 16");
      expect(state.products[1]).toEqual(mockProduct2); // unchanged
      expect(state.mutateLoading).toBe(false);
    });

    it("should set error on updateProductFailed", () => {
      const state = productReducer(
        initialState,
        updateProductFailed("Forbidden")
      );
      expect(state.error).toBe("Forbidden");
    });
  });

  // ──────────────────────────────────────────────────────────
  // deleteProduct flow
  // ──────────────────────────────────────────────────────────
  describe("deleteProduct", () => {
    it("should set mutateLoading=true on deleteProduct", () => {
      const state = productReducer(initialState, deleteProduct(1));
      expect(state.mutateLoading).toBe(true);
    });

    it("should remove product from array on success", () => {
      const stateWithProducts = {
        ...initialState,
        products: [mockProduct, mockProduct2],
      };

      const state = productReducer(stateWithProducts, deleteProductSuccess(1));

      expect(state.products).toHaveLength(1);
      expect(state.products[0].id).toBe(2);
      expect(state.mutateLoading).toBe(false);
    });

    it("should set error on deleteProductFailed", () => {
      const state = productReducer(
        initialState,
        deleteProductFailed("Cannot delete")
      );
      expect(state.error).toBe("Cannot delete");
    });
  });
});
