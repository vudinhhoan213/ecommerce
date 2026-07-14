# User Flows

## 1. Purpose

Tài liệu này mô tả các hành trình và luồng thao tác của người dùng trong project E-Commerce hiện tại. Tài liệu dùng để:

- Chuyển luồng nghiệp vụ thành task triển khai khi dựng lại hệ thống.
- Chuyển từng bước thành test case cho UI, API và authorization.
- Đối chiếu frontend hiện tại với backend/API cần có.
- Ghi rõ các luồng còn thiếu, chưa đủ authorization, hoặc cần Technical Lead xác nhận.

Tài liệu đồng bộ với:

- `docs/product/feature-list.md`
- `docs/product/business-rules.md`
- `docs/product/roles.md`

Giới hạn:

- Project hiện tại chỉ xác nhận hai role nghiệp vụ: `Customer` và `Admin`.
- `Guest` là trạng thái chưa đăng nhập, không phải role lưu trong database.
- Không tồn tại `Seller`, `Shipper`, `Vendor` hoặc `Staff` trong phạm vi hiện tại.
- Source hiện tại chưa có checkout, payment, order, review, inventory hoặc backend nội bộ.

## 2. Flow Summary

| Flow ID | Actor | Tên luồng | Feature ID | Kết quả | Trạng thái cũ | Ưu tiên |
| ------- | ----- | --------- | ---------- | ------- | ------------- | ------- |
| AUTH-F01 | Guest state | Đăng nhập | AUTH-02 | Có token, fetch profile, redirect | Complete demo | P0 |
| AUTH-F02 | System | Khôi phục phiên khi mở app | AUTH-01 | Authenticated hoặc unauthenticated | Partially implemented | P0 |
| AUTH-F03 | Customer, Admin | Đăng xuất | AUTH-03 | Xóa local token và auth state | Complete local | P0 |
| PRODUCT-F01 | Guest state, Customer, Admin | Xem danh sách sản phẩm | SHOP-01 | Product grid hiển thị | Missing tests | P0 |
| SEARCH-F01 | Guest state, Customer, Admin | Tìm kiếm sản phẩm | SHOP-02 | Danh sách kết quả tìm kiếm | Missing tests | P1 |
| SEARCH-F02 | Guest state, Customer, Admin | Gợi ý tìm kiếm | SHOP-03 | Dropdown gợi ý sản phẩm | Missing tests | P2 |
| FILTER-F01 | Guest state, Customer, Admin | Lọc sản phẩm theo giá/rating | SHOP-04 | Danh sách đã lọc | Frontend only | P1 |
| PAGINATION-F01 | Guest state, Customer, Admin | Phân trang sản phẩm | SHOP-05 | Trang sản phẩm hiện tại thay đổi | Complete local | P1 |
| PRODUCT-F02 | Guest state, Customer, Admin | Xem chi tiết sản phẩm | PROD-01 | Product detail hiển thị | Partially implemented | P0 |
| PRODUCT-F03 | Guest state, Customer, Admin | Chọn màu và ảnh sản phẩm | PROD-02 | Selected color/image thay đổi | Frontend only | P2 |
| CART-F01 | Customer | Thêm sản phẩm vào giỏ | CART-01 | Cart local được cập nhật | Frontend only | P0 |
| CART-F02 | Guest state | Thử thêm giỏ khi chưa đăng nhập | CART-01, AUTH-02 | Redirect login | Frontend only | P0 |
| CART-F03 | Customer | Xem và cập nhật giỏ hàng | CART-02 | Quantity/cart list thay đổi | Frontend only | P0 |
| CART-F04 | Customer | Xóa item khỏi giỏ | CART-02 | Item bị xóa khỏi cart local | Frontend only | P0 |
| CART-F05 | Customer | Xem tổng tiền giỏ hàng | CART-03 | Subtotal, tax, total hiển thị | Complete local | P1 |
| USER-F01 | Customer, Admin | Xem hồ sơ cá nhân | USER-01 | Profile own data hiển thị | Complete demo | P1 |
| ADMIN-PRODUCT-F01 | Admin | Thêm sản phẩm | SHOP-06 | Create product mutation | Missing authorization | P2 |
| ADMIN-PRODUCT-F02 | Admin | Sửa sản phẩm | SHOP-07 | Update product mutation | Missing authorization | P2 |
| ADMIN-PRODUCT-F03 | Admin | Xóa sản phẩm | SHOP-08 | Delete product mutation | Missing authorization | P2 |

## 3. General Flow Conventions

- Main flow: luồng thành công chính theo thứ tự thời gian.
- Alternative flow: nhánh hợp lệ tách khỏi main flow tại một bước cụ thể và quay lại hoặc kết thúc rõ ràng.
- Error flow: nhánh lỗi, ghi rõ nguyên nhân, phản hồi backend/frontend, dữ liệu có thay đổi hay không và có thể thử lại không.
- Preconditions: điều kiện cần có trước khi bắt đầu flow.
- Postconditions: trạng thái hệ thống sau khi flow thành công hoặc thất bại.
- UI states: initial, loading, success, error, empty, unauthorized, not found, disabled hoặc confirmation khi áp dụng.
- Authorization checks: frontend có thể guard route/hành động, nhưng backend phải là nơi enforce quyền khi có API thật.
- Ownership checks: Customer chỉ thao tác own data; Admin thao tác managed scope. Không tin ownership, role, giá hoặc tổng tiền do frontend tự khai báo.

## 4. Guest Flows

### CART-F02: Thử thêm sản phẩm vào giỏ khi chưa đăng nhập

#### Mục tiêu

Chặn người chưa đăng nhập thêm sản phẩm vào giỏ và chuyển họ đến trang đăng nhập.

#### Actor

Guest state.

#### Feature liên quan

CART-01, AUTH-02.

#### Business rules liên quan

AUTHZ-R02, CART-R01.

#### Điều kiện bắt đầu

User chưa authenticated và đang ở product card hoặc product detail.

#### Điểm bắt đầu

Nút add to cart hoặc buy now.

#### Dữ liệu cần có

Product đang được thao tác.

#### Main flow

| Bước | Actor | Hành động | Frontend | Backend | Dữ liệu hoặc trạng thái |
| ---- | ----- | --------- | -------- | ------- | ----------------------- |
| 1 | Guest state | Click add to cart hoặc buy now | `useRequireAuth` kiểm tra `isAuthenticated` | Không gọi API | `isAuthenticated = false` |
| 2 | Frontend | Chặn thao tác | Navigate đến `/login?returnUrl=...` | Không có | URL chứa returnUrl |
| 3 | Guest state | Nhập thông tin đăng nhập | Login form validate required fields | Không có | username, password |
| 4 | Guest state | Submit login | Dispatch `loginUser` | `POST /auth/login` | credentials |
| 5 | Frontend | Nhận token và fetch profile | Lưu token, dispatch `fetchUserProfile` | `GET /auth/me` | token, user profile |
| 6 | Frontend | Redirect | Navigate về returnUrl | Không có | User authenticated |

#### Alternative flows

* Tách khỏi main flow tại bước 1.
* Điều kiện kích hoạt: Guest mở trực tiếp `/cart`.
* Các bước xử lý: `AuthMiddleware` redirect về `/login?returnUrl=/cart`.
* Quay lại bước nào hoặc kết thúc: quay lại login flow tại bước 3.

#### Error flows

* Bước xảy ra lỗi: Bước 4.
* Nguyên nhân: Login API lỗi hoặc credentials không hợp lệ.
* Backend response: DummyJSON trả lỗi hoặc request fail.
* Frontend response: Set `loginError` và hiển thị alert.
* Dữ liệu có thay đổi hay không: Không lưu token, cart không đổi.
* Có thể thử lại hay không: Có.
* Luồng kết thúc hoặc quay lại bước nào: Quay lại bước 3.

#### Kết quả thành công

User đăng nhập thành công và quay lại returnUrl.

#### Kết quả thất bại

User vẫn ở trang login và không thêm sản phẩm vào giỏ.

#### Dữ liệu được tạo hoặc thay đổi

`localStorage.accessToken`, Redux auth state. Cart chưa tự động thêm item sau khi redirect.

#### Trạng thái trước và sau

Trước: unauthenticated. Sau thành công: authenticated.

#### UI states bắt buộc

* Initial: Product page/card hiển thị.
* Loading: Login button loading.
* Success: Redirect.
* Error: Login alert.
* Empty: Not applicable.
* Unauthorized: Redirect login.
* Not found: Not applicable.
* Disabled hoặc confirmation khi áp dụng: Login submit loading disables duplicate submit theo Ant Design button loading.

#### Frontend liên quan

`src/features/auth/hooks/useRequireAuth.ts`, `src/features/auth/pages/LoginPage.tsx`, `src/features/shop/components/ProductCard.tsx`, `src/features/shop/pages/ProductDetailPage.tsx`.

#### Backend API liên quan

`POST /auth/login`, `GET /auth/me`.

#### Database entity liên quan

Không có database nội bộ trong source.

#### Nguồn tham chiếu trong code

`src/features/auth/hooks/useRequireAuth.ts`, `src/features/auth/store/authEpic.ts`.

#### Trạng thái triển khai project cũ

Frontend only.

