# Business Rules

## 1. Purpose

Tai lieu nay ghi lai cac quy tac nghiep vu co bang chung trong source code cua project E-Commerce hien tai. Muc tieu la lam can cu cho viec dung lai he thong bang AI va chuyen tung quy tac thanh test case.

Pham vi can cu:

- `docs/product/feature-list.md`
- Frontend routes, pages, components, hooks, store, API clients
- Types, mappers, validation UI va tests hien co

Gioi han da xac dinh:

- Repository hien tai khong co backend noi bo, controller, service backend, middleware backend, migration, ORM hoac database schema.
- Backend lien quan trong code la DummyJSON API ben ngoai.
- Nhung rule can backend enforcement nhung khong co backend trong repo duoc danh dau `Can Technical Lead xac nhan`.

## 2. Rule Summary

| Rule ID | Module | Quy tac | Feature lien quan | Muc do chac chan |
| ------- | ------ | ------- | ----------------- | ---------------- |
| AUTH-R01 | Auth | Co token thi app thu fetch profile khi khoi dong | AUTH-01 | Cao |
| AUTH-R02 | Auth | Login yeu cau username/password va gui `expiresInMins: 30` | AUTH-02 | Cao |
| AUTH-R03 | Auth | Login thanh cong phai nhan duoc `accessToken` hoac `token` | AUTH-02 | Cao |
| AUTH-R04 | Auth | Logout chi xoa token va auth state tren client | AUTH-03 | Cao |
| AUTHZ-R01 | Authorization | `/cart` va `/profile` yeu cau authenticated | AUTH-04 | Cao |
| AUTHZ-R02 | Authorization | Add to cart va buy now yeu cau authenticated | CART-01 | Cao |
| AUTHZ-R03 | Authorization | Product CRUD chua co role check ro rang | SHOP-06/07/08 | Cao |
| SHOP-R01 | Shop | Product rating duoc clamp trong khoang 0-5 khi map | SHOP-01 | Cao |
| SHOP-R02 | Shop | Search chi chay khi keyword khong rong | SHOP-02 | Cao |
| SHOP-R03 | Shop | Search suggest chi chay khi keyword khong rong va lay limit 8 | SHOP-03 | Cao |
| SHOP-R04 | Shop | Filter gia/rating chay client-side voi khoang co dinh | SHOP-04 | Cao |
| SHOP-R05 | Shop | Pagination chay client-side voi 20 san pham/trang | SHOP-05 | Cao |
| SHOP-R06 | Shop | Product create/update/delete goi DummyJSON mutation API | SHOP-06/07/08 | Cao |
| PROD-R01 | Product | Product detail suy ra product id bang search theo slug | PROD-01 | Cao |
| PROD-R02 | Product | Product image/color co fallback khi thieu du lieu | PROD-02 | Cao |
| CART-R01 | Cart | Cart item unique theo `product.id + selectedColor` | CART-01 | Cao |
| CART-R02 | Cart | Add trung product va color thi tang quantity | CART-01 | Cao |
| CART-R03 | Cart | Quantity nho hon 1 thi xoa item khoi cart | CART-02 | Cao |
| CART-R04 | Cart | Xoa item dua tren `productId + color` | CART-02 | Cao |
| CART-R05 | Cart | Subtotal, tax va total duoc tinh tren client | CART-03 | Cao |
| USER-R01 | User Profile | Profile field thieu duoc fallback ve chuoi rong hoac `N/A` | USER-01 | Cao |
| USER-R02 | User Profile | Gender male hien male/blue, gia tri khac male hien female/magenta | USER-01 | Cao |
| VALIDATION-R01 | Validation | Product form yeu cau title, price; price min 0; rating 1-5 | SHOP-06/07 | Cao |
| VALIDATION-R02 | Validation | Quantity input chi chap nhan number hop le va lon hon 0 khi nhap truc tiep | CART-02 | Cao |
| DUP-R01 | Duplicate Prevention | Khong tao item moi khi cart da co cung product va color | CART-01 | Cao |
| PRICE-R01 | Pricing | Tax = `Math.round(subTotal * 0.1)` | CART-03 | Cao |
| NOTIFY-R01 | Notification | Add-to-cart notifications duoc gom trong 500ms | CART-01 | Cao |
| SECURITY-R01 | Security | Token luu trong `localStorage` | AUTH-01/02/03 | Cao |
| SECURITY-R02 | Security | API product gui Bearer token neu localStorage co token | SHOP-01/06/07/08 | Cao |
| SYS-R01 | System | ErrorBoundary bat loi render va cho reload page | SYS-01 | Cao |

## 3. Authentication and Account Rules

### AUTH-R01: Khoi tao phien dang nhap tu token local

