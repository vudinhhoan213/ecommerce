# Frontend Architecture Overview

## 1. Purpose

Tài liệu này mô tả kiến trúc frontend hiện tại của project E-Commerce để phục vụ việc bảo trì, kiểm thử và dựng lại hệ thống. Nội dung phản ánh source code hiện có, đồng bộ với các tài liệu sản phẩm trong `docs/product`, đặc biệt là `feature-list.md`, `business-rules.md`, `roles.md` và `user-flows.md`.

Tài liệu này không mô tả backend hoặc database như implementation hiện tại vì repository không chứa các thành phần đó.

## 2. Current Scope

Project hiện tại chỉ triển khai frontend React SPA.

Các thành phần chưa tồn tại trong repository:

- Backend server.
- Database.
- Server-side authentication.
- Server-side authorization.
- Backend controllers, services, middleware hoặc API server nội bộ.

Frontend hiện gọi API bên ngoài thông qua biến môi trường `REACT_APP_API_BASE_URL`. Không coi API bên ngoài này là backend nội bộ của project.

## 3. Repository Structure

```text
.
├── docs/
│   ├── architecture/
│   │   └── frontend-overview.md
│   └── product/
│       ├── business-rules.md
│       ├── feature-list.md
│       ├── roles.md
│       └── user-flows.md
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── static browser assets
├── src/
│   ├── __mocks__/
│   ├── __tests__/
│   ├── assets/
│   ├── components/
│   ├── config/
│   ├── features/
│   ├── layouts/
│   ├── lib/
│   ├── locales/
│   ├── mappers/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── index.tsx
│   └── i18n.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

Vai trò chính:

- `src/index.tsx`: entry point, gắn các provider cấp ứng dụng.
- `src/App.tsx`: root component, routing, app init và ErrorBoundary.
- `src/config/routes.ts`: cấu hình public/protected routes.
- `src/features`: module theo nghiệp vụ frontend như auth, shop, cart, profile.
- `src/components/ui`: shared UI components và UI primitives.
- `src/lib`: Redux store, root epic, React Query client.
- `src/mappers`: mapping dữ liệu API sang shape frontend.
- `src/types`: TypeScript domain types.
- `src/__tests__`: unit/component/page/store tests.

## 4. Technology Stack

| Technology | Purpose | Version | Source reference |
| ---------- | ------- | ------- | ---------------- |
| React | UI framework | `^19.2.6` | `package.json` |
| React DOM | Browser rendering | `^19.2.6` | `package.json` |
| TypeScript | Static typing | `^5.9.3` | `package.json`, `tsconfig.json` |
| Create React App / react-scripts | Build/dev/test tooling | `5.0.1` | `package.json` |
| React Router DOM | Client-side routing | `^7.15.0` | `package.json`, `src/App.tsx` |
| Redux Toolkit | Global client state | `^2.6.1` | `package.json`, `src/lib/store.ts` |
| React Redux | React bindings for Redux | `^9.2.0` | `package.json`, `src/index.tsx` |
| Redux Persist | Browser persistence for Redux | `^6.0.0` | `package.json`, `src/lib/store.ts` |
| Redux Observable | Redux side effects | `^3.0.0-rc.3` | `package.json`, `src/lib/rootEpic.ts` |
| RxJS | Observable primitives and ajax | `^7.8.2` | `package.json`, `src/features/auth/store/authEpic.ts` |
| TanStack React Query | Server state/cache | `^5.101.0` | `package.json`, `src/lib/queryClient.ts` |
| Ant Design | UI component library | `^6.3.7` | `package.json`, feature components |
| Ant Design Icons | Icons | `^6.2.2` | `package.json`, pages/components |
| i18next | Translation engine | `^24.2.3` | `package.json`, `src/i18n.ts` |
| react-i18next | React integration for i18n | `^15.7.4` | `package.json`, components/pages |
| Testing Library | Component testing | `@testing-library/*` | `package.json`, `src/__tests__` |

## 5. Application Entry and Providers

Entry point: `src/index.tsx`.

Provider hierarchy:

1. `Provider` from `react-redux`
   - Provides Redux store.
2. `PersistGate`
   - Rehydrates persisted Redux slices.
3. `QueryClientProvider`
   - Provides React Query client.
4. `TextMbProvider`
   - Provides custom typography/theme context for `TextMb`.
5. `App`
   - Contains ErrorBoundary and Router.
6. `ReactQueryDevtools`
   - Mounted with `initialIsOpen={false}`.

Router provider:

- `BrowserRouter` is created in `src/App.tsx`.

Theme/context providers:

- `TextMbProvider` is a custom context provider.
- No global dark mode provider is present.

## 6. Routing Architecture

| Route | Page | Layout | Access condition | Source |
| ----- | ---- | ------ | ---------------- | ------ |
| `/login` | `LoginPage` | none | Public | `src/config/routes.ts` |
| `/shop` | `ShopPage` | `MainLayout` | Public | `src/config/routes.ts` |
| `/shop/:slug` | `ProductDetailPage` | `MainLayout` | Public dynamic route | `src/config/routes.ts` |
| `/cart` | `CartPage` | `MainLayout` | Frontend authenticated guard | `src/config/routes.ts`, `AuthMiddleware.tsx` |
| `/profile` | `ProfilePage` | `MainLayout` | Frontend authenticated guard | `src/config/routes.ts`, `AuthMiddleware.tsx` |
| `*` | Redirect to `/shop` | none | Fallback redirect | `src/App.tsx` |

Notes:

- There are no Admin-specific routes in the current source.
- There is no role-based route protection in the current source.
- `AuthMiddleware` checks only `auth.isAuthenticated` and `auth.loading`.
- Frontend route protection does not replace backend security in a real system.

## 7. Component Architecture

### Pages

- `LoginPage`: login form and authenticated redirect.
- `ShopPage`: product list, search, filter, pagination and product CRUD modal orchestration.
- `ProductDetailPage`: slug resolution, detail fetch, gallery, color selection and cart actions.
- `CartPage`: cart list, quantity controls and billing summary.
- `ProfilePage`: user profile display.

### Layouts

- `MainLayout`: header, sidebar, responsive menu, login/logout/profile links and navigation.

### Feature components

- `ProductCard`: product tile with detail link, edit/delete and add-to-cart.
- `ProductModal`: add/edit product form.
- `SearchAutocomplete`: search input and suggestion dropdown.
- `FilterPopover`: price/rating filter controls.
- `CartIcon`: cart badge link.

### Shared components and UI components

- `PageContainer`: page wrapper with title, headerRight and footer.
- `Pagination`: page navigation.
- `QuantityControl`: numeric quantity input and buttons.
- `RatingStars`: star display.
- `ErrorBoundary`: render error fallback.
- `TextMb`: typography primitive with custom theme provider.

### Forms

- `LoginPage`: Ant Design Form.
- `ProductModal`: Ant Design Form.
- `QuantityControl`: controlled native input.

Observations:

- `ShopPage` and `ProductDetailPage` contain significant data orchestration and UI logic.
- Product CRUD UI exists, but Admin authorization is not enforced in source.
- Some inline styles are present in components such as `AuthMiddleware`, `ProfilePage` and `FilterPopover`.

## 8. State Management

| Data | State type | Management tool | Source | Notes |
| ---- | ---------- | --------------- | ------ | ----- |
| Auth state | Global client state | Redux Toolkit | `src/features/auth/store/authSlice.ts` | Persisted |
| Cart | Global client state | Redux Toolkit | `src/features/cart/store/cartSlice.ts` | Persisted |
| Redux persisted data | Persisted browser state | Redux Persist/localStorage | `src/lib/store.ts` | Whitelist: `auth`, `cart` |
| Access token | Browser storage | localStorage | `authEpic.ts`, `initAuthEpic.ts`, `authSlice.ts` | Frontend-only token storage |
| Product list | Server state | React Query | `useProducts.ts` | Data from API |
| Product detail | Server state | React Query | `useProducts.ts` | Data from API |
| Product search | Server state | React Query | `useProducts.ts` | Data from API |
| Search suggest | Server state | React Query | `useSearchSuggest.ts` | Shorter cache settings |
| Product modal state | Local UI state | `useState` | `ShopPage.tsx` | `showModal`, `editingProduct` |
| Search/filter/page state | Local UI state | `useState`, `useMemo` | `ShopPage.tsx` | Client-side derived data |
| Product color/image state | Local UI state | `useState`, `useMemo` | `ProductDetailPage.tsx` | Detail page only |
| Layout sidebar/dropdown | Local UI state | `useState` | `MainLayout.tsx` | Responsive menu and logout dropdown |
| Text theme | Context state | React Context | `TextMbProvider.tsx` | UI theme only |

## 9. React Query Architecture

React Query is used for product and search server state.

Query client:

- Defined in `src/lib/queryClient.ts`.
- Default query stale time: 5 minutes.
- Default query garbage collection time: 10 minutes.
- Query retry: 2.
- Mutation retry: 1.
- Refetch on window focus and reconnect are enabled.

Query keys:

- `productKeys.all`
- `productKeys.lists()`
- `productKeys.list(filters)`
- `productKeys.details()`
- `productKeys.detail(id)`
- `suggestKeys.all`
- `suggestKeys.keyword(keyword)`

Queries:

- `useProducts`: fetch all products.
- `useSearchProducts`: search products, enabled only when the search term is not empty.
- `useProductById`: fetch product detail by id.
- `useSearchSuggest`: fetch search suggestions, enabled only when keyword is not empty.

Mutations:

- `useCreateProduct`: creates product and invalidates product list.
- `useUpdateProduct`: updates product, sets detail cache and invalidates list.
- `useDeleteProduct`: optimistic list removal, rollback on error and invalidate on settled.

Pagination:

- Current pagination is client-side in `ShopPage`.

Prefetch:

- No prefetch usage was found.

## 10. API and Data Sources

| Feature | Data source | Client hoặc service | Endpoint hoặc file | Trạng thái |
| ------- | ----------- | ------------------- | ------------------ | ---------- |
| Login | Third-party API | RxJS ajax | `/auth/login` | In use |
| Current user profile | Third-party API | RxJS ajax | `/auth/me` | In use |
| Product list | Third-party API | Fetch wrapper in `productApi` | `/products` | In use |
| Product detail | Third-party API | Fetch wrapper in `productApi` | `/products/:id` | In use |
| Product search | Third-party API | Fetch wrapper in `productApi` | `/products/search?q=...` | In use |
| Search suggest | Third-party API | Fetch wrapper in `searchSuggestApi` | `/products/search?q=...&limit=8` | In use |
| Product create | Third-party API | Fetch wrapper in `productApi` | `/products/add` | In use, missing Admin enforcement |
| Product update | Third-party API | Fetch wrapper in `productApi` | `/products/:id` PUT | In use, missing Admin enforcement |
| Product delete | Third-party API | Fetch wrapper in `productApi` | `/products/:id` DELETE | In use, missing Admin enforcement |
| Cart | LocalStorage via Redux Persist | Redux cart slice | `src/features/cart/store/cartSlice.ts` | Local only |
| Translation text | JSON files | i18next | `src/locales/vi.json`, `src/locales/en.json` | Static JSON |
| Assets | Static files | imports from `src/assets` and `public` | image files | Static assets |

No internal backend API, mock server, JSON Server or database source exists in the repository.

## 11. Frontend Authentication and Role Handling

Current frontend authentication:

- `LoginPage` submits username/password.
- `loginUserEpic` calls `/auth/login`.
- Login response must include `accessToken` or `token`.
- Token is stored in `localStorage` under `accessToken`.
- `appInit` reads `localStorage.accessToken`.
- If token exists, `fetchUserProfileEpic` calls `/auth/me`.
- Auth state is stored in Redux and persisted by Redux Persist.
- Logout removes `accessToken` and clears auth state.

Current frontend protection:

- `AuthMiddleware` protects `/cart` and `/profile`.
- `useRequireAuth` protects add-to-cart and buy-now interactions.
- Protection checks only `isAuthenticated`.

Role handling:

- Source currently does not distinguish `Customer` and `Admin`.
- `roles.md` defines `Customer` and `Admin` as confirmed product roles.
- No role-based visibility or role-based route guard is implemented.

Security note:

- Frontend protection does not replace backend security.
- Required authorization, ownership and role checks must be enforced by backend when backend exists.

## 12. Forms and Validation

| Form | Tool | Validation | Submit action | Status |
| ---- | ---- | ---------- | ------------- | ------ |
| Login form | Ant Design Form | Username required, password required | Dispatch `loginUser` | In use |
| Product modal | Ant Design Form | Title required, price required/min 0, rating 1-5 | Create/update product mutation | In use, missing URL validation |
| Quantity control | Native controlled input | `min=1`, calls `onChange` only when parsed number is `> 0` | Dispatch cart quantity update | In use |

No React Hook Form, Formik, Yup or Zod usage was found.

## 13. Styling and UI System

Current styling:

- CSS Modules for layout, pages and selected components.
- Global CSS in `src/index.css`.
- Ant Design override CSS in `src/antd-overrides.css`.
- Ant Design components for form, modal, cards, alerts, spinner, skeleton, result and message.
- Ant Design Icons for UI icons.
- Custom `TextMb` typography primitive and theme provider.

Responsive behavior:

- `MainLayout` tracks viewport width with `window.innerWidth <= 576`.
- CSS modules include responsive styles.

Known UI concerns:

- Some colors and spacing are hardcoded.
- Some components use inline styles.
- No dark mode was found.
- Some icon-style buttons do not have clear accessible labels.
- `App.css` appears likely legacy because it is not imported by the current entry/root app.

## 14. Main Frontend Flows

| Flow ID | Route or component | State | API or data source | Result |
| ------- | ------------------ | ----- | ------------------ | ------ |
| AUTH-F01 | `/login`, `LoginPage` | Redux auth | `/auth/login`, `/auth/me` | Authenticated session or login error |
| AUTH-F02 | `App`, `initAuthEpic` | Redux auth, localStorage | `/auth/me` | Session restored or unauthenticated |
| AUTH-F03 | `MainLayout` | Redux auth, localStorage | none | Logout local state |
| PRODUCT-F01 | `/shop`, `ShopPage` | React Query | `/products` | Product grid |
| SEARCH-F01 | `ShopPage`, `SearchAutocomplete` | Local state, React Query | `/products/search` | Search results |
| SEARCH-F02 | `SearchAutocomplete` | Local state, React Query | `/products/search?limit=8` | Suggest dropdown |
| FILTER-F01 | `FilterPopover`, `ShopPage` | Local state | Client-side products | Filtered list |
| PAGINATION-F01 | `Pagination`, `ShopPage` | Local state | Client-side products | Current page changes |
| PRODUCT-F02 | `/shop/:slug`, `ProductDetailPage` | Local state, React Query | Search then `/products/:id` | Product detail |
| PRODUCT-F03 | `ProductDetailPage` | Local state | Product images/colors | Selected image/color |
| CART-F01 | Product card/detail | Redux cart | Local persisted state | Item added |
| CART-F03 | `/cart`, `CartPage` | Redux cart | Local persisted state | Quantity/cart updated |
| CART-F04 | `/cart`, `CartPage` | Redux cart | Local persisted state | Item removed |
| CART-F05 | `/cart`, cart selectors | Redux derived state | Local persisted state | Subtotal/tax/total |
| USER-F01 | `/profile`, `ProfilePage` | Redux auth | `/auth/me` via auth flow | Profile displayed |
| ADMIN-PRODUCT-F01 | `/shop`, `ProductModal` | React Query mutation | `/products/add` | Product create mutation |
| ADMIN-PRODUCT-F02 | `/shop`, `ProductModal` | React Query mutation | `/products/:id` PUT | Product update mutation |
| ADMIN-PRODUCT-F03 | `/shop`, `ProductCard` | React Query mutation | `/products/:id` DELETE | Product delete mutation |

## 15. UI States

| Feature hoặc Flow | Loading | Error | Empty | Not found | Retry |
| ----------------- | ------- | ----- | ----- | --------- | ----- |
| AUTH-F01 | Login button loading | Alert for login error | Not applicable | Not applicable | Submit again |
| AUTH-F02 | Checking access/loading | Failed profile becomes unauthenticated | Not applicable | Not applicable | Login again |
| AUTH-F03 | Not applicable | Not implemented | Not applicable | Not applicable | Not applicable |
| PRODUCT-F01 | Skeleton cards | Error text | No products/no result | Not applicable | Reload/refetch |
| SEARCH-F01 | Query fetching | Error text | No result | Not applicable | Change keyword |
| SEARCH-F02 | Spinner row | Error UI unclear | Dropdown hidden | Not applicable | Re-enter keyword |
| FILTER-F01 | Not applicable | Not applicable | No result | Not applicable | Reset filter |
| PAGINATION-F01 | Not applicable | Not applicable | Hidden when one page | Not applicable | Not applicable |
| PRODUCT-F02 | Spinner | Error text | Not applicable | Incomplete | Reload/back to shop |
| PRODUCT-F03 | Covered by detail loading | Fallback image partly | Possible missing image data | Not applicable | Not applicable |
| CART-F01 | Not applicable | No server rollback | Not applicable | Not applicable | Add again |
| CART-F03 | Not applicable | Not implemented | Empty cart | Not applicable | Not applicable |
| USER-F01 | Spinner | Warning when no userData | Not applicable | Not applicable | Login again |
| ADMIN-PRODUCT-F01 | Mutation loading | Message error | Not applicable | Not applicable | Submit again |
| ADMIN-PRODUCT-F02 | Mutation loading | Message error | Not applicable | Needs handling | Submit again |
| ADMIN-PRODUCT-F03 | Mutation loading | Message error and rollback | Possible empty list | Needs handling | Retry delete |

## 16. Environment Configuration

| Variable | Purpose | File used | Sensitive | Status |
| -------- | ------- | --------- | --------- | ------ |
| `REACT_APP_API_BASE_URL` | API base URL for external API calls | `authEpic.ts`, `productApi.ts`, `searchSuggestApi.ts` | No frontend env var should contain secrets | In use |

Do not store secrets in frontend environment variables.

## 17. Local Development

Commands from `package.json`:

- Install: `npm install`
- Development: `npm start`
- Lint: no dedicated lint script is defined; CRA ESLint config exists in `package.json`
- Test: `npm test`
- Build: `npm run build`

## 18. Testing

Current test areas:

- Utils: `format`, `slugify`.
- Auth: auth slice, auth epic, LoginPage, AuthMiddleware, useRequireAuth.
- Cart: cart slice, cart selectors, CartPage.
- Components: PageContainer, QuantityControl, RatingStars, CartIcon, ProductCard, Pagination.
- Profile: ProfilePage.

Missing or weak coverage:

- ShopPage integration behavior.
- ProductDetailPage.
- ProductModal.
- SearchAutocomplete.
- FilterPopover.
- Product API and search suggest API.
- React Query hooks and mutations.
- Cart batch epic.
- MainLayout.
- ErrorBoundary.
- End-to-end flows.
- Role-based frontend behavior for Customer/Admin.

## 19. Current Limitations

- The project only contains frontend code.
- Business rules are not enforced server-side in this repository.
- Role and ownership are not enforced server-side in this repository.
- Current source only checks `isAuthenticated`, not Customer/Admin role.
- Cart is persisted locally and is not validated by a backend.
- Product CRUD exists in UI/API client but lacks Admin enforcement.
- Price, tax and cart totals are calculated on the frontend; they are not authoritative for checkout.
- Inventory, stock and product availability are not checked.
- Checkout, orders, payments and reviews are not implemented.
- Token is stored in localStorage.
- Data from the external API should not be treated as project database data.

## 20. Rebuild Guidance

Confirmed frontend guidance:

- Keep the frontend stack.
- Use a clear feature/module structure.
- Separate API clients from UI components.
- Standardize query keys.
- Standardize loading and error states.
- Do not store secrets in frontend code or frontend environment variables.
- Prepare interfaces and API boundaries for future backend integration.
- Keep client state, server state and browser storage responsibilities separate.
- Treat backend as the future authority for role, ownership, pricing, inventory and order state.
- Do not create backend, database or API server in this step.

## 21. Items Requiring Technical Lead Confirmation

- Whether CRA remains the long-term build tool.
- Whether product CRUD stays in `/shop` or moves to Admin-specific routes.
- How Customer/Admin role will be exposed to frontend.
- Whether cart remains local-only or becomes server-side.
- Whether search, filter and pagination should move server-side.
- Whether product detail route should use slug, id or both.
- Whether checkout, order and payment flows are in rebuild scope.
- Whether Redux Observable should remain for auth side effects.
- Whether `TextMb` custom typography provider should remain.
- Whether an i18n language switcher is required.
- Whether locale encoding should be normalized.
- Whether apparently unused packages such as `react-icons`, `ajv` and `@types/react-router-dom` can be removed after a build/test audit.
- Whether token storage should remain localStorage or move to another mechanism.
