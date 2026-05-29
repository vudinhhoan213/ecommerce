import { selectCartList, selectTotalItems, selectCartTotals } from "../../../store/cart/cartSelectors";
import type { RootState } from "../../store";

// ===== HELPER: Tạo mock RootState =====
const createMockState = (cartList: any[] = []): RootState =>
  ({
    cart: { cartList },
  } as unknown as RootState);

// ============================================================
// TEST SUITE: cartSelectors
// ============================================================
describe("cartSelectors", () => {
  // ──────────────────────────────────────────────────────────
  // selectCartList
  // ──────────────────────────────────────────────────────────
  describe("selectCartList", () => {
    it("should return empty array when cart is empty", () => {
      const state = createMockState([]);
      expect(selectCartList(state)).toEqual([]);
    });

    it("should return the cartList array", () => {
      const items = [
        { id: 1, quantity: 2, price: 100 },
        { id: 2, quantity: 1, price: 200 },
      ];
      const state = createMockState(items);
      expect(selectCartList(state)).toEqual(items);
    });
  });

  // ──────────────────────────────────────────────────────────
  // selectTotalItems
  // ──────────────────────────────────────────────────────────
  describe("selectTotalItems", () => {
    it("should return 0 for empty cart", () => {
      const state = createMockState([]);
      expect(selectTotalItems(state)).toBe(0);
    });

    it("should sum all quantities", () => {
      const items = [
        { id: 1, quantity: 3, price: 100 },
        { id: 2, quantity: 5, price: 200 },
      ];
      const state = createMockState(items);
      // 3 + 5 = 8
      expect(selectTotalItems(state)).toBe(8);
    });
  });

  // ──────────────────────────────────────────────────────────
  // selectCartTotals (memoized selector)
  // ──────────────────────────────────────────────────────────
  describe("selectCartTotals", () => {
    it("should return zeros for empty cart", () => {
      const state = createMockState([]);
      const result = selectCartTotals(state);

      expect(result.subTotal).toBe(0);
      expect(result.tax).toBe(0);
      expect(result.total).toBe(0);
    });

    it("should calculate subTotal, tax (10%), and total correctly", () => {
      const items = [
        { id: 1, quantity: 2, price: 1000000 }, // 2 * 1,000,000 = 2,000,000
        { id: 2, quantity: 1, price: 500000 },  // 1 * 500,000 = 500,000
      ];
      const state = createMockState(items);
      const result = selectCartTotals(state);

      // subTotal = 2,000,000 + 500,000 = 2,500,000
      expect(result.subTotal).toBe(2500000);
      // tax = Math.round(2,500,000 * 0.1) = 250,000
      expect(result.tax).toBe(250000);
      // total = 2,500,000 + 250,000 = 2,750,000
      expect(result.total).toBe(2750000);
    });

    it("should round tax to nearest integer", () => {
      const items = [{ id: 1, quantity: 1, price: 333 }];
      const state = createMockState(items);
      const result = selectCartTotals(state);

      // tax = Math.round(333 * 0.1) = Math.round(33.3) = 33
      expect(result.tax).toBe(33);
      expect(result.total).toBe(333 + 33);
    });
  });
});