* Module: Auth
* Feature lien quan: AUTH-01
* Actor hoac role: Guest, Authenticated User, System
* Dieu kien ap dung: App duoc mount va dispatch `appInit`.
* Quy tac: Neu `localStorage` co `accessToken`, app phai dispatch `fetchUserProfile(token)`. Neu khong co token, app phai set unauthenticated.
* Hanh dong duoc phep: Thu khoi phuc phien bang token dang luu local.
* Hanh dong bi cam: Coi user la authenticated khi chua fetch profile thanh cong.
* Ket qua khi hop le: `/auth/me` thanh cong thi `userData` duoc set va `isAuthenticated = true`.
* Ket qua khi vi pham: API profile loi thi `userData = null`, `isAuthenticated = false`, `loading = false`.
* Trang thai hoac du lieu truoc: `auth.loading = true`, co hoac khong co `accessToken`.
* Trang thai hoac du lieu sau: Auth state la authenticated hoac unauthenticated.
* Nguon tham chieu trong code: `src/App.tsx`, `src/features/auth/store/initAuthEpic.ts`, `src/features/auth/store/authEpic.ts`, `src/features/auth/store/authSlice.ts`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan co tiep tuc dung localStorage token hay chuyen sang session/httpOnly cookie.

### AUTH-R02: Login yeu cau username va password

* Module: Auth
* Feature lien quan: AUTH-02
* Actor hoac role: Guest
* Dieu kien ap dung: User submit form login.
* Quy tac: Username va password la bat buoc. Username duoc `trim()` truoc khi gui API. Request login gui them `expiresInMins: 30`.
* Hanh dong duoc phep: Submit khi form co username va password.
* Hanh dong bi cam: Submit login khi thieu username hoac password.
* Ket qua khi hop le: Dispatch `loginUser`, goi `POST /auth/login`.
* Ket qua khi vi pham: Ant Design form validation hien message required va khong submit.
* Trang thai hoac du lieu truoc: `loginLoading = false`, form co hoac thieu input.
* Trang thai hoac du lieu sau: `loginLoading = true` trong luc goi API.
* Nguon tham chieu trong code: `src/features/auth/pages/LoginPage.tsx`, `src/features/auth/store/authEpic.ts`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan `expiresInMins: 30` la business rule that hay chi phuc vu DummyJSON.

### AUTH-R03: Login response phai co token

* Module: Auth
* Feature lien quan: AUTH-02
* Actor hoac role: Guest
* Dieu kien ap dung: API login tra response.
* Quy tac: Response hop le phai co `accessToken` hoac `token`.
* Hanh dong duoc phep: Luu token vao `localStorage`, dispatch `loginUserSuccess(token)` va `fetchUserProfile(token)`.
* Hanh dong bi cam: Set authenticated khi response khong co token.
* Ket qua khi hop le: Token duoc luu, app fetch profile.
* Ket qua khi vi pham: Dispatch `loginUserFailed(i18n.t("error.noToken"))`.
* Trang thai hoac du lieu truoc: Login request da gui.
* Trang thai hoac du lieu sau: Token ton tai trong `localStorage` hoac login error duoc set.
* Nguon tham chieu trong code: `src/features/auth/store/authEpic.ts`, `src/types/auth.types.ts`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan chuan response token cua backend moi.

### AUTH-R04: Logout chi xoa state local

* Module: Auth
* Feature lien quan: AUTH-03
* Actor hoac role: Authenticated User
* Dieu kien ap dung: User click logout trong header dropdown.
* Quy tac: Logout xoa `localStorage.accessToken`, set `userData = null`, `isAuthenticated = false`, `loading = false`.
* Hanh dong duoc phep: Reset auth state local va navigate ve `/shop`.
* Hanh dong bi cam: Giu userData/token sau logout.
* Ket qua khi hop le: User tro ve trang thai Guest.
* Ket qua khi vi pham: Khong thay xu ly loi vi khong goi backend.
* Trang thai hoac du lieu truoc: User dang authenticated.
* Trang thai hoac du lieu sau: Token bi xoa, auth state unauthenticated.
* Nguon tham chieu trong code: `src/features/auth/store/authSlice.ts`, `src/layouts/MainLayout.tsx`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan logout co can revoke token/session tren backend khong.

## 4. Authorization and Ownership Rules

### AUTHZ-R01: Protected routes yeu cau authenticated

* Module: Authorization
* Feature lien quan: AUTH-04
* Actor hoac role: Authenticated User
* Dieu kien ap dung: User truy cap `/cart` hoac `/profile`.
* Quy tac: Neu `auth.loading` thi hien checking state. Neu `isAuthenticated = false` thi redirect ve `/login?returnUrl=...`. Neu authenticated thi render route.
* Hanh dong duoc phep: Authenticated User truy cap protected route.
* Hanh dong bi cam: Guest truy cap truc tiep protected route.
* Ket qua khi hop le: Protected page render qua `Outlet`.
* Ket qua khi vi pham: User bi redirect ve login kem returnUrl.
* Trang thai hoac du lieu truoc: Current route la protected route.
* Trang thai hoac du lieu sau: Render protected page hoac navigate login.
* Nguon tham chieu trong code: `src/config/routes.ts`, `src/features/auth/components/AuthMiddleware.tsx`, `src/__tests__/middleware/AuthMiddleware.test.tsx`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan backend moi phai enforce cung quyen truy cap.

