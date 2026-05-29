import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../../../store/cart/cartSlice";
import CartPage from "../../../pages/cart/CartPage";

// ===== MOCK: i18next =====
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: any) => {
      if (opts?.count !== undefined) return `${key}:${opts.count}`;
      return key;
    },
  }),
}));

// ===== MOCK: CSS module =====
jest.mock("./CartPage.module.css", () => new Proxy({}, { get: (_, key) => key }));

// ===== MOCK DATA =====
const mockCartItem = {
  id: 1,
  title: "iPhone 15",
  description: "Latest iPhone",
  price: 1000000,
  thumbnail: "iphone.jpg",
  image: "iphone.jpg",
  images: ["iphone.jpg"],
  rating: 4.5,
  colors: ["black"],
  selectedColor: "black",
  quantity: 2,
};

// ===== HELPER =====
function renderCartPage(cartList: any[] = [mockCartItem]) {
  const store = configureStore({
    reducer: { cart: cartReducer },
    preloadedState: { cart: { cartList } },
  });

  const user = userEvent.setup();

  render(
    <Provider store={store}>
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    </Provider>
  );

  return { store, user };
}

// ============================================================
// TEST SUITE: CartPage
// ============================================================
describe("CartPage", () => {
  // ──────────────────────────────────────────────────────────
  // Rendering tests
  // ──────────────────────────────────────────────────────────
  describe("rendering", () => {
    it("should show empty message when cart is empty", () => {
      renderCartPage([]);
      expect(screen.getByText("cart.empty")).toBeInTheDocument();
    });

    it("should display product title", () => {
      renderCartPage();
      expect(screen.getByText(/iPhone 15/)).toBeInTheDocument();
    });

    it("should display product description", () => {
      renderCartPage();
      expect(screen.getByText("Latest iPhone")).toBeInTheDocument();
    });

    it("should display item count", () => {
      renderCartPage();
      // totalItems = quantity = 2
      expect(screen.getByText("cart.itemCount:2")).toBeInTheDocument();
    });

    it("should display product image", () => {
      renderCartPage();
      const img = screen.getByAltText("iPhone 15");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "iphone.jpg");
    });
  });

  // ──────────────────────────────────────────────────────────
  // User interaction tests
  // ──────────────────────────────────────────────────────────
  describe("user interactions", () => {
    it("should increase quantity when clicking + button", async () => {
      const { store, user } = renderCartPage();

      const plusBtn = screen.getByRole("button", { name: "+" });
      await user.click(plusBtn);

      expect(store.getState().cart.cartList[0].quantity).toBe(3);
    });

    it("should decrease quantity when clicking - button", async () => {
      const { store, user } = renderCartPage();

      const minusBtn = screen.getByRole("button", { name: "-" });
      await user.click(minusBtn);

      expect(store.getState().cart.cartList[0].quantity).toBe(1);
    });

    it("should remove item when clicking ✕ button", async () => {
      const { store, user } = renderCartPage();

      const removeBtn = screen.getByRole("button", { name: "✕" });
      await user.click(removeBtn);

      expect(store.getState().cart.cartList).toHaveLength(0);
      expect(screen.getByText("cart.empty")).toBeInTheDocument();
    });

    it("should remove item when quantity decreases below 1", async () => {
      const itemQty1 = { ...mockCartItem, quantity: 1 };
      const { store, user } = renderCartPage([itemQty1]);

      const minusBtn = screen.getByRole("button", { name: "-" });
      await user.click(minusBtn);

      // quantity 1 - 1 = 0 → reducer xoá item
      expect(store.getState().cart.cartList).toHaveLength(0);
    });

    it("should increase quantity multiple times", async () => {
      const { store, user } = renderCartPage();

      const plusBtn = screen.getByRole("button", { name: "+" });
      await user.click(plusBtn);
      await user.click(plusBtn);
      await user.click(plusBtn);

      // 2 + 3 clicks = 5
      expect(store.getState().cart.cartList[0].quantity).toBe(5);
    });
  });

  // ──────────────────────────────────────────────────────────
  // Multiple items tests
  // ──────────────────────────────────────────────────────────
  describe("multiple items", () => {
    it("should display all items in cart", () => {
      const items = [
        mockCartItem,
        { ...mockCartItem, id: 2, title: "Galaxy S24", selectedColor: "blue", quantity: 1 },
      ];

      renderCartPage(items);

      expect(screen.getByText(/iPhone 15/)).toBeInTheDocument();
      expect(screen.getByText(/Galaxy S24/)).toBeInTheDocument();
    });

    it("should show combined total items count", () => {
      const items = [
        { ...mockCartItem, quantity: 3 },
        { ...mockCartItem, id: 2, title: "Galaxy", selectedColor: "blue", quantity: 4 },
      ];

      renderCartPage(items);

      // totalItems = 3 + 4 = 7
      expect(screen.getByText("cart.itemCount:7")).toBeInTheDocument();
    });
  });
});