#### Điều kiện hoàn thành khi dựng lại

Backend phải enforce auth cho server-side cart nếu có. Cần quyết định có tự động tiếp tục add-to-cart sau login hay không.

#### Cần Technical Lead xác nhận

Cần Technical Lead xác nhận có preserve pending add-to-cart action sau login không.

## 5. Authentication Flows

### AUTH-F01: Đăng nhập

#### Mục tiêu

Xác thực người dùng và tạo authenticated session cho Customer hoặc Admin.

#### Actor

Guest state.

#### Feature liên quan

AUTH-02.

#### Business rules liên quan

AUTH-R02, AUTH-R03.

#### Điều kiện bắt đầu

User chưa đăng nhập.

#### Điểm bắt đầu

`/login`.

#### Dữ liệu cần có

Username và password.

#### Main flow

| Bước | Actor | Hành động | Frontend | Backend | Dữ liệu hoặc trạng thái |
| ---- | ----- | --------- | -------- | ------- | ----------------------- |
| 1 | Guest state | Mở `/login` | Render login form | Không có | `isAuthenticated = false` |
| 2 | Guest state | Nhập username/password | Form giữ values | Không có | username, password |
| 3 | Guest state | Submit | Dispatch `loginUser` | `POST /auth/login` | username trim, password, `expiresInMins=30` |
| 4 | Backend | Trả token | Epic đọc `accessToken` hoặc `token` | DummyJSON | token |
| 5 | Frontend | Lưu token | `localStorage.setItem("accessToken", token)` | Không có | token local |
| 6 | Frontend | Fetch profile | Dispatch `fetchUserProfile` | `GET /auth/me` | Bearer token |
| 7 | Frontend | Redirect | Navigate `returnUrl` hoặc `/shop` | Không có | authenticated state |

#### Alternative flows

* Tách khỏi main flow tại bước 1.
* Điều kiện kích hoạt: User đã authenticated mở `/login`.
* Các bước xử lý: `LoginPage` redirect về `returnUrl` hoặc `/shop`.
* Quay lại bước nào hoặc kết thúc: Kết thúc flow.

#### Error flows

* Bước xảy ra lỗi: Bước 3.
* Nguyên nhân: Thiếu username hoặc password.
* Backend response: Không gọi backend.
* Frontend response: Form validation required message.
* Dữ liệu có thay đổi hay không: Không.
* Có thể thử lại hay không: Có.
* Luồng kết thúc hoặc quay lại bước nào: Quay lại bước 2.

* Bước xảy ra lỗi: Bước 4.
* Nguyên nhân: API lỗi hoặc response không có token.
* Backend response: Error hoặc response thiếu `accessToken`/`token`.
* Frontend response: `loginUserFailed`, hiển thị alert.
* Dữ liệu có thay đổi hay không: Không lưu token.
* Có thể thử lại hay không: Có.
* Luồng kết thúc hoặc quay lại bước nào: Quay lại bước 2.

#### Kết quả thành công

Token được lưu, profile được fetch, user được redirect.

#### Kết quả thất bại

User vẫn unauthenticated và ở trang login.

#### Dữ liệu được tạo hoặc thay đổi

`localStorage.accessToken`, Redux auth state.

#### Trạng thái trước và sau

Trước: unauthenticated. Sau: authenticated hoặc login error.

#### UI states bắt buộc

* Initial: Login form.
* Loading: Login button loading.
* Success: Redirect.
* Error: Alert.
* Empty: Not applicable.
* Unauthorized: Not applicable.
* Not found: Not applicable.
* Disabled hoặc confirmation khi áp dụng: Submit button loading.

#### Frontend liên quan

`src/features/auth/pages/LoginPage.tsx`, `src/features/auth/store/authSlice.ts`, `src/features/auth/store/authEpic.ts`.

#### Backend API liên quan

`POST /auth/login`, `GET /auth/me`.

#### Database entity liên quan

Không có database nội bộ.

#### Nguồn tham chiếu trong code

`src/features/auth/pages/LoginPage.tsx`, `src/features/auth/store/authEpic.ts`.

#### Trạng thái triển khai project cũ

Complete demo.

#### Điều kiện hoàn thành khi dựng lại

Backend xác thực credentials, trả token/session chuẩn, phân biệt role Customer/Admin và enforce session security.

#### Cần Technical Lead xác nhận

Cần Technical Lead xác nhận token/session strategy, role claim và default route sau login theo role.

### AUTH-F02: Khôi phục phiên khi mở app

#### Mục tiêu

Khôi phục authenticated state từ token đã lưu.

#### Actor

System.

#### Feature liên quan

AUTH-01.

#### Business rules liên quan

AUTH-R01, SECURITY-R01.

#### Điều kiện bắt đầu

App được mount.

#### Điểm bắt đầu

`src/App.tsx`.

#### Dữ liệu cần có

`localStorage.accessToken` nếu có.

#### Main flow

| Bước | Actor | Hành động | Frontend | Backend | Dữ liệu hoặc trạng thái |
| ---- | ----- | --------- | -------- | ------- | ----------------------- |
| 1 | System | App render | Dispatch `appInit` | Không có | auth loading |
| 2 | System | Đọc token | `localStorage.getItem("accessToken")` | Không có | token hoặc null |
| 3 | System | Có token | Dispatch `fetchUserProfile` | `GET /auth/me` | Bearer token |
| 4 | Backend | Trả profile | Mapper profile | DummyJSON | UserData |
| 5 | Frontend | Set auth | `fetchUserProfileSuccess` | Không có | `isAuthenticated=true` |

#### Alternative flows

* Tách khỏi main flow tại bước 2.
* Điều kiện kích hoạt: Không có token.
* Các bước xử lý: Dispatch `setUnauthenticated`.
* Quay lại bước nào hoặc kết thúc: Kết thúc flow.

#### Error flows

* Bước xảy ra lỗi: Bước 3 hoặc 4.
* Nguyên nhân: Token lỗi, hết hạn hoặc API fail.
* Backend response: Error.
* Frontend response: `fetchUserProfileFailed`, clear user.
* Dữ liệu có thay đổi hay không: Auth state bị set unauthenticated.
* Có thể thử lại hay không: Có bằng login lại.
* Luồng kết thúc hoặc quay lại bước nào: Kết thúc unauthenticated.

#### Kết quả thành công

User được xem là authenticated.

#### Kết quả thất bại

User ở trạng thái unauthenticated.

#### Dữ liệu được tạo hoặc thay đổi

Redux auth state.

#### Trạng thái trước và sau

Trước: loading. Sau: authenticated hoặc unauthenticated.

#### UI states bắt buộc

* Initial: App mount.
* Loading: Checking access.
* Success: Render route.
* Error: Unauthenticated fallback.
* Empty: Not applicable.
* Unauthorized: Protected route redirect.
* Not found: Not applicable.
* Disabled hoặc confirmation khi áp dụng: Not applicable.

#### Frontend liên quan

`src/App.tsx`, `src/features/auth/store/initAuthEpic.ts`, `src/features/auth/store/authEpic.ts`.

#### Backend API liên quan

`GET /auth/me`.

#### Database entity liên quan

Không có database nội bộ.

#### Nguồn tham chiếu trong code

`src/App.tsx`, `src/features/auth/store/initAuthEpic.ts`.

#### Trạng thái triển khai project cũ

Partially implemented.

#### Điều kiện hoàn thành khi dựng lại

Xử lý token expiry, refresh/revoke và role claim.

#### Cần Technical Lead xác nhận

Cần Technical Lead xác nhận refresh token và storage strategy.

### AUTH-F03: Đăng xuất

#### Mục tiêu

Kết thúc phiên đăng nhập ở client.

#### Actor

Customer, Admin.

#### Feature liên quan

AUTH-03.

#### Business rules liên quan

AUTH-R04.

#### Điều kiện bắt đầu

User đang authenticated.

#### Điểm bắt đầu

Header avatar menu.

#### Dữ liệu cần có

Auth state và token local.

#### Main flow

| Bước | Actor | Hành động | Frontend | Backend | Dữ liệu hoặc trạng thái |
| ---- | ----- | --------- | -------- | ------- | ----------------------- |
| 1 | User | Click avatar | Mở logout dropdown | Không có | `showLogout=true` |
| 2 | User | Click logout | Dispatch `logout` | Không có | token local |
| 3 | Frontend | Clear auth | Xóa token, clear userData | Không có | unauthenticated |
| 4 | Frontend | Redirect | Navigate `/shop` | Không có | public route |

#### Alternative flows

* Tách khỏi main flow tại bước 1.
* Điều kiện kích hoạt: Click outside dropdown.
* Các bước xử lý: Đóng dropdown.
* Quay lại bước nào hoặc kết thúc: Kết thúc flow.

#### Error flows

Không có backend logout nên không có server error/revoke failure trong source.

#### Kết quả thành công

Token local bị xóa, user trở thành Guest state.

#### Kết quả thất bại

Không thấy failure handling trong source.

#### Dữ liệu được tạo hoặc thay đổi

`localStorage.accessToken`, Redux auth state.

#### Trạng thái trước và sau

Trước: authenticated. Sau: unauthenticated.

#### UI states bắt buộc