### AUTHZ-R02: Add to cart va buy now yeu cau authenticated

* Module: Authorization
* Feature lien quan: CART-01
* Actor hoac role: Authenticated User
* Dieu kien ap dung: User click add to cart hoac buy now.
* Quy tac: `useRequireAuth` chi chay callback khi `isAuthenticated = true`; neu false thi navigate login kem returnUrl.
* Hanh dong duoc phep: Authenticated User them san pham vao cart.
* Hanh dong bi cam: Guest thuc hien add to cart hoac buy now ma khong login.
* Ket qua khi hop le: Dispatch `addToCart`.
* Ket qua khi vi pham: Redirect ve `/login?returnUrl=...`.
* Trang thai hoac du lieu truoc: User co hoac khong co auth state.
* Trang thai hoac du lieu sau: Cart duoc cap nhat hoac user o trang login.
* Nguon tham chieu trong code: `src/features/auth/hooks/useRequireAuth.ts`, `src/features/shop/components/ProductCard.tsx`, `src/features/shop/pages/ProductDetailPage.tsx`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan cart co can backend ownership enforcement khong.

### AUTHZ-R03: Product CRUD chua co role authorization ro rang

* Module: Authorization
* Feature lien quan: SHOP-06, SHOP-07, SHOP-08
* Actor hoac role: Can Technical Lead xac nhan
* Dieu kien ap dung: User thao tac them, sua hoac xoa san pham tren shop.
* Quy tac: Code hien co UI va API client cho CRUD san pham nhung khong co role check admin/seller/staff.
* Hanh dong duoc phep: Trong project cu, UI cho phep click nut CRUD tren `/shop`.
* Hanh dong bi cam: Khong co rule cam trong frontend hien tai.
* Ket qua khi hop le: Goi DummyJSON mutation API.
* Ket qua khi vi pham: Khong xac dinh duoc vi khong co backend noi bo de doi chieu.
* Trang thai hoac du lieu truoc: User o shop page.
* Trang thai hoac du lieu sau: Product list cache duoc invalidate/update theo mutation.
* Nguon tham chieu trong code: `src/features/shop/pages/ShopPage.tsx`, `src/features/shop/components/ProductCard.tsx`, `src/features/shop/components/ProductModal.tsx`, `src/features/shop/api/productApi.ts`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan product CRUD la feature that hay demo va role nao duoc phep.

## 5. Rules by Business Module

### Shop

### SHOP-R01: Product rating duoc clamp ve 0-5

* Module: Shop
* Feature lien quan: SHOP-01
* Actor hoac role: Guest, Authenticated User
* Dieu kien ap dung: Product duoc map tu API response.
* Quy tac: `rating` phai duoc dua ve khoang 0 den 5 bang `Math.min(Math.max(raw.rating, 0), 5)`.
* Hanh dong duoc phep: Render rating da clamp.
* Hanh dong bi cam: Render rating nho hon 0 hoac lon hon 5 sau mapping.
* Ket qua khi hop le: UI nhan Product co rating trong khoang 0-5.
* Ket qua khi vi pham: Khong co xu ly loi rieng, nhung mapper se clamp gia tri.
* Trang thai hoac du lieu truoc: Raw product tu API.
* Trang thai hoac du lieu sau: Product mapped.
* Nguon tham chieu trong code: `src/mappers/productMapper.ts`, `src/types/product.types.ts`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan backend moi co validate rating 0-5 khong.

### SHOP-R02: Search chi chay khi keyword khong rong

* Module: Shop
* Feature lien quan: SHOP-02
* Actor hoac role: Guest, Authenticated User
* Dieu kien ap dung: User nhap search term tren shop.
* Quy tac: Search query chi enabled khi `searchTerm.trim().length > 0`.
* Hanh dong duoc phep: Goi `/products/search?q=...` voi keyword khong rong.
* Hanh dong bi cam: Goi search API voi keyword rong hoac chi gom whitespace.
* Ket qua khi hop le: Render danh sach ket qua search.
* Ket qua khi vi pham: Query search khong chay, shop dung danh sach products mac dinh.
* Trang thai hoac du lieu truoc: `searchTerm` co gia tri bat ky.
* Trang thai hoac du lieu sau: `searchResults` duoc fetch hoac query disabled.
* Nguon tham chieu trong code: `src/features/shop/hooks/useProducts.ts`, `src/features/shop/pages/ShopPage.tsx`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan search nen client-visible keyword hay full-text search backend.

### SHOP-R03: Search suggest chi chay khi keyword khong rong va lay toi da 8 ket qua

