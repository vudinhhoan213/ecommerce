# Routing Architecture

## 1. Purpose

Tai lieu nay mo ta kien truc routing hien tai cua frontend E-Commerce SPA. Muc tieu la ghi lai route co bang chung trong source code, cach route duoc bao ve, cach navigation hoat dong va cac van de can xu ly khi dung lai he thong.

Pham vi tai lieu:

- Chi phan tich frontend routing trong repository hien tai.
- Dong bo voi `docs/product/feature-list.md`, `docs/product/business-rules.md`, `docs/product/roles.md`, `docs/product/user-flows.md` va `docs/architecture/frontend-overview.md`.
- Khong mo ta backend, database, API server noi bo hoac route chua ton tai nhu implementation hien tai.

Gioi han quan trong:

- Project hien chi co frontend React SPA.
- Source hien tai chua co backend server, database, server-side authentication hoac server-side authorization.
- Source hien tai chua co Admin route, Customer order route, checkout route, payment route, review route hoac not-found page rieng.
- Source hien tai chi guard theo `isAuthenticated`, chua phan biet `Customer` va `Admin`.

## 2. Router Technology

| Noi dung | Hien trang | Source |
| -------- | ---------- | ------ |
| Routing library | `react-router-dom` | `package.json` |
| Version | `^7.15.0` | `package.json` |
| Router initialization | `BrowserRouter` | `src/App.tsx` |
| Route primitives | `Routes`, `Route`, `Navigate` | `src/App.tsx` |
| Data router | Khong dung `RouterProvider` hoac `createBrowserRouter` | `src/App.tsx` |
| Route config | `publicRoutes`, `protectedRoutes` | `src/config/routes.ts` |
| Lazy loading | Khong co `React.lazy`; comment "Lazy imports" trong `routes.ts` khong phan anh implementation hien tai | `src/config/routes.ts` |
| Suspense | Khong co | Source search |

Router duoc khoi tao trong `src/App.tsx`, khong phai trong `src/index.tsx`. `src/index.tsx` mount cac provider ung dung va render `<App />`; `App` moi la noi mount `BrowserRouter`.

## 3. Router Setup

Provider hierarchy tai entry point:

1. `Provider` tu `react-redux`
   - Cung cap Redux store.
2. `PersistGate`
   - Rehydrate persisted Redux state.
3. `QueryClientProvider`
   - Cung cap React Query client.
4. `TextMbProvider`
   - Cung cap typography/theme context rieng.
5. `App`
   - Mount `ErrorBoundary`, `BrowserRouter`, routes va dispatch `appInit`.
6. `ReactQueryDevtools`
   - Mount trong `QueryClientProvider`, `initialIsOpen={false}`.

Router setup trong `src/App.tsx`:

- `ErrorBoundary` boc quanh `BrowserRouter`.
- `BrowserRouter` boc quanh `Routes`.
- Public routes duoc map tu `publicRoutes`.
- Protected routes duoc boc boi route cha `element={<AuthMiddleware />}`.
- Unknown route `*` redirect ve `/shop`.

Auth initialization:

- `App` dispatch `appInit()` trong `useEffect`.
- `initAuthEpic` doc `localStorage.accessToken`.
- Neu co token thi dispatch `fetchUserProfile(token)`.
- Neu khong co token thi dispatch `setUnauthenticated()`.

## 4. Complete Route Inventory

