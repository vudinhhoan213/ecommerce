// src/routes/index.js
import LoginPage from "../pages/login/LoginPage";
import ShopPage from "../pages/shop/ShopPage";
import ProductDetailPage from "../pages/shop/ProductDetailPage";
import CartPage from "../pages/cart/CartPage";
import ProfilePage from "../pages/profile/ProfilePage";
import MainLayout from "../components/layout/MainLayout";

export const publicRoutes = [
  {
    path: "/",
    component: LoginPage,
    layout: null,
    category: "Login",
  },
  {
    path: "/shop",
    component: ShopPage,
    layout: MainLayout,
    category: "Shop",
  },
  {
    path: "/shop/:productId",
    component: ProductDetailPage,
    layout: MainLayout,
    category: "Shop / Product",
  },
  {
    path: "/cart",
    component: CartPage,
    layout: MainLayout,
    category: "Cart",
  },
  {
    path: "/profile",
    component: ProfilePage,
    layout: MainLayout,
    category: "My Profile",
  },
];

export const privateRoutes = [];