* Module: Shop
* Feature lien quan: SHOP-03
* Actor hoac role: Guest, Authenticated User
* Dieu kien ap dung: User nhap keyword trong search autocomplete.
* Quy tac: Keyword rong tra ve `[]`; keyword khong rong goi `/products/search?q=<keyword>&limit=8`.
* Hanh dong duoc phep: Goi suggest API voi keyword sau trim khong rong.
* Hanh dong bi cam: Goi suggest API khi keyword rong.
* Ket qua khi hop le: Dropdown hien danh sach goi y.
* Ket qua khi vi pham: Khong co goi y, tra mang rong.
* Trang thai hoac du lieu truoc: Raw search input.
* Trang thai hoac du lieu sau: Suggest results hoac empty array.
* Nguon tham chieu trong code: `src/features/shop/components/SearchAutocomplete.tsx`, `src/features/shop/hooks/useSearchSuggest.ts`, `src/features/shop/api/searchSuggestApi.ts`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan limit 8 va ranking logic.

### SHOP-R04: Filter gia va rating chay tren client voi khoang co dinh

* Module: Shop
* Feature lien quan: SHOP-04
* Actor hoac role: Guest, Authenticated User
* Dieu kien ap dung: User chon filter tren shop.
* Quy tac: Product hop le khi `price >= priceFrom`, `price <= priceTo`, `rating >= ratingFrom`, `rating <= ratingTo`.
* Hanh dong duoc phep: Chon price/rating tu option co san.
* Hanh dong bi cam: Chon `from` lon hon `to`; UI loc options de chan truong hop nay.
* Ket qua khi hop le: Danh sach san pham duoc loc tren client.
* Ket qua khi vi pham: Option khong hop le khong duoc hien trong select.
* Trang thai hoac du lieu truoc: Products list hoac search results.
* Trang thai hoac du lieu sau: Filtered products.
* Nguon tham chieu trong code: `src/features/shop/components/FilterPopover.tsx`, `src/features/shop/pages/ShopPage.tsx`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan range gia va filter server-side/client-side.

### SHOP-R05: Pagination client-side voi 20 san pham moi trang

* Module: Shop
* Feature lien quan: SHOP-05
* Actor hoac role: Guest, Authenticated User
* Dieu kien ap dung: Filtered products co nhieu hon mot trang.
* Quy tac: Moi trang hien toi da 20 san pham. Page chi hop le khi nam trong `[1, totalPages]`.
* Hanh dong duoc phep: Chuyen den page hop le bang click hoac phim mui ten trai/phai.
* Hanh dong bi cam: Chuyen den page nho hon 1 hoac lon hon totalPages.
* Ket qua khi hop le: `currentPage` cap nhat va list duoc slice theo page.
* Ket qua khi vi pham: Page khong duoc cap nhat.
* Trang thai hoac du lieu truoc: `currentPage`, `filteredProducts`.
* Trang thai hoac du lieu sau: `paginatedProducts`.
* Nguon tham chieu trong code: `src/features/shop/pages/ShopPage.tsx`, `src/components/ui/Pagination.tsx`, `src/__tests__/components/shop/Pagination.test.tsx`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan pagination co can server-side cho dataset lon khong.

### SHOP-R06: Product CRUD goi DummyJSON mutation API

* Module: Shop
* Feature lien quan: SHOP-06, SHOP-07, SHOP-08
* Actor hoac role: Can Technical Lead xac nhan
* Dieu kien ap dung: User submit ProductModal hoac confirm delete.
* Quy tac: Create goi `POST /products/add`; update goi `PUT /products/:id`; delete goi `DELETE /products/:id`.
* Hanh dong duoc phep: Submit form create/update, confirm delete.
* Hanh dong bi cam: Khong thay rule cam theo role trong frontend.
* Ket qua khi hop le: Create/update/delete mutation thanh cong, list query duoc invalidate; update detail cache khi update; delete optimistic update va rollback neu loi.
* Ket qua khi vi pham: Mutation error hien message `Create failed`, `Update failed` hoac `Delete failed`.
* Trang thai hoac du lieu truoc: Product list cache va form/delete input.
* Trang thai hoac du lieu sau: Product cache duoc invalidate/update hoac rollback.
* Nguon tham chieu trong code: `src/features/shop/hooks/useProducts.ts`, `src/features/shop/api/productApi.ts`, `src/features/shop/pages/ShopPage.tsx`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan day la feature quan tri that hay code demo.

### Product

### PROD-R01: Product detail suy ra product id bang search theo slug

* Module: Product
* Feature lien quan: PROD-01
* Actor hoac role: Guest, Authenticated User
* Dieu kien ap dung: User truy cap `/shop/:slug`.
* Quy tac: Slug duoc doi dau `-` thanh space de search; product match khi `slugify(product.title) === slug`; sau do fetch detail bang id.
* Hanh dong duoc phep: Xem detail neu slug match mot product.
* Hanh dong bi cam: Khong co route detail hop le khi slug khong match.
* Ket qua khi hop le: Product detail duoc fetch va render.
* Ket qua khi vi pham: Khong co not-found state ro rang trong code hien tai.
* Trang thai hoac du lieu truoc: URL slug.
* Trang thai hoac du lieu sau: `productId` va product detail data.
* Nguon tham chieu trong code: `src/features/shop/pages/ProductDetailPage.tsx`, `src/utils/slugify.ts`, `src/features/shop/api/productApi.ts`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan route detail dung id, slug hay ca hai.

### PROD-R02: Product color va image co fallback