* Initial: Authenticated header.
* Loading: Not applicable.
* Success: Redirect `/shop`.
* Error: Not implemented.
* Empty: Not applicable.
* Unauthorized: Not applicable.
* Not found: Not applicable.
* Disabled hoặc confirmation khi áp dụng: Not applicable.

#### Frontend liên quan

`src/layouts/MainLayout.tsx`, `src/features/auth/store/authSlice.ts`.

#### Backend API liên quan

Không có.

#### Database entity liên quan

Không có.

#### Nguồn tham chiếu trong code

`src/layouts/MainLayout.tsx`, `src/features/auth/store/authSlice.ts`.

#### Trạng thái triển khai project cũ

Complete local.

#### Điều kiện hoàn thành khi dựng lại

Nếu backend dùng session/token revoke, logout phải gọi API revoke.

#### Cần Technical Lead xác nhận

Cần Technical Lead xác nhận logout có cần revoke token/session không.

## 6. Customer Flows

### USER-F01: Xem hồ sơ cá nhân

#### Mục tiêu

Customer hoặc Admin xem profile của chính mình.

#### Actor

Customer, Admin.

#### Feature liên quan

USER-01.

#### Business rules liên quan

AUTHZ-R01, USER-R01, USER-R02.

#### Điều kiện bắt đầu

User đã authenticated.

#### Điểm bắt đầu

`/profile`.

#### Dữ liệu cần có

`auth.userData`.

#### Main flow

| Bước | Actor | Hành động | Frontend | Backend | Dữ liệu hoặc trạng thái |
| ---- | ----- | --------- | -------- | ------- | ----------------------- |
| 1 | User | Mở `/profile` | `AuthMiddleware` kiểm tra auth | Không có | authenticated |
| 2 | Frontend | Render page | Đọc `auth.userData` | Không có | UserData |
| 3 | Frontend | Hiển thị profile | Render avatar/name/email/phone/dob/gender/address | Không có | Profile UI |

#### Alternative flows

* Tách khỏi main flow tại bước 1.
* Điều kiện kích hoạt: Auth loading.
* Các bước xử lý: Hiển thị checking access hoặc spinner.
* Quay lại bước nào hoặc kết thúc: Quay lại bước 2 khi auth resolve.

#### Error flows

* Bước xảy ra lỗi: Bước 2.
* Nguyên nhân: `userData` null.
* Backend response: Không gọi backend ở page.
* Frontend response: Hiển thị warning not logged in.
* Dữ liệu có thay đổi hay không: Không.
* Có thể thử lại hay không: Có bằng login lại.
* Luồng kết thúc hoặc quay lại bước nào: Kết thúc.

#### Kết quả thành công

Profile own data hiển thị.

#### Kết quả thất bại

User không xem được profile.

#### Dữ liệu được tạo hoặc thay đổi

Không có dữ liệu mới trong page; profile được load từ auth flow.

#### Trạng thái trước và sau

Trước: authenticated. Sau: profile visible.

#### UI states bắt buộc

* Initial: Profile route.
* Loading: Spinner/checking access.
* Success: Profile card.
* Error: Warning no userData.
* Empty: Not applicable.
* Unauthorized: Redirect login.
* Not found: Not applicable.
* Disabled hoặc confirmation khi áp dụng: Not applicable.

#### Frontend liên quan

`src/features/profile/pages/ProfilePage.tsx`, `src/features/auth/components/AuthMiddleware.tsx`.

#### Backend API liên quan

`GET /auth/me` trong auth flow.

#### Database entity liên quan

Không có database nội bộ.

#### Nguồn tham chiếu trong code

`src/features/profile/pages/ProfilePage.tsx`, `src/mappers/authMapper.ts`.

#### Trạng thái triển khai project cũ

Complete demo.

#### Điều kiện hoàn thành khi dựng lại

Backend phải trả own profile theo token/session. Admin không được tùy ý sửa auth credentials.

#### Cần Technical Lead xác nhận

Cần Technical Lead xác nhận user profile fields và chính sách cập nhật profile.

## 7. Product Discovery Flows

### PRODUCT-F01: Xem danh sách sản phẩm

#### Mục tiêu

Hiển thị catalog sản phẩm.

#### Actor

Guest state, Customer, Admin.

#### Feature liên quan

SHOP-01.

#### Business rules liên quan

SHOP-R01.

#### Điều kiện bắt đầu

User truy cập public route `/shop`.

#### Điểm bắt đầu

`/shop`.

#### Dữ liệu cần có

Product list từ API.

#### Main flow

| Bước | Actor | Hành động | Frontend | Backend | Dữ liệu hoặc trạng thái |
| ---- | ----- | --------- | -------- | ------- | ----------------------- |
| 1 | User | Mở `/shop` | Render `ShopPage` trong `MainLayout` | Không có | Public route |
| 2 | Frontend | Fetch products | React Query `useProducts` | `GET /products` | Raw products |
| 3 | Frontend | Map products | Clamp rating, normalize images | Không có | Product[] |
| 4 | Frontend | Render | Product grid hoặc skeleton/error/empty | Không có | UI state |

#### Alternative flows

* Tách khỏi main flow tại bước 4.
* Điều kiện kích hoạt: Có nhiều hơn 20 sản phẩm.
* Các bước xử lý: Pagination hiển thị.
* Quay lại bước nào hoặc kết thúc: Kết thúc ở product grid.

#### Error flows

* Bước xảy ra lỗi: Bước 2.
* Nguyên nhân: API lỗi.
* Backend response: Non-ok response hoặc network error.
* Frontend response: Hiển thị `fetchError.message`.
* Dữ liệu có thay đổi hay không: Không.
* Có thể thử lại hay không: Có bằng refetch/reload.
* Luồng kết thúc hoặc quay lại bước nào: Kết thúc error state.

#### Kết quả thành công

Product grid hiển thị.

#### Kết quả thất bại

Error state hoặc empty state.

#### Dữ liệu được tạo hoặc thay đổi

React Query cache.

#### Trạng thái trước và sau

Trước: loading. Sau: products loaded/error/empty.

#### UI states bắt buộc

* Initial: Shop page.
* Loading: Skeleton.
* Success: Product grid.
* Error: Error text.
* Empty: No products.
* Unauthorized: Not applicable.
* Not found: Not applicable.
* Disabled hoặc confirmation khi áp dụng: Not applicable.

#### Frontend liên quan

`src/features/shop/pages/ShopPage.tsx`, `src/features/shop/hooks/useProducts.ts`, `src/features/shop/components/ProductCard.tsx`.

#### Backend API liên quan

`GET /products`.

#### Database entity liên quan

Không có database nội bộ.

#### Nguồn tham chiếu trong code

`src/features/shop/pages/ShopPage.tsx`, `src/features/shop/api/productApi.ts`.

#### Trạng thái triển khai project cũ

Missing tests.

#### Điều kiện hoàn thành khi dựng lại

API catalog ổn định, loading/error/empty state và tests.

#### Cần Technical Lead xác nhận

Cần Technical Lead xác nhận product schema thật.

### SEARCH-F01: Tìm kiếm sản phẩm

#### Mục tiêu

Tìm sản phẩm theo keyword.

#### Actor

Guest state, Customer, Admin.

#### Feature liên quan

SHOP-02.

#### Business rules liên quan

SHOP-R02.

#### Điều kiện bắt đầu

User đang ở `/shop`.

#### Điểm bắt đầu

Search input.

#### Dữ liệu cần có

Search term.

#### Main flow

| Bước | Actor | Hành động | Frontend | Backend | Dữ liệu hoặc trạng thái |
| ---- | ----- | --------- | -------- | ------- | ----------------------- |
| 1 | User | Nhập keyword | Update `searchTerm` | Không có | input value |
| 2 | Frontend | Debounce 500ms | Set `debouncedSearch` | Không có | debounced keyword |
| 3 | Frontend | Keyword không rỗng | `useSearchProducts` enabled | `GET /products/search?q=...` | search results |
| 4 | Frontend | Render | Apply filter and pagination | Không có | Product grid |

#### Alternative flows

* Tách khỏi main flow tại bước 3.
* Điều kiện kích hoạt: Keyword rỗng hoặc whitespace.
* Các bước xử lý: Search query disabled, dùng all products.
* Quay lại bước nào hoặc kết thúc: Quay lại bước 1 khi user nhập keyword.

#### Error flows

* Bước xảy ra lỗi: Bước 3.
* Nguyên nhân: Search API lỗi.
* Backend response: Error.
* Frontend response: Error text.
* Dữ liệu có thay đổi hay không: Không.
* Có thể thử lại hay không: Có.
* Luồng kết thúc hoặc quay lại bước nào: Quay lại bước 1 hoặc reload.

#### Kết quả thành công

Kết quả search hiển thị.

#### Kết quả thất bại

Error hoặc no result.

#### Dữ liệu được tạo hoặc thay đổi

React Query cache, local search state.

#### Trạng thái trước và sau

Trước: all products. Sau: search results hoặc all products.

#### UI states bắt buộc

* Initial: Search input empty.
* Loading: React Query fetching.
* Success: Result grid.
* Error: Error text.
* Empty: No search result.
* Unauthorized: Not applicable.
* Not found: Not applicable.
* Disabled hoặc confirmation khi áp dụng: Not applicable.

