import cartReducer, {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "./cartSlice";
import type { CartState } from "../../types";
import type { Product } from "../../types";

// ===== MOCK DATA =====
const mockProduct: Product = {
  id: 1,
  title: "iPhone 15 Pro",
  description: "Latest Apple phone",
  price: 25000000,
  rating: 4.5,
  thumbnail: "iphone.jpg",
  images: ["iphone1.jpg", "iphone2.jpg"],
  colors: ["black", "white"],
};

const initialState: CartState = {
  cartList: [],
};

// ============================================================
// TEST SUITE: cartSlice reducers
// ============================================================
describe("cartSlice", () => {
  // ──────────────────────────────────────────────────────────
  // addToCart
  // ──────────────────────────────────────────────────────────
  describe("addToCart", () => {
    it("should add a new product to empty cart", () => {
      const state = cartReducer(
        initialState,
        addToCart({ product: mockProduct, color: "black" })
      );

      expect(state.cartList).toHaveLength(1);
      expect(state.cartList[0]).toMatchObject({
        id: 1,
        title: "iPhone 15 Pro",
        selectedColor: "black",
        quantity: 1,
      });
    });

    it("should increase quantity when same product + same color is added", () => {
      const stateWithItem: CartState = {
        cartList: [{ ...mockProduct, selectedColor: "black", quantity: 1 }],
      };

      const state = cartReducer(
        stateWithItem,
        addToCart({ product: mockProduct, color: "black" })
      );

      expect(state.cartList).toHaveLength(1);
      expect(state.cartList[0].quantity).toBe(2);
    });

    it("should add as separate item when same product but different color", () => {
      const stateWithItem: CartState = {
        cartList: [{ ...mockProduct, selectedColor: "black", quantity: 1 }],
      };

      const state = cartReducer(
        stateWithItem,
        addToCart({ product: mockProduct, color: "white" })
      );

      expect(state.cartList).toHaveLength(2);
      expect(state.cartList[1].selectedColor).toBe("white");
    });
  });

  // ──────────────────────────────────────────────────────────
  // updateQuantity
  // ──────────────────────────────────────────────────────────
  describe("updateQuantity", () => {
    it("should update quantity to new value", () => {
      const stateWithItem: CartState = {
        cartList: [{ ...mockProduct, selectedColor: "black", quantity: 2 }],
      };

      const state = cartReducer(
        stateWithItem,
        updateQuantity({ productId: 1, color: "black", newQuantity: 5 })
      );

      expect(state.cartList[0].quantity).toBe(5);
    });

    it("should remove item when newQuantity < 1", () => {
      const stateWithItem: CartState = {
        cartList: [{ ...mockProduct, selectedColor: "black", quantity: 1 }],
      };

      const state = cartReducer(
        stateWithItem,
        updateQuantity({ productId: 1, color: "black", newQuantity: 0 })
      );

      expect(state.cartList).toHaveLength(0);
    });

    it("should do nothing if product not found", () => {
      const stateWithItem: CartState = {
        cartList: [{ ...mockProduct, selectedColor: "black", quantity: 2 }],
      };

      const state = cartReducer(
        stateWithItem,
        updateQuantity({ productId: 999, color: "black", newQuantity: 5 })
      );

      expect(state.cartList[0].quantity).toBe(2); // unchanged
    });
  });

  // ──────────────────────────────────────────────────────────
  // removeFromCart
  // ──────────────────────────────────────────────────────────
  describe("removeFromCart", () => {
    it("should remove the correct item by id + color", () => {
      const stateWith2Items: CartState = {
        cartList: [
          { ...mockProduct, selectedColor: "black", quantity: 2 },
          { ...mockProduct, id: 2, title: "Galaxy S24", selectedColor: "blue", quantity: 1 },
        ],
      };

      const state = cartReducer(
        stateWith2Items,
        removeFromCart({ productId: 1, color: "black" })
      );

      expect(state.cartList).toHaveLength(1);
      expect(state.cartList[0].id).toBe(2);
    });

    it("should not remove if color does not match", () => {
      const stateWithItem: CartState = {
        cartList: [{ ...mockProduct, selectedColor: "black", quantity: 1 }],
      };

      const state = cartReducer(
        stateWithItem,
        removeFromCart({ productId: 1, color: "white" })
      );

      expect(state.cartList).toHaveLength(1); // not removed
    });
  });

  // ──────────────────────────────────────────────────────────
  // clearCart
  // ──────────────────────────────────────────────────────────
  describe("clearCart", () => {
    it("should remove all items from cart", () => {
      const stateWithItems: CartState = {
        cartList: [
          { ...mockProduct, selectedColor: "black", quantity: 2 },
          { ...mockProduct, id: 2, title: "Galaxy S24", selectedColor: "blue", quantity: 3 },
        ],
      };

      const state = cartReducer(stateWithItems, clearCart());

      expect(state.cartList).toHaveLength(0);
    });

    it("should handle clearing already empty cart", () => {
      const state = cartReducer(initialState, clearCart());

      expect(state.cartList).toHaveLength(0);
    });
  });
});