| Route | Page | Layout | Loai | Dieu kien truy cap | Nguon code |
| ----- | ---- | ------ | ---- | ------------------ | ---------- |
| `/login` | `LoginPage` | None | Public, guest-oriented | Guest xem form login; authenticated user redirect theo `returnUrl` hoac `/shop` | `src/config/routes.ts`, `src/features/auth/pages/LoginPage.tsx` |
| `/shop` | `ShopPage` | `MainLayout` | Public | Guest state, Customer, Admin deu co the truy cap | `src/config/routes.ts`, `src/features/shop/pages/ShopPage.tsx` |
| `/shop/:slug` | `ProductDetailPage` | `MainLayout` | Public, dynamic | Guest state, Customer, Admin deu co the truy cap | `src/config/routes.ts`, `src/features/shop/pages/ProductDetailPage.tsx` |
| `/cart` | `CartPage` | `MainLayout` | Authenticated | `AuthMiddleware` yeu cau `auth.isAuthenticated = true` | `src/config/routes.ts`, `src/features/auth/components/AuthMiddleware.tsx`, `src/features/cart/pages/CartPage.tsx` |
| `/profile` | `ProfilePage` | `MainLayout` | Authenticated | `AuthMiddleware` yeu cau `auth.isAuthenticated = true` | `src/config/routes.ts`, `src/features/auth/components/AuthMiddleware.tsx`, `src/features/profile/pages/ProfilePage.tsx` |
| `*` | `Navigate to="/shop"` | None | Fallback redirect | Moi unknown route redirect ve `/shop` | `src/App.tsx` |

Khong phat hien:

- Index route.
- Route con duoc khai bao bang nested path rieng.
- Admin route.
- Role-restricted route.
- Route not-found rieng.
- Checkout, payment, order, review, inventory routes.

## 5. Layout Routing

| Layout | Routes | Shared UI | Outlet | Source |
| ------ | ------ | --------- | ------ | ------ |
| `MainLayout` | `/shop`, `/shop/:slug`, `/cart`, `/profile` | Header, logo, login link, authenticated greeting, avatar dropdown, logout, profile link, sidebar menu | Khong dung `Outlet`; nhan `children` | `src/layouts/MainLayout.tsx` |
| None | `/login` | Login page tu quan ly layout rieng | Khong | `src/config/routes.ts`, `src/features/auth/pages/LoginPage.tsx` |
| `AuthMiddleware` | Route wrapper cho `/cart`, `/profile` | Loading auth check va redirect login | Co `Outlet` | `src/features/auth/components/AuthMiddleware.tsx` |

Khong co:

- Admin layout.
- Authentication layout rieng.
- Module-specific layout.
- Footer chung.

`MainLayout` khong la nested route layout theo React Router `Outlet`; no la component wrapper duoc render truc tiep quanh page trong `App.tsx`.

## 6. Public Routes

### `/shop`

- Page: `ShopPage`.
- Layout: `MainLayout`.
- Feature ID: SHOP-01, SHOP-02, SHOP-03, SHOP-04, SHOP-05, SHOP-06, SHOP-07, SHOP-08.
- Flow ID: PRODUCT-F01, SEARCH-F01, SEARCH-F02, FILTER-F01, PAGINATION-F01, ADMIN-PRODUCT-F01, ADMIN-PRODUCT-F02, ADMIN-PRODUCT-F03.
- Actor: Guest state, Customer, Admin.
- Current behavior: hien product list, search, filter, pagination va product create/update/delete UI.
- Security note: Product CRUD hien nam tren public route va chua co Admin role guard trong source.

### `/shop/:slug`

- Page: `ProductDetailPage`.
- Layout: `MainLayout`.
- Feature ID: PROD-01, PROD-02, CART-01.
- Flow ID: PRODUCT-F02, PRODUCT-F03, CART-F01, CART-F02.
- Actor: Guest state, Customer, Admin.
- Current behavior: doc `slug`, search product de suy ra id, fetch detail bang id.
- Security note: Add-to-cart va buy-now dung `useRequireAuth`; product detail van public.

### `/login`

- Page: `LoginPage`.
- Layout: none.
- Feature ID: AUTH-02.
- Flow ID: AUTH-F01, CART-F02.
- Actor: Guest state.
- Current behavior: hien login form neu chua authenticated; redirect ve `returnUrl` hoac `/shop` neu da authenticated.

## 7. Guest-only Routes

Source hien tai khong co route guest-only theo nghia route guard rieng cho Guest.