#### Frontend liên quan

`src/features/shop/pages/ShopPage.tsx`, `src/features/shop/hooks/useProducts.ts`.

#### Backend API liên quan

`GET /products/search?q=...`.

#### Database entity liên quan

Không có database nội bộ.

#### Nguồn tham chiếu trong code

`src/features/shop/hooks/useProducts.ts`, `src/features/shop/api/productApi.ts`.

#### Trạng thái triển khai project cũ

Missing tests.

#### Điều kiện hoàn thành khi dựng lại

Search behavior có test và thống nhất server/client search.

#### Cần Technical Lead xác nhận

Cần Technical Lead xác nhận full-text search hay keyword search đơn giản.

### SEARCH-F02: Gợi ý tìm kiếm

#### Mục tiêu

Hiển thị gợi ý sản phẩm trong lúc user nhập search.

#### Actor

Guest state, Customer, Admin.

#### Feature liên quan

SHOP-03.

#### Business rules liên quan

SHOP-R03.

#### Điều kiện bắt đầu

User focus search input.

#### Điểm bắt đầu

Search autocomplete.

#### Dữ liệu cần có

Keyword.

#### Main flow

| Bước | Actor | Hành động | Frontend | Backend | Dữ liệu hoặc trạng thái |
| ---- | ----- | --------- | -------- | ------- | ----------------------- |
| 1 | User | Gõ keyword | Update input value | Không có | raw keyword |
| 2 | Frontend | Debounce 300ms | Set debounced keyword | Không có | debounced keyword |
| 3 | Frontend | Keyword không rỗng | `useSearchSuggest` enabled | `GET /products/search?q=...&limit=8` | suggestions |
| 4 | Frontend | Render dropdown | Hiển thị thumbnail/title/price | Không có | dropdown visible |
| 5 | User | Chọn item | Set search and navigate slug | Không có | `/shop/:slug` |

#### Alternative flows

* Tách khỏi main flow tại bước 4.
* Điều kiện kích hoạt: User click outside.
* Các bước xử lý: Dropdown đóng.
* Quay lại bước nào hoặc kết thúc: Kết thúc flow.

#### Error flows

* Bước xảy ra lỗi: Bước 3.
* Nguyên nhân: Suggest API lỗi.
* Backend response: Error.
* Frontend response: Hiện tại error UI chưa rõ.
* Dữ liệu có thay đổi hay không: Không.
* Có thể thử lại hay không: Có bằng nhập lại.
* Luồng kết thúc hoặc quay lại bước nào: Quay lại bước 1.

#### Kết quả thành công

Dropdown gợi ý hiển thị và có thể navigate đến product detail.

#### Kết quả thất bại

Không có gợi ý hoặc không có error UI rõ.

#### Dữ liệu được tạo hoặc thay đổi

Local component state, React Query suggest cache.

#### Trạng thái trước và sau

Trước: dropdown hidden. Sau: dropdown visible hoặc route detail.

#### UI states bắt buộc

* Initial: Input.
* Loading: Spinner row.
* Success: Suggestion list.
* Error: Cần bổ sung.
* Empty: Dropdown hidden.
* Unauthorized: Not applicable.
* Not found: Not applicable.
* Disabled hoặc confirmation khi áp dụng: Not applicable.

#### Frontend liên quan

`src/features/shop/components/SearchAutocomplete.tsx`, `src/features/shop/hooks/useSearchSuggest.ts`.

#### Backend API liên quan

`GET /products/search?q=...&limit=8`.

#### Database entity liên quan

Không có database nội bộ.

#### Nguồn tham chiếu trong code

`src/features/shop/components/SearchAutocomplete.tsx`, `src/features/shop/api/searchSuggestApi.ts`.

#### Trạng thái triển khai project cũ

Missing tests.

#### Điều kiện hoàn thành khi dựng lại

Có loading, empty, error UI và test autocomplete.

#### Cần Technical Lead xác nhận

Cần Technical Lead xác nhận ranking và số lượng gợi ý.

### FILTER-F01: Lọc sản phẩm theo giá và rating

#### Mục tiêu

Thu hẹp danh sách sản phẩm theo khoảng giá và rating.

#### Actor

Guest state, Customer, Admin.

#### Feature liên quan

SHOP-04.

#### Business rules liên quan

SHOP-R04.

#### Điều kiện bắt đầu

Danh sách sản phẩm hoặc search results đã có.

#### Điểm bắt đầu

Filter button trên shop.

#### Dữ liệu cần có

`priceFrom`, `priceTo`, `ratingFrom`, `ratingTo`.

#### Main flow

| Bước | Actor | Hành động | Frontend | Backend | Dữ liệu hoặc trạng thái |
| ---- | ----- | --------- | -------- | ------- | ----------------------- |
| 1 | User | Click filter | Mở Popover | Không có | `filterOpen=true` |
| 2 | User | Chọn khoảng lọc | Update `FilterState` | Không có | filter state |
| 3 | Frontend | Apply filter | Client-side filter products | Không có | filteredProducts |
| 4 | Frontend | Reset page | Set `currentPage=1` | Không có | paginatedProducts |

#### Alternative flows

* Tách khỏi main flow tại bước 2.
* Điều kiện kích hoạt: User click reset.
* Các bước xử lý: Set `DEFAULT_FILTER`.
* Quay lại bước nào hoặc kết thúc: Quay lại bước 3.

#### Error flows

* Bước xảy ra lỗi: Bước 3.
* Nguyên nhân: Không có sản phẩm khớp filter.
* Backend response: Không có backend.
* Frontend response: Hiển thị no result.
* Dữ liệu có thay đổi hay không: Filter state thay đổi, product source không đổi.
* Có thể thử lại hay không: Có bằng reset/chọn filter khác.
* Luồng kết thúc hoặc quay lại bước nào: Quay lại bước 2.

#### Kết quả thành công

Filtered product list hiển thị.

#### Kết quả thất bại

No result.

#### Dữ liệu được tạo hoặc thay đổi

Local filter state.

#### Trạng thái trước và sau

Trước: unfiltered/current products. Sau: filtered products.

#### UI states bắt buộc

* Initial: Filter closed.
* Loading: Not applicable.
* Success: Filtered grid.
* Error: Not applicable.
* Empty: No result.
* Unauthorized: Not applicable.
* Not found: Not applicable.
* Disabled hoặc confirmation khi áp dụng: Not applicable.

#### Frontend liên quan

`src/features/shop/components/FilterPopover.tsx`, `src/features/shop/pages/ShopPage.tsx`.

#### Backend API liên quan

Không có.

#### Database entity liên quan

Không có.

#### Nguồn tham chiếu trong code

`src/features/shop/components/FilterPopover.tsx`.

#### Trạng thái triển khai project cũ

Frontend only.

#### Điều kiện hoàn thành khi dựng lại

Quyết định filter client-side hoặc server-side và test behavior.

#### Cần Technical Lead xác nhận

Cần Technical Lead xác nhận khoảng giá/rating thật.

### PAGINATION-F01: Phân trang sản phẩm

#### Mục tiêu

Chia danh sách sản phẩm thành các trang.

#### Actor

Guest state, Customer, Admin.

#### Feature liên quan

SHOP-05.

#### Business rules liên quan

SHOP-R05.

#### Điều kiện bắt đầu

Danh sách sau filter/search có nhiều hơn một trang.

#### Điểm bắt đầu

Pagination footer hoặc phím mũi tên.

#### Dữ liệu cần có

`currentPage`, `totalPages`, `filteredProducts`.

#### Main flow

| Bước | Actor | Hành động | Frontend | Backend | Dữ liệu hoặc trạng thái |
| ---- | ----- | --------- | -------- | ------- | ----------------------- |
| 1 | User | Click page/prev/next | Validate page range | Không có | requested page |
| 2 | Frontend | Page hợp lệ | Set `currentPage` | Không có | currentPage |
| 3 | Frontend | Slice list | Render page data | Không có | paginatedProducts |

#### Alternative flows

* Tách khỏi main flow tại bước 1.
* Điều kiện kích hoạt: User nhấn ArrowLeft/ArrowRight ngoài input.
* Các bước xử lý: Chuyển page nếu còn page trước/sau.
* Quay lại bước nào hoặc kết thúc: Quay lại bước 2.

#### Error flows

* Bước xảy ra lỗi: Bước 1.
* Nguyên nhân: Page ngoài `[1,totalPages]`.
* Backend response: Không có.
* Frontend response: Không cập nhật page.
* Dữ liệu có thay đổi hay không: Không.
* Có thể thử lại hay không: Có.
* Luồng kết thúc hoặc quay lại bước nào: Quay lại bước 1.

#### Kết quả thành công

Trang hiện tại thay đổi.

#### Kết quả thất bại

Không đổi trang.

#### Dữ liệu được tạo hoặc thay đổi

Local `currentPage`.

#### Trạng thái trước và sau

Trước: page cũ. Sau: page mới.

#### UI states bắt buộc

* Initial: Current page.
* Loading: Not applicable.
* Success: New page.
* Error: Not applicable.
* Empty: Pagination hidden nếu <= 1 page.
* Unauthorized: Not applicable.
* Not found: Not applicable.
* Disabled hoặc confirmation khi áp dụng: Prev/Next disabled ở boundary.