* Module: Product
* Feature lien quan: PROD-02
* Actor hoac role: Guest, Authenticated User
* Dieu kien ap dung: Product detail da load.
* Quy tac: Neu product khong co `colors`, dung default colors tu translation. Neu `images` it hon so mau, tao fallback image cho mau tuong ung.
* Hanh dong duoc phep: Chon mau, chuyen anh bang arrow hoac thumbnail.
* Hanh dong bi cam: Khong co rule cam ro rang.
* Ket qua khi hop le: Selected color va current image index duoc cap nhat.
* Ket qua khi vi pham: Neu images rong hoac data thieu, UI co the khong day du.
* Trang thai hoac du lieu truoc: Product images/colors tu API.
* Trang thai hoac du lieu sau: Images/colors da co fallback de render.
* Nguon tham chieu trong code: `src/features/shop/pages/ProductDetailPage.tsx`, `src/types/product.types.ts`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan variant/color/image schema that.

### Cart

### CART-R01: Cart item unique theo product va color

* Module: Cart
* Feature lien quan: CART-01
* Actor hoac role: Authenticated User
* Dieu kien ap dung: Dispatch `addToCart`.
* Quy tac: Item duoc xem la trung khi cung `product.id` va cung `selectedColor`.
* Hanh dong duoc phep: Them item moi neu chua co cap product-color.
* Hanh dong bi cam: Tao dong cart moi cho cung product va cung color.
* Ket qua khi hop le: Cart list them item moi voi `quantity = 1`.
* Ket qua khi vi pham: Neu item da ton tai, quantity tang thay vi tao dong moi.
* Trang thai hoac du lieu truoc: Cart list hien tai.
* Trang thai hoac du lieu sau: Cart list moi.
* Nguon tham chieu trong code: `src/features/cart/store/cartSlice.ts`, `src/__tests__/store/cart/cartSlice.test.ts`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan cart key co can them variant id/SKU khong.

### CART-R02: Add trung product va color thi tang quantity

* Module: Cart
* Feature lien quan: CART-01
* Actor hoac role: Authenticated User
* Dieu kien ap dung: Cart da co item cung product id va selected color.
* Quy tac: Khi add cung product-color, `existing.quantity += 1`.
* Hanh dong duoc phep: Tang quantity cua item ton tai.
* Hanh dong bi cam: Duplicate item cung product-color.
* Ket qua khi hop le: Quantity tang them 1.
* Ket qua khi vi pham: Khong co loi; reducer ep thanh increment.
* Trang thai hoac du lieu truoc: Item ton tai trong cart.
* Trang thai hoac du lieu sau: Item do co quantity moi.
* Nguon tham chieu trong code: `src/features/cart/store/cartSlice.ts`, `src/__tests__/store/cart/cartSlice.test.ts`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan co gioi han quantity toi da theo stock khong.

### CART-R03: Quantity nho hon 1 thi xoa item

* Module: Cart
* Feature lien quan: CART-02
* Actor hoac role: Authenticated User
* Dieu kien ap dung: Dispatch `updateQuantity`.
* Quy tac: Neu `newQuantity < 1`, reducer xoa item khoi cart.
* Hanh dong duoc phep: Giam quantity ve 0 de xoa item.
* Hanh dong bi cam: Luu item voi quantity nho hon 1.
* Ket qua khi hop le: Item bi remove.
* Ket qua khi vi pham: Reducer filter bo item, khong luu invalid quantity.
* Trang thai hoac du lieu truoc: Cart co item.
* Trang thai hoac du lieu sau: Cart khong con item do.
* Nguon tham chieu trong code: `src/features/cart/store/cartSlice.ts`, `src/__tests__/pages/cart/CartPage.test.tsx`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan UX xoa item khi quantity ve 0.

### CART-R04: Xoa item theo productId va color

* Module: Cart
* Feature lien quan: CART-02
* Actor hoac role: Authenticated User
* Dieu kien ap dung: User click remove item.
* Quy tac: Chi xoa item khop ca `productId` va `color`.
* Hanh dong duoc phep: Remove item dung product-color.
* Hanh dong bi cam: Xoa tat ca item cung product id nhung khac color.
* Ket qua khi hop le: Item khop bi remove.
* Ket qua khi vi pham: Item khong khop color duoc giu lai.
* Trang thai hoac du lieu truoc: Cart list co mot hoac nhieu item.
* Trang thai hoac du lieu sau: Cart list da filter.
* Nguon tham chieu trong code: `src/features/cart/store/cartSlice.ts`, `src/__tests__/store/cart/cartSlice.test.ts`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Khong co.

### CART-R05: Subtotal, tax va total duoc tinh tren client

