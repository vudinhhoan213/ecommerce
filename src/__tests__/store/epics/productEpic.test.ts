import { of, throwError } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  fetchProductsEpic,
  fetchProductByIdEpic,
  createProductEpic,
  updateProductEpic,
  deleteProductEpic,
} from "../../../store/epics/productEpic";
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
} from "../../../store/product/productSlice";
import type { Product } from "../../../types";

// ===== MOCK rxjs/ajax =====
jest.mock("rxjs/ajax", () => ({
  ajax: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedAjax = ajax as jest.Mocked<typeof ajax>;

// ===== MOCK DATA =====
const mockProduct: Product = {
  id: 1,
  title: "iPhone 15",
  description: "A phone",
  price: 25000000,
  rating: 4.5,
  thumbnail: "thumb.jpg",
  images: ["img1.jpg"],
  colors: ["black"],
};

// ============================================================
// TEST SUITE: productEpic
// ============================================================
describe("productEpic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => "fake-token");
  });

  // ──────────────────────────────────────────────────────────
  // fetchProductsEpic
  // ──────────────────────────────────────────────────────────
  describe("fetchProductsEpic", () => {
    it("should emit fetchProductsSuccess with products array", (done) => {
      (mockedAjax.get as jest.Mock).mockReturnValue(
        of({ response: { products: [mockProduct] } })
      );

      const action$ = of(fetchProducts());

      fetchProductsEpic(action$ as any).subscribe((output) => {
        expect(output.type).toBe(fetchProductsSuccess.type);
        expect((output as any).payload).toEqual([mockProduct]);
        done();
      });
    });

    it("should emit fetchProductsFailed on error", (done) => {
      (mockedAjax.get as jest.Mock).mockReturnValue(
        throwError(() => new Error("Server down"))
      );

      const action$ = of(fetchProducts());

      fetchProductsEpic(action$ as any).subscribe((output) => {
        expect(output.type).toBe(fetchProductsFailed.type);
        expect((output as any).payload).toBe("Server down");
        done();
      });
    });
  });

  // ──────────────────────────────────────────────────────────
  // fetchProductByIdEpic
  // ──────────────────────────────────────────────────────────
  describe("fetchProductByIdEpic", () => {
    it("should emit fetchProductByIdSuccess with product data", (done) => {
      (mockedAjax.get as jest.Mock).mockReturnValue(
        of({ response: mockProduct })
      );

      const action$ = of(fetchProductById(1));

      fetchProductByIdEpic(action$ as any).subscribe((output) => {
        expect(output.type).toBe(fetchProductByIdSuccess.type);
        expect((output as any).payload).toEqual(mockProduct);
        done();
      });
    });

    it("should emit fetchProductByIdFailed on error", (done) => {
      (mockedAjax.get as jest.Mock).mockReturnValue(
        throwError(() => new Error("Not found"))
      );

      const action$ = of(fetchProductById(999));

      fetchProductByIdEpic(action$ as any).subscribe((output) => {
        expect(output.type).toBe(fetchProductByIdFailed.type);
        expect((output as any).payload).toBe("Not found");
        done();
      });
    });
  });

  // ──────────────────────────────────────────────────────────
  // createProductEpic
  // ──────────────────────────────────────────────────────────
  describe("createProductEpic", () => {
    it("should emit createProductSuccess with created product", (done) => {
      (mockedAjax.post as jest.Mock).mockReturnValue(
        of({ response: mockProduct })
      );

      const action$ = of(createProduct({ title: "iPhone 15", price: 25000000 }));

      createProductEpic(action$ as any).subscribe((output) => {
        expect(output.type).toBe(createProductSuccess.type);
        expect((output as any).payload).toEqual(mockProduct);
        done();
      });
    });

    it("should emit createProductFailed on error", (done) => {
      (mockedAjax.post as jest.Mock).mockReturnValue(
        throwError(() => new Error("Validation error"))
      );

      const action$ = of(createProduct({ title: "" }));

      createProductEpic(action$ as any).subscribe((output) => {
        expect(output.type).toBe(createProductFailed.type);
        expect((output as any).payload).toBe("Validation error");
        done();
      });
    });
  });

  // ──────────────────────────────────────────────────────────
  // updateProductEpic
  // ──────────────────────────────────────────────────────────
  describe("updateProductEpic", () => {
    it("should emit updateProductSuccess with updated product", (done) => {
      const updatedProduct = { ...mockProduct, title: "iPhone 16" };
      (mockedAjax.put as jest.Mock).mockReturnValue(
        of({ response: updatedProduct })
      );

      const action$ = of(updateProduct({ id: 1, data: { title: "iPhone 16" } }));

      updateProductEpic(action$ as any).subscribe((output) => {
        expect(output.type).toBe(updateProductSuccess.type);
        expect((output as any).payload.title).toBe("iPhone 16");
        done();
      });
    });

    it("should emit updateProductFailed on error", (done) => {
      (mockedAjax.put as jest.Mock).mockReturnValue(
        throwError(() => new Error("Forbidden"))
      );

      const action$ = of(updateProduct({ id: 1, data: { title: "X" } }));

      updateProductEpic(action$ as any).subscribe((output) => {
        expect(output.type).toBe(updateProductFailed.type);
        expect((output as any).payload).toBe("Forbidden");
        done();
      });
    });
  });

  // ──────────────────────────────────────────────────────────
  // deleteProductEpic
  // ──────────────────────────────────────────────────────────
  describe("deleteProductEpic", () => {
    it("should emit deleteProductSuccess with product id", (done) => {
      (mockedAjax.delete as jest.Mock).mockReturnValue(
        of({ response: mockProduct })
      );

      const action$ = of(deleteProduct(1));

      deleteProductEpic(action$ as any).subscribe((output) => {
        expect(output.type).toBe(deleteProductSuccess.type);
        expect((output as any).payload).toBe(1);
        done();
      });
    });

    it("should emit deleteProductFailed on error", (done) => {
      (mockedAjax.delete as jest.Mock).mockReturnValue(
        throwError(() => new Error("Cannot delete"))
      );

      const action$ = of(deleteProduct(1));

      deleteProductEpic(action$ as any).subscribe((output) => {
        expect(output.type).toBe(deleteProductFailed.type);
        expect((output as any).payload).toBe("Cannot delete");
        done();
      });
    });
  });
});
