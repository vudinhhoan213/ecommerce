import LoginPage from "../pages/login/LoginPage";
import ShopPage from "../pages/shop/ShopPage";
import ProductDetailPage from "../pages/shop/ProductDetailPage";
import CartPage from "../pages/cart/CartPage";
import ProfilePage from "../pages/profile/ProfilePage";
import MainLayout from "../components/layout/MainLayout";
import type { RouteConfig } from "../types";

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