`/login` la guest-oriented route, nhung khong co wrapper `GuestRoute`. Logic redirect authenticated user nam truc tiep trong `LoginPage`:

- Neu `auth.loading = true`: render `null`.
- Neu `auth.isAuthenticated = true`: `<Navigate to={returnUrl} replace />`.
- Neu chua authenticated: render login form.

Can Technical Lead xac nhan neu ban dung lai can guest-only guard rieng de chan authenticated user truy cap `/login`.

## 8. Authenticated Routes

Authenticated routes hien co:

| Route | Page | Feature ID | Flow ID | Actor hien tai | Enforcement |
| ----- | ---- | ---------- | ------- | -------------- | ----------- |
| `/cart` | `CartPage` | CART-02, CART-03 | CART-F03, CART-F04, CART-F05 | Authenticated user; nghiep vu la Customer | Frontend `AuthMiddleware` |
| `/profile` | `ProfilePage` | USER-01 | USER-F01 | Authenticated user; nghiep vu la Customer/Admin own profile | Frontend `AuthMiddleware` |

`AuthMiddleware` chi kiem tra:

- `state.auth.loading`.
- `state.auth.isAuthenticated`.

`AuthMiddleware` khong kiem tra:

- Customer/Admin role.
- Ownership.
- Backend session validity tai thoi diem route render.
- Scope cua Admin.

## 9. Admin or Role-restricted Routes

Source hien tai khong co Admin route hoac role-restricted route.

Theo `roles.md`, project chi co hai role nghiep vu da xac nhan:

- Customer.
- Admin.

Guest khong phai database role, chi la trang thai chua dang nhap.

Product CRUD duoc xac nhan la pham vi Admin khi dung lai, nhung source hien tai:

- Hien add/edit/delete product UI trong `/shop`.
- Khong doc role tu token/profile/store.
- Khong co `AdminRoute`.
- Khong co role-based menu.
- Khong co backend authorization trong repository.

Khong duoc xem viec an button hoac dat CRUD trong UI la authorization. Khi co backend, backend phai enforce Admin role cho product mutations.

## 10. Dynamic Routes

### `/shop/:slug`

* Parameter: `slug`.
* Page: `ProductDetailPage`.
* Data source:
  - `productApi.search(searchTerm)` goi `/products/search?q=...`.
  - Match product bang `slugify(product.title) === slug`.
  - Neu match thi set `productId`.
  - `useProductById(productId)` goi `/products/:id`.
* Loading:
  - `useProductById` loading thi hien Ant Design `Spin`.
  - Trong luc dang search de tim `productId`, neu `productId` chua co thi `useProductById` disabled. Source khong co loading rieng cho buoc search slug.
* Error:
  - Loi tu `useProductById` duoc hien thi bang message text.
  - Loi search slug bi catch rong va khong hien message rieng.
* Not found:
  - Neu slug khong match product nao, source hien khong co not-found UI ro rang.
  - Component co the render `null` khi khong loading, khong error va khong co product.
* Refetch khi parameter thay doi:
  - `useEffect` phu thuoc `slug`, nen se search lai khi slug doi.
  - Can Technical Lead xac nhan route detail nen dung slug, id, hay ca hai.
* Known risk:
  - Source khong reset `productId` ve `null` khi slug moi khong match, nen can kiem tra nguy co giu product detail cu trong cung component lifecycle.

## 11. Nested Routes

Source hien tai khong co nested route business theo path con.

Co mot route wrapper:

```tsx
<Route element={<AuthMiddleware />}>
  {protectedRoutes.map(...)}
</Route>
```

Day la nesting de ap dung middleware va render protected child route qua `Outlet`, khong phai nested route layout co URL hierarchy nhu `/account/profile` hoac `/admin/products`.

## 12. Protected Route Behavior

### Auth state

Auth state nam trong Redux slice `auth`:

- `userData`.
- `loading`.
- `isAuthenticated`.
- `loginLoading`.
- `loginError`.

Nguon: `src/features/auth/store/authSlice.ts`.

### Loading state

Trong `AuthMiddleware`:

- Neu `loading = true`, render text `auth.checkingAccess`.
- UI loading dung inline style.

Nguon: `src/features/auth/components/AuthMiddleware.tsx`.

### Redirect

Neu user chua authenticated:

```text
/login?returnUrl=<encoded current pathname + search>
```

Nguon: `src/features/auth/components/AuthMiddleware.tsx`.

`useRequireAuth` cung redirect den `/login?returnUrl=...` khi user click add-to-cart hoac buy-now ma chua login.

Nguon: `src/features/auth/hooks/useRequireAuth.ts`.

### Role checks

Source hien tai khong co role checks.

- Khong co `Customer`/`Admin` field trong route guard.
- Khong co Admin guard.
- Khong co ownership guard.
- Product CRUD khong bi chan theo role trong frontend.

### Session restoration

Khi app mount:

- `App` dispatch `appInit()`.
- `initAuthEpic` doc `localStorage.accessToken`.
- Neu co token thi dispatch `fetchUserProfile(token)`.
- `fetchUserProfileEpic` goi `/auth/me`.
- Thanh cong thi set `isAuthenticated = true`.
- Loi thi set unauthenticated.

Nguon: `src/App.tsx`, `src/features/auth/store/initAuthEpic.ts`, `src/features/auth/store/authEpic.ts`, `src/features/auth/store/authSlice.ts`.

### Security limitation

Frontend route guard chi la UX control. No khong thay the:

- Server-side authentication.
- Server-side authorization.
- Role enforcement.
- Ownership enforcement.
- Pricing, inventory, order status enforcement.

Khi co backend, backend phai la noi quyet dinh quyen truy cap va pham vi du lieu.

## 13. Navigation Architecture

### Header

Header nam trong `MainLayout`:

- Logo la `Link` den `/shop`.
- Neu chua authenticated: hien `Link` den `/login`.
- Neu authenticated: hien greeting, avatar va dropdown.
- Dropdown co logout button va `Link` den `/profile`.

Nguon: `src/layouts/MainLayout.tsx`.

### Sidebar and menu

Sidebar nam trong `MainLayout`, dung `NavLink` cho:

- `/shop`.
- `/cart`.
- `/profile`.

Menu khong phan biet Guest, Customer, Admin. Guest co the thay `/cart` va `/profile`, nhung khi truy cap se bi `AuthMiddleware` redirect ve login.

Nguon: `src/layouts/MainLayout.tsx`.

### Links

| Source | Destination | Condition | Route exists | Conclusion |
| ------ | ----------- | --------- | ------------ | ---------- |
| Header logo | `/shop` | All users | Yes | Valid |
| Header login | `/login` | Unauthenticated UI | Yes | Valid |
| Avatar dropdown profile | `/profile` | Authenticated UI | Yes | Valid |
| Sidebar shop | `/shop` | All users | Yes | Valid |
| Sidebar cart | `/cart` | All users see link | Yes | Guest redirects to login |
| Sidebar profile | `/profile` | All users see link | Yes | Guest redirects to login |
| Product card | `/shop/${slugify(product.title)}` | Product exists in list | Yes, dynamic | Valid if slug can be resolved |
| Product detail breadcrumb | `/shop` | Product detail page | Yes | Valid |
| Cart icon | `/cart` | Product detail header | Yes | Guest redirects to login if route opened |

### Programmatic navigation

| Source | Destination | Trigger | Route exists | Conclusion |
| ------ | ----------- | ------- | ------------ | ---------- |
| `MainLayout.handleLogout` | `/shop` | Logout | Yes | Valid |
| `ShopPage` search select | `/shop/${slug}` | Select suggested product | Yes, dynamic | Valid if slug match |
| `ProductDetailPage` buy-now | `/cart` | Authenticated buy now | Yes | Valid |
| `useRequireAuth` | `/login?returnUrl=...` | Unauthenticated protected action | Yes | Valid |