#### Frontend liên quan

`src/components/ui/Pagination.tsx`, `src/features/shop/pages/ShopPage.tsx`.

#### Backend API liên quan

Không có.

#### Database entity liên quan

Không có.

#### Nguồn tham chiếu trong code

`src/components/ui/Pagination.tsx`, `src/__tests__/components/shop/Pagination.test.tsx`.

#### Trạng thái triển khai project cũ

Complete local.

#### Điều kiện hoàn thành khi dựng lại

Server-side pagination nếu dataset lớn.

#### Cần Technical Lead xác nhận

Cần Technical Lead xác nhận client-side hay server-side pagination.

### PRODUCT-F02: Xem chi tiết sản phẩm

#### Mục tiêu

Hiển thị thông tin chi tiết sản phẩm.

#### Actor

Guest state, Customer, Admin.

#### Feature liên quan

PROD-01.

#### Business rules liên quan

PROD-R01.

#### Điều kiện bắt đầu

User chọn sản phẩm từ shop hoặc search suggest.

#### Điểm bắt đầu

`/shop/:slug`.

#### Dữ liệu cần có

Slug sản phẩm.

#### Main flow

| Bước | Actor | Hành động | Frontend | Backend | Dữ liệu hoặc trạng thái |
| ---- | ----- | --------- | -------- | ------- | ----------------------- |
| 1 | User | Click product | Navigate `/shop/:slug` | Không có | slug |
| 2 | Frontend | Resolve slug | Search theo slug text | `GET /products/search?q=...` | candidate products |
| 3 | Frontend | Match product | `slugify(title) === slug` | Không có | productId |
| 4 | Frontend | Fetch detail | `useProductById` | `GET /products/:id` | product detail |
| 5 | Frontend | Render detail | Hiển thị gallery, price, rating, actions | Không có | detail UI |

#### Alternative flows

* Tách khỏi main flow tại bước 5.
* Điều kiện kích hoạt: User click back breadcrumb.
* Các bước xử lý: Navigate về `/shop`.
* Quay lại bước nào hoặc kết thúc: Kết thúc flow.

#### Error flows

* Bước xảy ra lỗi: Bước 2 hoặc 4.
* Nguyên nhân: API lỗi.
* Backend response: Error.
* Frontend response: Hiển thị error text.
* Dữ liệu có thay đổi hay không: Không.
* Có thể thử lại hay không: Có bằng reload.
* Luồng kết thúc hoặc quay lại bước nào: Kết thúc error state.

* Bước xảy ra lỗi: Bước 3.
* Nguyên nhân: Không match slug.
* Backend response: Search có thể trả empty hoặc không có product phù hợp.
* Frontend response: Not-found state chưa rõ.
* Dữ liệu có thay đổi hay không: Không.
* Có thể thử lại hay không: Có bằng quay lại shop.
* Luồng kết thúc hoặc quay lại bước nào: Kết thúc không rõ. Cần Technical Lead xác nhận.

#### Kết quả thành công

Product detail hiển thị.

#### Kết quả thất bại

Error hoặc not-found không rõ.

#### Dữ liệu được tạo hoặc thay đổi

React Query detail cache, local image/color state.

#### Trạng thái trước và sau

Trước: URL slug. Sau: product detail loaded/error.

#### UI states bắt buộc

* Initial: Detail route.
* Loading: Spinner.
* Success: Product detail.
* Error: Error text.
* Empty: Not applicable.
* Unauthorized: Not applicable.
* Not found: Cần bổ sung.
* Disabled hoặc confirmation khi áp dụng: Not applicable.

#### Frontend liên quan

`src/features/shop/pages/ProductDetailPage.tsx`.

#### Backend API liên quan

`GET /products/search?q=...`, `GET /products/:id`.

#### Database entity liên quan

Không có database nội bộ.

#### Nguồn tham chiếu trong code

`src/features/shop/pages/ProductDetailPage.tsx`, `src/utils/slugify.ts`.

#### Trạng thái triển khai project cũ

Partially implemented.

#### Điều kiện hoàn thành khi dựng lại

Endpoint detail ổn định, route canonical, not-found UI.

#### Cần Technical Lead xác nhận

Cần Technical Lead xác nhận dùng id, slug hay cả hai.

### PRODUCT-F03: Chọn màu và ảnh sản phẩm

#### Mục tiêu

Cho phép user xem ảnh theo màu/thumbnail.

#### Actor

Guest state, Customer, Admin.

#### Feature liên quan

PROD-02.

#### Business rules liên quan

PROD-R02.

#### Điều kiện bắt đầu

Product detail đã load.

#### Điểm bắt đầu

Color buttons, arrow buttons hoặc thumbnails.

#### Dữ liệu cần có

Product images và colors.

#### Main flow

| Bước | Actor | Hành động | Frontend | Backend | Dữ liệu hoặc trạng thái |
| ---- | ----- | --------- | -------- | ------- | ----------------------- |
| 1 | User | Click color | Set selectedColorIndex | Không có | selected color |
| 2 | Frontend | Sync image | Set currentImageIndex | Không có | current image |
| 3 | User | Click arrow/thumbnail | Update image/color index | Không có | gallery state |

#### Alternative flows

* Tách khỏi main flow tại bước 1.
* Điều kiện kích hoạt: Product không có colors.
* Các bước xử lý: Dùng default colors từ translation.
* Quay lại bước nào hoặc kết thúc: Quay lại bước 1.

#### Error flows

* Bước xảy ra lỗi: Trước bước 1.
* Nguyên nhân: Images thiếu.
* Backend response: Không có API riêng.
* Frontend response: Dùng fallback image nếu thiếu theo color.
* Dữ liệu có thay đổi hay không: Local fallback image array.
* Có thể thử lại hay không: Không cần.
* Luồng kết thúc hoặc quay lại bước nào: Quay lại bước 1.

#### Kết quả thành công

Selected color/image hiển thị.

#### Kết quả thất bại

UI có thể không đầy đủ nếu images rỗng. Cần Technical Lead xác nhận.

#### Dữ liệu được tạo hoặc thay đổi

Local selected color/image state.

#### Trạng thái trước và sau

Trước: default selected index. Sau: selected index mới.

#### UI states bắt buộc

* Initial: Default color/image.
* Loading: Covered by detail loading.
* Success: Selected image/color.
* Error: Fallback image.
* Empty: Nếu không có images.
* Unauthorized: Not applicable.
* Not found: Not applicable.
* Disabled hoặc confirmation khi áp dụng: Arrow disabled/not active khi <=1 image nếu cần.

#### Frontend liên quan

`src/features/shop/pages/ProductDetailPage.tsx`.

#### Backend API liên quan

Không có API riêng.

#### Database entity liên quan

Không có database nội bộ.

#### Nguồn tham chiếu trong code

`src/features/shop/pages/ProductDetailPage.tsx`, `src/types/product.types.ts`.

#### Trạng thái triển khai project cũ

Frontend only.

#### Điều kiện hoàn thành khi dựng lại

Schema variant/color/image rõ ràng.

#### Cần Technical Lead xác nhận

Cần Technical Lead xác nhận variant/color có phải domain thật không.

## 8. Cart Flows

### CART-F01: Thêm sản phẩm vào giỏ

#### Mục tiêu

Customer thêm sản phẩm vào giỏ hàng.

#### Actor

Customer.

#### Feature liên quan

CART-01.

#### Business rules liên quan

AUTHZ-R02, CART-R01, CART-R02, DUP-R01.

#### Điều kiện bắt đầu

Customer authenticated.

#### Điểm bắt đầu

Product card hoặc product detail.

#### Dữ liệu cần có

Product và selected color.

#### Main flow

| Bước | Actor | Hành động | Frontend | Backend | Dữ liệu hoặc trạng thái |
| ---- | ----- | --------- | -------- | ------- | ----------------------- |
| 1 | Customer | Click add to cart | `useRequireAuth` cho callback | Không có | authenticated |
| 2 | Frontend | Dispatch add | `addToCart({ product, color })` | Không có | product, color |
| 3 | Store | Check duplicate | Tìm item cùng id và color | Không có | cartList |
| 4 | Store | Add hoặc increment | Push item mới hoặc quantity +1 | Không có | persisted cart |
| 5 | UI | Notify | `cartBatchEpic` success message | Không có | notification |

#### Alternative flows

* Tách khỏi main flow tại bước 3.
* Điều kiện kích hoạt: Cart đã có item cùng product id và color.
* Các bước xử lý: Tăng quantity thay vì thêm dòng mới.
* Quay lại bước nào hoặc kết thúc: Quay lại bước 5.

* Tách khỏi main flow tại bước 2.
* Điều kiện kích hoạt: Add từ ProductCard không có color.
* Các bước xử lý: Dùng `product.colors[0]` hoặc `"Default"`.
* Quay lại bước nào hoặc kết thúc: Quay lại bước 3.

#### Error flows

* Bước xảy ra lỗi: Không có backend step.
* Nguyên nhân: Không có stock/server validation.
* Backend response: Không có.
* Frontend response: Không có rollback.
* Dữ liệu có thay đổi hay không: Cart local thay đổi.
* Có thể thử lại hay không: Có.
* Luồng kết thúc hoặc quay lại bước nào: Kết thúc.

