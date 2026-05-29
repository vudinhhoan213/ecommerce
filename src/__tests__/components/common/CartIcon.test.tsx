import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../../../store/cart/cartSlice";
import CartIcon from "../../../components/common/CartIcon";

// ===== HELPER: Render component với Redux + Router =====
function renderCartIcon(cartList: any[] = []) {
  const store = configureStore({
    reducer: { cart: cartReducer },
    preloadedState: { cart: { cartList } },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <CartIcon />
      </MemoryRouter>
    </Provider>
  );
}

// ===== MOCK: CSS module =====
jest.mock("./CartIcon.module.css", () => ({
  cartWrapper: "cartWrapper",
  cartIcon: "cartIcon",
  badge: "badge",
}));

// ============================================================
// TEST SUITE: CartIcon component
// ============================================================
describe("CartIcon", () => {
  it("should render a link navigating to /cart", () => {
    renderCartIcon();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/cart");
  });

  it("should render cart image with alt text", () => {
    renderCartIcon();

    const img = screen.getByAltText("Shopping Cart");
    expect(img).toBeInTheDocument();
  });

  it("should NOT display badge when cart is empty", () => {
    renderCartIcon([]);

    // Không có text nào là số
    const badge = screen.queryByText(/^\d+$/);
    expect(badge).not.toBeInTheDocument();
  });

  it("should display badge with total quantity when cart has items", () => {
    const cartList = [
      { id: 1, price: 100, selectedColor: "red", quantity: 3 },
      { id: 2, price: 200, selectedColor: "blue", quantity: 2 },
    ];

    renderCartIcon(cartList);

    // Total items = 3 + 2 = 5
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should show correct count with single item", () => {
    const cartList = [
      { id: 1, price: 100, selectedColor: "black", quantity: 7 },
    ];

    renderCartIcon(cartList);

    expect(screen.getByText("7")).toBeInTheDocument();
  });
});