### Redirect after action

- Login success: `LoginPage` redirects authenticated user to `returnUrl` or `/shop`.
- Logout: `MainLayout` navigates to `/shop`.
- Protected route unauthorized: `AuthMiddleware` redirects to `/login?returnUrl=...`.
- Unknown route: `App` redirects to `/shop`.

Current concern:

- `returnUrl` is read from query string and used directly as Navigate destination. Can Technical Lead xac nhan co can whitelist/sanitize internal returnUrl khi dung lai khong.

## 14. Route-Feature-Flow Mapping

| Route | Feature ID | Flow ID | Actor | Vai tro |
| ----- | ---------- | ------- | ----- | ------- |
| `/login` | AUTH-02 | AUTH-F01 | Guest state | Diem bat dau login |
| `/login` | CART-01, AUTH-02 | CART-F02 | Guest state | Trang dich sau unauthorized add-to-cart hoac protected route redirect |
| `/shop` | SHOP-01 | PRODUCT-F01 | Guest state, Customer, Admin | Xem danh sach san pham |
| `/shop` | SHOP-02 | SEARCH-F01 | Guest state, Customer, Admin | Tim kiem san pham |
| `/shop` | SHOP-03 | SEARCH-F02 | Guest state, Customer, Admin | Goi y tim kiem |
| `/shop` | SHOP-04 | FILTER-F01 | Guest state, Customer, Admin | Loc san pham client-side |
| `/shop` | SHOP-05 | PAGINATION-F01 | Guest state, Customer, Admin | Phan trang client-side |
| `/shop` | SHOP-06 | ADMIN-PRODUCT-F01 | Admin | Them san pham; source hien thieu Admin enforcement |
| `/shop` | SHOP-07 | ADMIN-PRODUCT-F02 | Admin | Sua san pham; source hien thieu Admin enforcement |
| `/shop` | SHOP-08 | ADMIN-PRODUCT-F03 | Admin | Xoa san pham; source hien thieu Admin enforcement |
| `/shop/:slug` | PROD-01 | PRODUCT-F02 | Guest state, Customer, Admin | Xem chi tiet san pham |
| `/shop/:slug` | PROD-02 | PRODUCT-F03 | Guest state, Customer, Admin | Chon mau va anh san pham |
| `/shop/:slug` | CART-01 | CART-F01, CART-F02 | Customer, Guest state | Add-to-cart hoac redirect login neu chua authenticated |
| `/cart` | CART-02 | CART-F03, CART-F04 | Customer | Xem, cap nhat va xoa item trong cart |
| `/cart` | CART-03 | CART-F05 | Customer | Xem subtotal, tax va total |
| `/profile` | USER-01 | USER-F01 | Customer, Admin | Xem own profile |
| `*` | SYS-01 mot phan | Can Technical Lead xac nhan | Guest state, Customer, Admin | Fallback redirect ve `/shop`, chua co not-found flow rieng |

## 15. Not-found and Error Routing

Current not-found behavior:

- Route `*` redirect ve `/shop`.
- Khong co not-found page.
- Khong co route-level error boundary rieng.

Current error handling:

- `ErrorBoundary` boc toan bo `BrowserRouter` trong `App.tsx`.
- Product list error hien message trong `ShopPage`.
- Product detail fetch error hien message trong `ProductDetailPage`.
- Auth route loading/unauthorized duoc xu ly trong `AuthMiddleware`.

Limitations:

- Unknown URL khong cho user biet route khong ton tai.
- Product detail slug khong match chua co not-found UI ro rang.
- Search slug failure trong `ProductDetailPage` bi catch rong.

## 16. Current Routing Problems