#### Kết quả thành công

Cart local được cập nhật.

#### Kết quả thất bại

Guest bị redirect login theo CART-F02.

#### Dữ liệu được tạo hoặc thay đổi

Redux persisted cart.

#### Trạng thái trước và sau

Trước: cart cũ. Sau: cart có item mới hoặc quantity tăng.

#### UI states bắt buộc

* Initial: Product card/detail.
* Loading: Not applicable.
* Success: Notification.
* Error: Not implemented.
* Empty: Not applicable.
* Unauthorized: Redirect login.
* Not found: Not applicable.
* Disabled hoặc confirmation khi áp dụng: Not applicable.

#### Frontend liên quan

`src/features/shop/components/ProductCard.tsx`, `src/features/shop/pages/ProductDetailPage.tsx`, `src/features/cart/store/cartSlice.ts`, `src/features/cart/store/cartEpic.ts`.

#### Backend API liên quan

Không có.

#### Database entity liên quan

Không có.

#### Nguồn tham chiếu trong code

`src/features/cart/store/cartSlice.ts`, `src/features/cart/store/cartEpic.ts`.

#### Trạng thái triển khai project cũ

Frontend only.

#### Điều kiện hoàn thành khi dựng lại

Server-side cart hoặc ownership/stock validation nếu cart được lưu backend.

#### Cần Technical Lead xác nhận

Cần Technical Lead xác nhận cart local hay server-side.

### CART-F03: Xem và cập nhật giỏ hàng

#### Mục tiêu

Customer xem cart, tăng/giảm/sửa quantity.

#### Actor

Customer.

#### Feature liên quan

CART-02.

#### Business rules liên quan

CART-R03, CART-R04, VALIDATION-R02.

#### Điều kiện bắt đầu

Customer authenticated.

#### Điểm bắt đầu

`/cart`.

#### Dữ liệu cần có

Redux cart list.

#### Main flow

| Bước | Actor | Hành động | Frontend | Backend | Dữ liệu hoặc trạng thái |
| ---- | ----- | --------- | -------- | ------- | ----------------------- |
| 1 | Customer | Mở `/cart` | `AuthMiddleware` kiểm tra auth | Không có | authenticated |
| 2 | Frontend | Render cart | Đọc Redux cart | Không có | cartList |
| 3 | Customer | Tăng/giảm/sửa quantity | `QuantityControl` callback | Không có | newQuantity |
| 4 | Store | Update quantity | Set quantity hoặc remove nếu <1 | Không có | cartList mới |
| 5 | Frontend | Render totals | Selectors tính subtotal/tax/total | Không có | billing |

#### Alternative flows

* Tách khỏi main flow tại bước 2.
* Điều kiện kích hoạt: Cart rỗng.
* Các bước xử lý: Hiển thị empty message.
* Quay lại bước nào hoặc kết thúc: Kết thúc empty state.

#### Error flows

* Bước xảy ra lỗi: Bước 3.
* Nguyên nhân: User nhập NaN, rỗng hoặc <= 0.
* Backend response: Không có.
* Frontend response: `onChange` không dispatch nếu invalid.
* Dữ liệu có thay đổi hay không: Store không đổi.
* Có thể thử lại hay không: Có.
* Luồng kết thúc hoặc quay lại bước nào: Quay lại bước 3.

#### Kết quả thành công

Cart local và totals cập nhật.

#### Kết quả thất bại

Cart không đổi hoặc item bị xóa nếu quantity < 1 qua reducer.

#### Dữ liệu được tạo hoặc thay đổi

Redux persisted cart.

#### Trạng thái trước và sau

Trước: cart cũ. Sau: cart mới.

#### UI states bắt buộc

* Initial: Cart page.
* Loading: Not applicable.
* Success: Updated cart.
* Error: Not implemented.
* Empty: Empty cart.
* Unauthorized: Redirect login.
* Not found: Not applicable.
* Disabled hoặc confirmation khi áp dụng: Not applicable.

#### Frontend liên quan

`src/features/cart/pages/CartPage.tsx`, `src/components/ui/QuantityControl.tsx`, `src/features/cart/store/cartSlice.ts`.

#### Backend API liên quan

Không có.

#### Database entity liên quan

Không có.

#### Nguồn tham chiếu trong code

`src/features/cart/pages/CartPage.tsx`, `src/features/cart/store/cartSlice.ts`.

#### Trạng thái triển khai project cũ

Frontend only.

#### Điều kiện hoàn thành khi dựng lại

Backend cart ownership/stock validation nếu lưu server-side.

#### Cần Technical Lead xác nhận

Cần Technical Lead xác nhận stock limit và cart persistence.

### CART-F04: Xóa item khỏi giỏ

#### Mục tiêu

Customer xóa một item khỏi cart.

#### Actor

Customer.

#### Feature liên quan

CART-02.

#### Business rules liên quan

CART-R04.

#### Điều kiện bắt đầu

Cart có item.

#### Điểm bắt đầu

Remove button trên cart item.

#### Dữ liệu cần có

`productId`, `selectedColor`.

#### Main flow

| Bước | Actor | Hành động | Frontend | Backend | Dữ liệu hoặc trạng thái |
| ---- | ----- | --------- | -------- | ------- | ----------------------- |
| 1 | Customer | Click remove | Dispatch `removeFromCart` | Không có | productId, color |
| 2 | Store | Filter cart | Xóa item khớp id + color | Không có | cartList mới |
| 3 | Frontend | Render | Cart/totals cập nhật | Không có | UI mới |

#### Alternative flows

* Tách khỏi main flow tại bước 1.
* Điều kiện kích hoạt: Quantity giảm từ 1 xuống 0.
* Các bước xử lý: `updateQuantity` cũng xóa item.
* Quay lại bước nào hoặc kết thúc: Quay lại bước 3.

#### Error flows

* Bước xảy ra lỗi: Bước 2.
* Nguyên nhân: Item không khớp id + color.
* Backend response: Không có.
* Frontend response: Store không đổi.
* Dữ liệu có thay đổi hay không: Không.
* Có thể thử lại hay không: Có.
* Luồng kết thúc hoặc quay lại bước nào: Quay lại bước 1.

#### Kết quả thành công

Item bị xóa khỏi cart.

#### Kết quả thất bại

Cart không đổi.

#### Dữ liệu được tạo hoặc thay đổi

Redux persisted cart.

#### Trạng thái trước và sau

Trước: cart có item. Sau: cart không còn item đó.

#### UI states bắt buộc

* Initial: Cart item visible.
* Loading: Not applicable.
* Success: Item removed.
* Error: Not implemented.
* Empty: Cart empty nếu xóa item cuối.
* Unauthorized: Redirect login.
* Not found: Not applicable.
* Disabled hoặc confirmation khi áp dụng: Không có confirmation.

#### Frontend liên quan

`src/features/cart/pages/CartPage.tsx`, `src/features/cart/store/cartSlice.ts`.

#### Backend API liên quan

Không có.

#### Database entity liên quan

Không có.

#### Nguồn tham chiếu trong code

`src/features/cart/store/cartSlice.ts`, `src/__tests__/store/cart/cartSlice.test.ts`.

#### Trạng thái triển khai project cũ

Frontend only.

#### Điều kiện hoàn thành khi dựng lại

Nếu server cart, delete phải enforce ownership.

#### Cần Technical Lead xác nhận

Cần Technical Lead xác nhận có cần confirmation khi xóa item không.

### CART-F05: Xem tổng tiền giỏ hàng

#### Mục tiêu

Hiển thị subtotal, tax và total của cart.

#### Actor

Customer.

#### Feature liên quan

CART-03.

#### Business rules liên quan

CART-R05, PRICE-R01.

#### Điều kiện bắt đầu

Cart page có cart data.

#### Điểm bắt đầu

`/cart`.

#### Dữ liệu cần có

Cart items gồm `price`, `quantity`.

#### Main flow

| Bước | Actor | Hành động | Frontend | Backend | Dữ liệu hoặc trạng thái |
| ---- | ----- | --------- | -------- | ------- | ----------------------- |
| 1 | Frontend | Đọc cart | Selector `selectCartTotals` | Không có | cartList |
| 2 | Frontend | Tính subtotal | Sum `price * quantity` | Không có | subTotal |
| 3 | Frontend | Tính tax | `Math.round(subTotal * 0.1)` | Không có | tax |
| 4 | Frontend | Render | Hiển thị subtotal, tax, total | Không có | billing UI |

#### Alternative flows

* Tách khỏi main flow tại bước 1.
* Điều kiện kích hoạt: Cart rỗng.
* Các bước xử lý: Totals bằng 0, CartPage hiển thị empty message.
* Quay lại bước nào hoặc kết thúc: Kết thúc empty state.

#### Error flows

Không có error flow trong source vì totals tính client-side.

#### Kết quả thành công

Billing section hiển thị.

#### Kết quả thất bại

Không có.

#### Dữ liệu được tạo hoặc thay đổi

Không thay đổi dữ liệu; chỉ derived values.

#### Trạng thái trước và sau

Trước: cartList. Sau: totals derived.

#### UI states bắt buộc