* Module: Cart
* Feature lien quan: CART-03
* Actor hoac role: Authenticated User
* Dieu kien ap dung: CartPage can hien billing.
* Quy tac: `subTotal = sum(price * quantity)`, `tax = Math.round(subTotal * 0.1)`, `total = subTotal + tax`.
* Hanh dong duoc phep: Hien billing theo cart local.
* Hanh dong bi cam: Khong co rule cam trong code.
* Ket qua khi hop le: Billing section hien subtotal, tax, total.
* Ket qua khi vi pham: Khong co xu ly loi rieng.
* Trang thai hoac du lieu truoc: Cart list.
* Trang thai hoac du lieu sau: Derived totals.
* Nguon tham chieu trong code: `src/features/cart/store/cartSelectors.ts`, `src/__tests__/store/cart/cartSelectors.test.ts`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan tax 10% co phai rule that khong.

### User Profile

### USER-R01: Profile field thieu co fallback

* Module: User Profile
* Feature lien quan: USER-01
* Actor hoac role: Authenticated User
* Dieu kien ap dung: API `/auth/me` tra user data.
* Quy tac: Mapper fallback ten/email/image/gender ve chuoi rong khi thieu; `dob`, `companyAddress`, `homeAddress` fallback `N/A`.
* Hanh dong duoc phep: Render profile ngay ca khi mot so field thieu.
* Hanh dong bi cam: Crash UI khi optional field bi thieu.
* Ket qua khi hop le: ProfilePage hien data hoac fallback.
* Ket qua khi vi pham: Khong co loi rieng; mapper bao ve optional path.
* Trang thai hoac du lieu truoc: Raw API user data.
* Trang thai hoac du lieu sau: `UserData` mapped.
* Nguon tham chieu trong code: `src/mappers/authMapper.ts`, `src/features/profile/pages/ProfilePage.tsx`, `src/__tests__/pages/profile/ProfilePage.test.tsx`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan profile fields that can hien thi.

### USER-R02: Gender display mapping

* Module: User Profile
* Feature lien quan: USER-01
* Actor hoac role: Authenticated User
* Dieu kien ap dung: ProfilePage render gender.
* Quy tac: Neu `userData.gender === "male"` thi hien male icon/tag blue; nguoc lai hien female icon/tag magenta.
* Hanh dong duoc phep: Hien gender theo mapping hien co.
* Hanh dong bi cam: Khong co rule cho gender khac male/female.
* Ket qua khi hop le: Gender tag hien dung theo mapping.
* Ket qua khi vi pham: Gia tri khac male bi hien nhu female.
* Trang thai hoac du lieu truoc: `userData.gender`.
* Trang thai hoac du lieu sau: Gender icon/color/label.
* Nguon tham chieu trong code: `src/features/profile/pages/ProfilePage.tsx`, `src/__tests__/pages/profile/ProfilePage.test.tsx`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan danh sach gender hop le.

### System

### SYS-R01: ErrorBoundary bat loi render va cho reload

* Module: System
* Feature lien quan: SYS-01
* Actor hoac role: Guest, Authenticated User
* Dieu kien ap dung: Component con throw error trong React render lifecycle.
* Quy tac: ErrorBoundary set `hasError = true`, log error bang `console.error`, hien fallback Result va nut reload.
* Hanh dong duoc phep: User reload page tu fallback UI.
* Hanh dong bi cam: Khong co.
* Ket qua khi hop le: Fallback UI hien thi thay vi crash trang trang.
* Ket qua khi vi pham: Khong co test hien tai de xac minh.
* Trang thai hoac du lieu truoc: React tree dang render.
* Trang thai hoac du lieu sau: Error fallback hoac page reload.
* Nguon tham chieu trong code: `src/App.tsx`, `src/components/ui/ErrorBoundary.tsx`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan co can gui loi ve monitoring service khong.

## 6. State Transition Rules

| Entity | Trang thai hien tai | Hanh dong | Trang thai tiep theo | Role | Dieu kien |
| ------ | ------------------- | --------- | -------------------- | ---- | --------- |
| Auth | loading | App init khong co token | unauthenticated | System | `localStorage.accessToken` khong ton tai |
| Auth | loading | App init co token va `/auth/me` thanh cong | authenticated | System | Token ton tai va profile API thanh cong |
| Auth | loading/authenticated | Fetch profile loi | unauthenticated | System | `/auth/me` loi |
| Auth | authenticated | Logout | unauthenticated | Authenticated User | User click logout |
| Login | idle/error | Submit valid credentials | loading | Guest | Username va password co gia tri |
| Login | loading | Login response co token | token stored, fetch profile | Guest | Response co `accessToken` hoac `token` |
| Login | loading | Login error hoac response khong co token | error | Guest | API loi hoac thieu token |
| Cart item | not exists | Add product-color | exists, quantity 1 | Authenticated User | Product id va color chua co trong cart |
| Cart item | exists | Add cung product-color | exists, quantity + 1 | Authenticated User | Product id va color da co trong cart |
| Cart item | exists | Update quantity >= 1 | exists, quantity moi | Authenticated User | Item khop productId va color |
| Cart item | exists | Update quantity < 1 | removed | Authenticated User | Item khop productId va color |
| Cart item | exists | Remove item | removed | Authenticated User | Item khop productId va color |

Khong phat hien state transition cho order, payment, inventory, review hoac promotion trong repository.

## 7. Validation Rules

### VALIDATION-R01: Product form validation

