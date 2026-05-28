import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../../store/cart/cartSlice";
import ProductCard from "./ProductCard";
import type { Product } from "../../types";

// ===== MOCKS =====
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("../../pages/shop/ShopPage.module.css", () =>
  new Proxy({}, { get: (_, key) => key })
);

jest.mock("@ant-design/icons", () => ({
  ShoppingCartOutlined: () => <span data-testid="cart-icon">🛒</span>,
}));

// ===== MOCK DATA =====
const mockProduct: Product = {
  id: 1,
  title: "iPhone 15",
  description: "A great phone",
  price: 25000000,
  rating: 4,
  thumbnail: "iphone-thumb.jpg",
  images: ["iphone1.jpg", "iphone2.jpg"],
  colors: ["black", "white"],
};

const mockFormatVND = (num: number) => `${num.toLocaleString("vi-VN")} VND`;

// ===== HELPER =====
function renderProductCard(props: Partial<React.ComponentProps<typeof ProductCard>> = {}) {
  const store = configureStore({
    reducer: { cart: cartReducer },
    preloadedState: { cart: { cartList: [] } },
  });

  const defaultProps = {
    product: mockProduct,
    formatVND: mockFormatVND,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    isLoading: false,
    ...props,
  };

  const user = userEvent.setup();

  render(
    <Provider store={store}>
      <MemoryRouter>
        <ProductCard {...defaultProps} />
      </MemoryRouter>
    </Provider>
  );

  return { store, user, ...defaultProps };
}

// ============================================================
// TEST SUITE: ProductCard
// ============================================================
describe("ProductCard", () => {
  // ──────────────────────────────────────────────────────────
  // Rendering
  // ──────────────────────────────────────────────────────────
  describe("rendering", () => {
    it("should display product title", () => {
      renderProductCard();
      expect(screen.getByText("iPhone 15")).toBeInTheDocument();
    });

    it("should display formatted price", () => {
      renderProductCard();
      expect(screen.getByText(/25.*000.*000.*VND/)).toBeInTheDocument();
    });

    it("should render product image with alt text", () => {
      renderProductCard();
      const img = screen.getByAltText("iPhone 15");
      expect(img).toHaveAttribute("src", "iphone-thumb.jpg");
    });

    it("should link to product detail page", () => {
      renderProductCard();
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/shop/1");
    });
  });

  // ──────────────────────────────────────────────────────────
  // User interactions
  // ──────────────────────────────────────────────────────────
  describe("interactions", () => {
    it("should call onEdit when edit button is clicked", async () => {
      const { user, onEdit } = renderProductCard();

      const editBtn = screen.getByRole("button", { name: "✎" });
      await user.click(editBtn);

      expect(onEdit).toHaveBeenCalledWith(mockProduct);
      expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it("should call onDelete when delete button is clicked", async () => {
      const { user, onDelete } = renderProductCard();

      const deleteBtn = screen.getByRole("button", { name: "✕" });
      await user.click(deleteBtn);

      expect(onDelete).toHaveBeenCalledWith(1); // product.id = 1
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it("should add product to cart when Add to Cart is clicked", async () => {
      const { store, user } = renderProductCard();

      const addToCartBtn = screen.getByText("productDetail.addToCart");
      await user.click(addToCartBtn);

      const cartState = store.getState().cart;
      expect(cartState.cartList).toHaveLength(1);
      expect(cartState.cartList[0]).toMatchObject({
        id: 1,
        selectedColor: "black", // first color as default
        quantity: 1,
      });
    });

    it("should disable edit/delete buttons when isLoading=true", () => {
      renderProductCard({ isLoading: true });

      const editBtn = screen.getByRole("button", { name: "✎" });
      const deleteBtn = screen.getByRole("button", { name: "✕" });

      expect(editBtn).toBeDisabled();
      expect(deleteBtn).toBeDisabled();
    });
  });
});