- Khong co not-found page that; unknown route redirect thang ve `/shop`.
- Product detail route chua co not-found UI khi slug khong match.
- Product detail co nguy co giu `productId` cu khi doi sang slug khong match. Can Technical Lead xac nhan muc do uu tien sua khi dung lai.
- Khong co Admin route trong source.
- Product CRUD nam tren public `/shop` va chua co Admin guard.
- Route guard chi kiem tra authenticated, khong kiem tra role.
- Chua co ownership enforcement cho Customer data; backend chua ton tai trong repo.
- Guest van thay `/cart` va `/profile` trong sidebar, du khi truy cap bi redirect login.
- Route string bi hardcode o nhieu noi: `App.tsx`, `MainLayout.tsx`, `ShopPage.tsx`, `ProductDetailPage.tsx`, `ProductCard.tsx`, `CartIcon.tsx`, `AuthMiddleware.tsx`, `useRequireAuth.ts`.
- Khong co route constants tap trung.
- Comment "Lazy imports" trong `src/config/routes.ts` khong dung voi implementation hien tai.
- Khong co lazy loading/Suspense cho pages.
- `returnUrl` sau login chua thay whitelist route noi bo.
- Routing tests co dau hieu import path cu trong `src/__tests__`, can kiem tra lai truoc khi xem la coverage dang tin cay.
- Khong co route cho checkout, payment, order, review hoac inventory; cac module nay cung chua co implementation trong source.

## 17. Rebuild Routing Guidance

Phan nay la de xuat khi dung lai, khong phai implementation hien tai.

Huong dan da duoc xac nhan hoac phu hop voi stack hien co:

- Giu stack frontend hien tai va React Router.
- Tach route configuration ro rang theo nhom:
  - Public routes.
  - Authenticated Customer routes.
  - Authenticated Admin routes.
- Chuan hoa route constants de tranh hardcode string.
- Dong bo sidebar/menu/header voi route config.
- Them not-found route/page rieng thay vi redirect tat ca unknown route ve `/shop`, neu Technical Lead xac nhan.
- Chuan hoa protected route:
  - Loading state.
  - Unauthorized redirect.
  - Internal `returnUrl` validation.
  - Role check khi role duoc backend/token cung cap.
- Product CRUD can duoc bao ve bang Admin route/action guard va backend Admin enforcement.
- Customer routes can enforce own-data ownership o backend khi co backend.
- Can nhac lazy loading page-level neu bundle lon; khong mo ta lazy loading la hien trang vi source chua co.
- Khong tao backend, database hoac API server trong buoc tai lieu nay.

Security guidance:

- Frontend route guard chi dung cho UX.
- Backend phai enforce authentication, authorization, role, ownership, pricing, inventory va order state khi backend ton tai.
- Khong tin role, ownership, gia, total hoac order status do frontend tu khai bao.

## 18. Items Requiring Technical Lead Confirmation

- Product CRUD giu trong `/shop` voi role gating hay chuyen sang Admin route rieng.
- Admin default route sau login.
- Customer default route sau login.
- Role `Customer` va `Admin` se duoc frontend nhan tu token, `/auth/me` hay endpoint khac.
- Gia tri role trong backend/database la `Customer`/`Admin`, `customer`/`admin` hay enum khac.
- Co can guest-only route guard rieng cho `/login` khong.
- Co can an `/cart` va `/profile` khoi sidebar khi Guest chua dang nhap khong.
- Co can whitelist/sanitize `returnUrl` sau login khong.
- Product detail route nen dung slug, id, hay ca hai.
- Unknown route nen redirect `/shop` hay hien not-found page.
- Co can route order history/detail/cancel cho Customer khong.
- Co can route Admin order management khong.
- Co can checkout/payment routes trong scope dung lai khong.
- Co can review routes sau khi mua khong.
- Co giu `BrowserRouter` hay chuyen sang data router pattern cua React Router v7.
- Co can lazy loading page-level khong.
- Routing tests hien tai co can sua import path/coverage truoc khi dung lam regression baseline khong.