* Initial: Cart page.
* Loading: Not applicable.
* Success: Billing visible.
* Error: Not implemented.
* Empty: Empty cart.
* Unauthorized: Redirect login.
* Not found: Not applicable.
* Disabled hoặc confirmation khi áp dụng: Not applicable.

#### Frontend liên quan

`src/features/cart/store/cartSelectors.ts`, `src/features/cart/pages/CartPage.tsx`.

#### Backend API liên quan

Không có.

#### Database entity liên quan

Không có.

#### Nguồn tham chiếu trong code

`src/features/cart/store/cartSelectors.ts`.

#### Trạng thái triển khai project cũ

Complete local.

#### Điều kiện hoàn thành khi dựng lại

Backend phải là nguồn tính giá/tax nếu có checkout/order.

#### Cần Technical Lead xác nhận

Cần Technical Lead xác nhận tax 10% là rule thật hay placeholder.

## 9. Checkout and Payment Flows

Không có checkout hoặc payment flow trong source hiện tại.

Luồng còn thiếu nếu dựng lại:

- Mở checkout từ cart.
- Kiểm tra đăng nhập.
- Kiểm tra cart rỗng.
- Revalidate sản phẩm, giá và tồn kho từ backend.
- Chọn hoặc tạo địa chỉ giao hàng.
- Chọn phương thức thanh toán.
- Tạo đơn hàng.
- Xử lý thanh toán.
- Cập nhật tồn kho.
- Cập nhật cart sau đặt hàng.
- Điều hướng đến kết quả thanh toán/đơn hàng.

`Buy Now` hiện tại chỉ thêm sản phẩm vào cart rồi navigate `/cart`, không phải checkout.

## 10. Order Flows

Không có order module trong source hiện tại.

Theo `roles.md`:

- Customer chỉ được xem và thao tác đơn hàng của chính mình.
- Admin được quản lý đơn hàng trong managed scope.
- Quyền hủy đơn phải phụ thuộc trạng thái đơn hàng theo `business-rules.md`.

Cần Technical Lead xác nhận order statuses và state transitions trước khi viết flow chi tiết cho hủy đơn, xem lịch sử đơn, xem chi tiết đơn và admin order management.

## 11. Review Flows

Không có review flow trong source hiện tại.

Không phát hiện:

- Review entity.
- Review route.
- Review form.
- API tạo/sửa/xóa review.
- Rule đánh giá sau khi mua.

## 12. Admin Flows

### ADMIN-PRODUCT-F01: Thêm sản phẩm

#### Mục tiêu

Admin tạo sản phẩm mới.

#### Actor

Admin.

#### Feature liên quan

SHOP-06.

#### Business rules liên quan

AUTHZ-R03, SHOP-R06, VALIDATION-R01.

#### Điều kiện bắt đầu

Admin đã authenticated. Source hiện tại chưa enforce Admin role.

#### Điểm bắt đầu

Add product button trên `/shop`.

#### Dữ liệu cần có

Title, price, rating, thumbnail.

#### Main flow

| Bước | Actor | Hành động | Frontend | Backend | Dữ liệu hoặc trạng thái |
| ---- | ----- | --------- | -------- | ------- | ----------------------- |
| 1 | Admin | Click add product | Mở `ProductModal` | Không có | `showModal=true` |
| 2 | Admin | Nhập form | Validate title/price/rating | Không có | formData |
| 3 | Admin | Submit | `createMutation` | `POST /products/add` | product payload |
| 4 | Backend | Trả product | React Query onSuccess | DummyJSON | created product |
| 5 | Frontend | Update UI | Đóng modal, success message, invalidate list | Không có | product list refetch |

#### Alternative flows

* Tách khỏi main flow tại bước 1.
* Điều kiện kích hoạt: User cancel modal.
* Các bước xử lý: Đóng modal, reset editingProduct.
* Quay lại bước nào hoặc kết thúc: Kết thúc flow.

#### Error flows

* Bước xảy ra lỗi: Bước 2.
* Nguyên nhân: Thiếu title hoặc price.
* Backend response: Không gọi backend.
* Frontend response: Form validation message.
* Dữ liệu có thay đổi hay không: Không.
* Có thể thử lại hay không: Có.
* Luồng kết thúc hoặc quay lại bước nào: Quay lại bước 2.

* Bước xảy ra lỗi: Bước 3.
* Nguyên nhân: API create lỗi.
* Backend response: Error.
* Frontend response: Message `Create failed`.
* Dữ liệu có thay đổi hay không: Không xác định với DummyJSON; UI không close modal nếu onError.
* Có thể thử lại hay không: Có.
* Luồng kết thúc hoặc quay lại bước nào: Quay lại bước 2.

#### Kết quả thành công

Product được tạo theo API và list invalidated.

#### Kết quả thất bại

Modal còn mở hoặc error message hiển thị.

#### Dữ liệu được tạo hoặc thay đổi

DummyJSON product response, React Query cache invalidation.

#### Trạng thái trước và sau

Trước: product list. Sau: product list refetched.

#### UI states bắt buộc

* Initial: Shop page.
* Loading: Mutation loading.
* Success: Message success.
* Error: Message error.
* Empty: Not applicable.
* Unauthorized: Cần bổ sung Admin enforcement.
* Not found: Not applicable.
* Disabled hoặc confirmation khi áp dụng: Submit loading, cancel disabled khi loading.

#### Frontend liên quan

`src/features/shop/pages/ShopPage.tsx`, `src/features/shop/components/ProductModal.tsx`.

#### Backend API liên quan

`POST /products/add`.

#### Database entity liên quan

Không có database nội bộ.

#### Nguồn tham chiếu trong code

`src/features/shop/pages/ShopPage.tsx`, `src/features/shop/api/productApi.ts`.

#### Trạng thái triển khai project cũ

Missing authorization.

#### Điều kiện hoàn thành khi dựng lại

Admin-only frontend route/action và backend Admin role enforcement.

#### Cần Technical Lead xác nhận

Cần Technical Lead xác nhận Admin route và product required fields.

### ADMIN-PRODUCT-F02: Sửa sản phẩm

#### Mục tiêu

Admin cập nhật thông tin sản phẩm.

#### Actor

Admin.

#### Feature liên quan

SHOP-07.

#### Business rules liên quan

AUTHZ-R03, SHOP-R06, VALIDATION-R01.

#### Điều kiện bắt đầu

Admin đã authenticated. Source hiện tại chưa enforce Admin role.

#### Điểm bắt đầu

Edit button trên product card.

#### Dữ liệu cần có

Product id và form data.

#### Main flow

| Bước | Actor | Hành động | Frontend | Backend | Dữ liệu hoặc trạng thái |
| ---- | ----- | --------- | -------- | ------- | ----------------------- |
| 1 | Admin | Click edit | Mở ProductModal với product data | Không có | editingProduct |
| 2 | Admin | Cập nhật form | Validate title/price/rating | Không có | formData |
| 3 | Admin | Submit | `updateMutation` | `PUT /products/:id` | id, patch data |
| 4 | Frontend | Success | Update detail cache, invalidate list | DummyJSON | updated product |
| 5 | Frontend | Close modal | Message success | Không có | UI updated |

#### Alternative flows

* Tách khỏi main flow tại bước 1.
* Điều kiện kích hoạt: User cancel.
* Các bước xử lý: Đóng modal.
* Quay lại bước nào hoặc kết thúc: Kết thúc flow.

#### Error flows

* Bước xảy ra lỗi: Bước 3.
* Nguyên nhân: API update lỗi.
* Backend response: Error.
* Frontend response: Message `Update failed`.
* Dữ liệu có thay đổi hay không: Cache không update nếu mutation fail.
* Có thể thử lại hay không: Có.
* Luồng kết thúc hoặc quay lại bước nào: Quay lại bước 2.

#### Kết quả thành công

Product cache/list được cập nhật/refetch.

#### Kết quả thất bại

Không update product.

#### Dữ liệu được tạo hoặc thay đổi

React Query detail cache và list invalidation.

#### Trạng thái trước và sau

Trước: product cũ. Sau: product updated.

#### UI states bắt buộc

* Initial: Product card.
* Loading: Mutation loading.
* Success: Success message.
* Error: Error message.
* Empty: Not applicable.
* Unauthorized: Cần bổ sung Admin enforcement.
* Not found: Cần xử lý nếu product không tồn tại.
* Disabled hoặc confirmation khi áp dụng: Submit loading.

#### Frontend liên quan

`src/features/shop/pages/ShopPage.tsx`, `src/features/shop/components/ProductModal.tsx`.

#### Backend API liên quan

`PUT /products/:id`.

#### Database entity liên quan

Không có database nội bộ.

#### Nguồn tham chiếu trong code

`src/features/shop/hooks/useProducts.ts`, `src/features/shop/api/productApi.ts`.

#### Trạng thái triển khai project cũ

Missing authorization.

#### Điều kiện hoàn thành khi dựng lại

Backend Admin role enforcement, product existence check, validation.

#### Cần Technical Lead xác nhận

Cần Technical Lead xác nhận field nào Admin được phép sửa.

### ADMIN-PRODUCT-F03: Xóa sản phẩm

#### Mục tiêu

Admin xóa sản phẩm khỏi catalog.

#### Actor

Admin.

