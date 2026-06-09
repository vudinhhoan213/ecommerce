import type { RouteConfig } from "../types";

// Lazy imports — pages stay in features
import LoginPage from "../features/auth/pages/LoginPage";
import ShopPage from "../features/shop/pages/ShopPage";
import ProductDetailPage from "../features/shop/pages/ProductDetailPage";
import CartPage from "../features/cart/pages/CartPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import MainLayout from "../layouts/MainLayout";

// Routes xem tự do — không cần đăng nhập
export const publicRoutes: RouteConfig[] = [
  { path: "/login", component: LoginPage, layout: null, category: "Login" },
  { path: "/shop", component: ShopPage, layout: MainLayout, category: "Shop" },
  {
    path: "/shop/:slug",
    component: ProductDetailPage,
    layout: MainLayout,
    category: "Shop / Product",
  },
];

// Routes yêu cầu đăng nhập — redirect về /login nếu chưa auth
export const protectedRoutes: RouteConfig[] = [
  { path: "/cart", component: CartPage, layout: MainLayout, category: "Cart" },
  {
    path: "/profile",
    component: ProfilePage,
    layout: MainLayout,
    category: "My Profile",
  },
];