* Module: Validation
* Feature lien quan: SHOP-06, SHOP-07
* Actor hoac role: Can Technical Lead xac nhan
* Dieu kien ap dung: User submit ProductModal.
* Quy tac: `title` required, `price` required va min 0, `rating` min 1 max 5, `thumbnail` optional va khong validate URL.
* Hanh dong duoc phep: Submit khi title va price hop le.
* Hanh dong bi cam: Submit khi thieu title hoac price.
* Ket qua khi hop le: Goi create/update mutation.
* Ket qua khi vi pham: Form validation chan submit va hien message.
* Trang thai hoac du lieu truoc: Form values.
* Trang thai hoac du lieu sau: Mutation payload hoac validation error.
* Nguon tham chieu trong code: `src/features/shop/components/ProductModal.tsx`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan validation backend moi cho product.

### VALIDATION-R02: Quantity input validation

* Module: Validation
* Feature lien quan: CART-02
* Actor hoac role: Authenticated User
* Dieu kien ap dung: User nhap quantity truc tiep trong cart.
* Quy tac: Input co `min=1`; `onChange` chi goi callback khi parse duoc number va value > 0.
* Hanh dong duoc phep: Nhap quantity la so nguyen hop le lon hon 0.
* Hanh dong bi cam: Cap nhat quantity qua input bang NaN, rong hoac <= 0.
* Ket qua khi hop le: Dispatch update quantity.
* Ket qua khi vi pham: Input state co the doi, nhung callback update khong duoc goi.
* Trang thai hoac du lieu truoc: Quantity hien tai.
* Trang thai hoac du lieu sau: Quantity moi hoac khong thay doi store.
* Nguon tham chieu trong code: `src/components/ui/QuantityControl.tsx`, `src/__tests__/components/common/QuantityControl.test.tsx`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan co can gioi han quantity theo stock khong.

## 8. Duplicate Prevention Rules

### DUP-R01: Khong duplicate cart item cung product va color

* Module: Duplicate Prevention
* Feature lien quan: CART-01
* Actor hoac role: Authenticated User
* Dieu kien ap dung: User them san pham vao cart.
* Quy tac: Neu cart da co item cung `id` va `selectedColor`, khong push item moi ma tang quantity.
* Hanh dong duoc phep: Co nhieu dong cart cho cung product neu color khac nhau.
* Hanh dong bi cam: Co nhieu dong cart trung ca product id va selected color.
* Ket qua khi hop le: Cart khong duplicate item cung product-color.
* Ket qua khi vi pham: Reducer chuyen thanh increment quantity.
* Trang thai hoac du lieu truoc: Cart list truoc add.
* Trang thai hoac du lieu sau: Cart list sau add.
* Nguon tham chieu trong code: `src/features/cart/store/cartSlice.ts`, `src/__tests__/store/cart/cartSlice.test.ts`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan product variant key trong backend moi.

## 9. Pricing and Inventory Rules

### PRICE-R01: Tax cua cart la 10% subtotal

* Module: Pricing
* Feature lien quan: CART-03
* Actor hoac role: Authenticated User
* Dieu kien ap dung: Cart totals duoc tinh.
* Quy tac: `tax = Math.round(subTotal * 0.1)`.
* Hanh dong duoc phep: Hien subtotal, tax, total tren CartPage.
* Hanh dong bi cam: Khong co rule cam trong code.
* Ket qua khi hop le: Total = subtotal + tax.
* Ket qua khi vi pham: Khong co validation backend de doi chieu.
* Trang thai hoac du lieu truoc: Cart items.
* Trang thai hoac du lieu sau: Derived totals.
* Nguon tham chieu trong code: `src/features/cart/store/cartSelectors.ts`, `src/__tests__/store/cart/cartSelectors.test.ts`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan thue 10% la rule that hay placeholder.

Inventory rules:

- Khong phat hien `stock`, inventory, reservation hoac update ton kho trong source code.
- Khong co rule chan add-to-cart khi san pham het hang.
- Can Technical Lead xac nhan neu ban dung lai can module inventory.

## 10. Notification and Audit Rules

### NOTIFY-R01: Gom thong bao add-to-cart trong 500ms

* Module: Notification
* Feature lien quan: CART-01
* Actor hoac role: Authenticated User
* Dieu kien ap dung: Co mot hoac nhieu action `addToCart` trong 500ms.
* Quy tac: Buffer add-to-cart actions trong 500ms. Neu 1 item thi hien message single theo ten product; neu nhieu item thi hien message multiple theo count.
* Hanh dong duoc phep: Hien notification sau khi add cart.
* Hanh dong bi cam: Khong co.
* Ket qua khi hop le: Ant Design message success hien thong bao.
* Ket qua khi vi pham: Khong co xu ly loi notification.
* Trang thai hoac du lieu truoc: Stream action `addToCart`.
* Trang thai hoac du lieu sau: Dispatch `cartBatchNotified(count)`.
* Nguon tham chieu trong code: `src/features/cart/store/cartEpic.ts`, `src/features/cart/store/cartSlice.ts`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan notification co can audit/log server-side khong.