#### Feature liên quan

SHOP-08.

#### Business rules liên quan

AUTHZ-R03, SHOP-R06.

#### Điều kiện bắt đầu

Admin đã authenticated. Source hiện tại chưa enforce Admin role.

#### Điểm bắt đầu

Delete button trên product card.

#### Dữ liệu cần có

Product id.

#### Main flow

| Bước | Actor | Hành động | Frontend | Backend | Dữ liệu hoặc trạng thái |
| ---- | ----- | --------- | -------- | ------- | ----------------------- |
| 1 | Admin | Click delete | Mở confirm modal | Không có | productId |
| 2 | Admin | Confirm | `deleteMutation` | `DELETE /products/:id` | productId |
| 3 | Frontend | Optimistic update | Remove product khỏi list cache | Không có | previousProducts backup |
| 4 | Backend | Success | Mutation settled | DummyJSON | delete response |
| 5 | Frontend | Finalize | Message success, invalidate list | Không có | list refetch |

#### Alternative flows

* Tách khỏi main flow tại bước 1.
* Điều kiện kích hoạt: Admin cancel confirm.
* Các bước xử lý: Đóng confirm modal, không gọi API.
* Quay lại bước nào hoặc kết thúc: Kết thúc flow.

#### Error flows

* Bước xảy ra lỗi: Bước 2 hoặc 4.
* Nguyên nhân: API delete lỗi.
* Backend response: Error.
* Frontend response: Message `Delete failed`.
* Dữ liệu có thay đổi hay không: Rollback `previousProducts` nếu có.
* Có thể thử lại hay không: Có.
* Luồng kết thúc hoặc quay lại bước nào: Quay lại bước 1.

#### Kết quả thành công

Product bị xóa khỏi list hiển thị.

#### Kết quả thất bại

Product list rollback hoặc không đổi.

#### Dữ liệu được tạo hoặc thay đổi

React Query list cache.

#### Trạng thái trước và sau

Trước: product visible. Sau: product removed hoặc rollback.

#### UI states bắt buộc

* Initial: Product card.
* Loading: Mutation loading.
* Success: Success message.
* Error: Error message + rollback.
* Empty: Nếu list hết sản phẩm.
* Unauthorized: Cần bổ sung Admin enforcement.
* Not found: Cần xử lý nếu product không tồn tại.
* Disabled hoặc confirmation khi áp dụng: Confirm modal, buttons disabled khi mutation pending.

#### Frontend liên quan

`src/features/shop/pages/ShopPage.tsx`, `src/features/shop/components/ProductCard.tsx`.

#### Backend API liên quan

`DELETE /products/:id`.

#### Database entity liên quan

Không có database nội bộ.

#### Nguồn tham chiếu trong code

`src/features/shop/hooks/useProducts.ts`, `src/features/shop/api/productApi.ts`.

#### Trạng thái triển khai project cũ

Missing authorization.

#### Điều kiện hoàn thành khi dựng lại

Admin-only enforcement, product existence check, soft/hard delete rule.

#### Cần Technical Lead xác nhận

Cần Technical Lead xác nhận soft delete hay hard delete.

## 13. Other Role Flows

Không có Seller, Shipper, Vendor hoặc Staff flows trong phạm vi project hiện tại.

## 14. State Transition Flows

| Entity | Trạng thái hiện tại | Hành động | Trạng thái sau | Actor | Flow ID |
| ------ | ------------------- | --------- | -------------- | ----- | ------- |
| Auth | loading | App init không có token | unauthenticated | System | AUTH-F02 |
| Auth | loading | App init có token và `/auth/me` thành công | authenticated | System | AUTH-F02 |
| Auth | loading/authenticated | Fetch profile lỗi | unauthenticated | System | AUTH-F02 |
| Auth | authenticated | Logout | unauthenticated | Customer/Admin | AUTH-F03 |
| Login | idle/error | Submit valid credentials | loading | Guest state | AUTH-F01 |
| Login | loading | Login response có token | token stored, fetch profile | Guest state | AUTH-F01 |
| Login | loading | Login error hoặc thiếu token | error | Guest state | AUTH-F01 |
| Cart item | not exists | Add product-color | exists, quantity 1 | Customer | CART-F01 |
| Cart item | exists | Add cùng product-color | exists, quantity +1 | Customer | CART-F01 |
| Cart item | exists | Update quantity >= 1 | exists, quantity mới | Customer | CART-F03 |
| Cart item | exists | Update quantity < 1 | removed | Customer | CART-F03 |
| Cart item | exists | Remove item | removed | Customer | CART-F04 |

Không có state transition cho order, payment, review hoặc inventory trong source hiện tại.

## 15. UI State Coverage

| Flow ID | Loading | Success | Error | Empty | Unauthorized | Not found |
| ------- | ------- | ------- | ----- | ----- | ------------ | --------- |
| AUTH-F01 | Có | Có | Có | Not applicable | Not applicable | Not applicable |
| AUTH-F02 | Có | Có | Có, fallback unauthenticated | Not applicable | Có | Not applicable |
| AUTH-F03 | Not applicable | Có | Chưa có | Not applicable | Not applicable | Not applicable |
| PRODUCT-F01 | Có | Có | Có | Có | Not applicable | Not applicable |
| SEARCH-F01 | Có một phần | Có | Có | Có | Not applicable | Not applicable |
| SEARCH-F02 | Có | Có | Chưa rõ | Có, dropdown hidden | Not applicable | Not applicable |
| FILTER-F01 | Not applicable | Có | Not applicable | Có | Not applicable | Not applicable |
| PAGINATION-F01 | Not applicable | Có | Not applicable | Có, hidden <=1 page | Not applicable | Not applicable |
| PRODUCT-F02 | Có | Có | Có | Not applicable | Not applicable | Chưa rõ |
| PRODUCT-F03 | Covered by detail | Có | Fallback một phần | Có thể thiếu | Not applicable | Not applicable |
| CART-F01 | Not applicable | Có notification | Chưa có | Not applicable | Có | Not applicable |
| CART-F02 | Login loading | Redirect success | Login error | Not applicable | Có | Not applicable |
| CART-F03 | Not applicable | Có | Chưa có | Có | Có | Not applicable |
| CART-F04 | Not applicable | Có | Chưa có | Có | Có | Not applicable |
| CART-F05 | Not applicable | Có | Chưa có | Có | Có | Not applicable |
| USER-F01 | Có | Có | Warning no user | Not applicable | Có | Not applicable |
| ADMIN-PRODUCT-F01 | Có mutation | Có | Có | Not applicable | Thiếu Admin enforcement | Not applicable |
| ADMIN-PRODUCT-F02 | Có mutation | Có | Có | Not applicable | Thiếu Admin enforcement | Cần bổ sung |
| ADMIN-PRODUCT-F03 | Có mutation | Có | Có rollback | Có thể có | Thiếu Admin enforcement | Cần bổ sung |

## 16. Frontend–Backend Gaps

- Frontend có cart flow nhưng không có backend cart API.
- Frontend có buy now nhưng không có checkout, order hoặc payment API.
- Frontend có product CRUD nhưng không có Admin role enforcement.
- Frontend có profile read nhưng không có profile update.
- Frontend có product detail route theo slug nhưng backend API hiện dùng search để suy ra id.
- Frontend filter và pagination là client-side, không có backend query tương ứng.
- Protected routes chỉ được guard ở frontend trong source hiện tại.
- Backend internal routes, controllers, services và middleware không tồn tại trong repository.
- Order/cancel-order rules đã được xác nhận ở mức nghiệp vụ nhưng chưa có source implementation.
- Admin không được sửa auth credentials tùy ý, nhưng source chưa có user management policy/API để enforce.

## 17. Broken or Incomplete Flows

- Checkout flow: missing.
- Payment flow: missing.
- Order history/detail/cancel/status tracking: missing.
- Admin order management: missing.
- Review flow: missing.
- Register/account creation: missing.
- Profile update: missing.
- Shipping address management: missing.
- Inventory/stock validation: missing.
- Product price revalidation before checkout: missing.
- Customer/Admin role split in source: missing.
- Admin authorization for product CRUD: missing.
- Product detail not-found handling: incomplete.
- Search suggest error UI: incomplete.
- Cart server-side ownership and stale data validation: missing.
- Audit log for Admin product/order actions: missing.

## 18. Items Requiring Technical Lead Confirmation

- Có cần flow đăng ký tài khoản không.
- Customer default route sau login.
- Admin default route sau login.
- Product CRUD nằm ở admin route riêng hay shop UI có role gating.
- Checkout có thuộc scope dựng lại không.
- Order statuses hợp lệ.
- Customer được hủy đơn ở trạng thái nào.
- Admin được chuyển hoặc hủy đơn ở trạng thái nào.
- Payment methods cần hỗ trợ.
- Shipping address management có thuộc scope không.
- Cart local-only hay server-side.
- Sau login từ add-to-cart redirect, có cần tự động thêm lại item không.
- Backend mới có endpoint product detail theo slug không.
- Search, filter, pagination nên server-side hay client-side.
- Review flow sau khi mua có thuộc scope không.
- Admin có được quản lý user không và giới hạn thế nào với authentication credentials.
- Có cần audit log cho Admin product/order actions không.