Audit rules:

- Khong phat hien audit log hoac lich su thay doi trong repository.
- Product create/update/delete khong co audit trail trong code hien tai.
- Can Technical Lead xac nhan neu ban dung lai can audit.

## 11. Security and Sensitive Data Rules

### SECURITY-R01: Token luu trong localStorage

* Module: Security
* Feature lien quan: AUTH-01, AUTH-02, AUTH-03
* Actor hoac role: Guest, Authenticated User
* Dieu kien ap dung: Login thanh cong, app init, logout.
* Quy tac: Login thanh cong luu token vao `localStorage.accessToken`; app init doc token nay; logout xoa token nay.
* Hanh dong duoc phep: Luu/doc/xoa token local theo auth flow.
* Hanh dong bi cam: Khong co co che cam trong code.
* Ket qua khi hop le: Auth flow hoat dong voi token local.
* Ket qua khi vi pham: Token thieu thi app set unauthenticated.
* Trang thai hoac du lieu truoc: Token co hoac khong co trong localStorage.
* Trang thai hoac du lieu sau: Token duoc luu, doc hoac xoa.
* Nguon tham chieu trong code: `src/features/auth/store/authEpic.ts`, `src/features/auth/store/initAuthEpic.ts`, `src/features/auth/store/authSlice.ts`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan rui ro XSS/localStorage va chien luoc token moi.

### SECURITY-R02: Product API gui Bearer token neu co token

* Module: Security
* Feature lien quan: SHOP-01, SHOP-06, SHOP-07, SHOP-08
* Actor hoac role: Guest, Authenticated User
* Dieu kien ap dung: Frontend goi product API client.
* Quy tac: `getHeaders` them `Authorization: Bearer <token>` neu localStorage co `accessToken`.
* Hanh dong duoc phep: Goi product API co hoac khong co Authorization header tuy token.
* Hanh dong bi cam: Khong co frontend rule bat buoc token cho product API.
* Ket qua khi hop le: Request duoc gui voi header phu hop.
* Ket qua khi vi pham: API error duoc throw neu response khong ok.
* Trang thai hoac du lieu truoc: localStorage co hoac khong co token.
* Trang thai hoac du lieu sau: HTTP request headers.
* Nguon tham chieu trong code: `src/features/shop/api/productApi.ts`
* Muc do chac chan: Cao
* Can Technical Lead xac nhan: Can Technical Lead xac nhan endpoint nao phai bat buoc auth tren backend moi.

## 12. Conflicts in the Original Project

- Product CRUD co UI va API client nhung khong co role authorization ro rang.
- Cart route va add-to-cart bi guard o frontend, nhung cart khong co backend ownership enforcement.
- Product detail phu thuoc search theo slug de tim id, co rui ro sai khi title trung hoac search khong tra ket qua.
- Product detail khong co not-found state ro rang khi slug khong match.
- Product modal khong validate thumbnail URL.
- Product modal chi nhap title, price, rating, thumbnail; khong nhap description, images, colors du Product type co cac field nay.
- Tax 10% hard-code trong frontend, chua co backend/pricing policy de doi chieu.
- Khong co stock/inventory rule nen user co the tang quantity khong gioi han trong cart local.
- `Buy Now` khong tao order/payment, chi add cart va navigate `/cart`.
- Token luu trong localStorage, co rui ro neu co XSS.
- `cartBatchNotified` reducer rong, co ve chi la action danh dau sau notification.
- `CartItem.image`, `CartItem.name` va `LoginResponse` co dau hieu legacy hoac it duoc su dung.
- README la Create React App default, chua mo ta business rules, role, API hay test account.

## 13. Rules Requiring Technical Lead Confirmation

- Can Technical Lead xac nhan repository co phai frontend-only hay backend/database nam o repo khac.
- Can Technical Lead xac nhan product CRUD la feature that hay demo DummyJSON.
- Can Technical Lead xac nhan role duoc phep them/sua/xoa san pham.
- Can Technical Lead xac nhan backend moi phai enforce authorization nao cho cart, profile va product CRUD.
- Can Technical Lead xac nhan token storage: localStorage, httpOnly cookie hay session.
- Can Technical Lead xac nhan co refresh token va revoke token khi logout khong.
- Can Technical Lead xac nhan cart local-only hay server-side theo user.
- Can Technical Lead xac nhan co checkout/order/payment trong scope dung lai khong.
- Can Technical Lead xac nhan tax 10% la rule that hay placeholder.
- Can Technical Lead xac nhan co stock/inventory va product active/inactive khong.
- Can Technical Lead xac nhan product category co ton tai trong domain that khong.
- Can Technical Lead xac nhan product color/variant/image schema.
- Can Technical Lead xac nhan product detail route dung id, slug hay ca hai.
- Can Technical Lead xac nhan search/filter/pagination nen client-side hay server-side.
- Can Technical Lead xac nhan co review/rating submission sau khi mua khong.
- Can Technical Lead xac nhan co can audit log cho product mutation hoac auth action khong.
