# User Roles and Permissions

## 1. Purpose

Tài liệu này mô tả role, quyền hạn và phạm vi truy cập dữ liệu của người dùng trong project E-Commerce. Nội dung được tổng hợp từ phân tích source code hiện tại, `feature-list.md`, `business-rules.md` và các điều chỉnh đã được Technical Lead xác nhận.

Giới hạn quan trọng:

- Project chỉ có hai role nghiệp vụ được xác nhận: `Customer` và `Admin`.
- `Guest` không phải role lưu trong database, chỉ là trạng thái chưa đăng nhập.
- Không tồn tại `Seller`, `Vendor`, `Staff`, `Shipper` hoặc `Delivery` trong phạm vi project hiện tại.
- Source code hiện tại chưa có database user model, role enum, backend authorization middleware hoặc order module. Các quyền liên quan đến role và đơn hàng là yêu cầu nghiệp vụ đã được Technical Lead xác nhận, cần được implement khi dựng lại.

## 2. Role Summary

| Role | Mục đích | Phạm vi dữ liệu | Trạng thái xác minh |
| ---- | -------- | --------------- | ------------------- |
| Guest state | Trạng thái chưa đăng nhập, chỉ dùng public pages và login | Dữ liệu công khai | Đã xác nhận không phải database role |
| Customer | Người mua hàng, thao tác dữ liệu cá nhân và đơn hàng của chính mình | Own data only | Đã được Technical Lead xác nhận; source hiện chỉ có authenticated state |
| Admin | Quản lý sản phẩm và đơn hàng, không được tùy ý sửa thông tin xác thực người dùng | Managed scope only | Đã được Technical Lead xác nhận; source chưa có role enforcement |

## 3. Detailed Roles

### Guest state

* Giá trị lưu trong hệ thống: Không lưu trong database; đây là trạng thái chưa đăng nhập.
* Mục đích: Cho phép người chưa đăng nhập xem nội dung công khai và thực hiện đăng nhập.
* Cách role được gán: Mặc định khi không có phiên đăng nhập hợp lệ hoặc `auth.isAuthenticated = false`.
* Trang mặc định: `/shop` là route fallback cho unknown route; `/login` dùng để đăng nhập.
* Phạm vi dữ liệu: Chỉ dữ liệu công khai như danh sách sản phẩm và chi tiết sản phẩm.
* Chức năng được phép: AUTH-02, SHOP-01, SHOP-02, SHOP-03, SHOP-04, SHOP-05, PROD-01, PROD-02, I18N-01, SYS-01.
* Chức năng bị cấm: AUTH-03, AUTH-04 protected access, CART-01, CART-02, CART-03, USER-01, SHOP-06, SHOP-07, SHOP-08.
* Điều kiện ownership: Không áp dụng.
* Nguồn tham chiếu trong code: `src/config/routes.ts`, `src/App.tsx`, `src/features/auth/components/AuthMiddleware.tsx`, `src/features/auth/hooks/useRequireAuth.ts`.
* Mức độ chắc chắn: Cao.
* Cần Technical Lead xác nhận: Không còn xem Guest là database role.

### Customer

* Giá trị lưu trong hệ thống: Cần Technical Lead xác nhận giá trị chính xác trong database, ví dụ `Customer`, `customer` hoặc enum khác.
* Mục đích: Người mua hàng sử dụng shop, cart, profile và đơn hàng của chính mình.
* Cách role được gán: Cần Technical Lead xác nhận. Source hiện tại chỉ xác định authenticated state qua token/profile, chưa có role field.
* Trang mặc định: Cần Technical Lead xác nhận. Source hiện tại redirect về `returnUrl` hoặc `/shop` sau login.
* Phạm vi dữ liệu: Own data only.
* Chức năng được phép: AUTH-01, AUTH-02, AUTH-03, AUTH-04 theo route dành cho Customer, SHOP-01, SHOP-02, SHOP-03, SHOP-04, SHOP-05, PROD-01, PROD-02, CART-01, CART-02, CART-03, USER-01, I18N-01, SYS-01.
* Chức năng bị cấm: SHOP-06, SHOP-07, SHOP-08, quản lý toàn bộ đơn hàng, xem hoặc thao tác đơn hàng của người khác, sửa thông tin xác thực của người dùng khác.
* Điều kiện ownership: Customer chỉ được xem và thao tác trên dữ liệu của chính mình, bao gồm profile, cart và đơn hàng. Quyền hủy đơn chỉ áp dụng với đơn hàng của chính Customer và chỉ khi trạng thái đơn hàng cho phép theo `business-rules.md`.
* Nguồn tham chiếu trong code: `src/features/auth/store/authSlice.ts`, `src/features/auth/store/authEpic.ts`, `src/features/auth/components/AuthMiddleware.tsx`, `src/features/auth/hooks/useRequireAuth.ts`, `src/features/cart/**`, `src/features/profile/pages/ProfilePage.tsx`.
* Mức độ chắc chắn: Cao về nghiệp vụ đã xác nhận; implementation hiện tại chưa phân biệt Customer/Admin.
* Cần Technical Lead xác nhận: Giá trị role trong database, trang mặc định sau login, order status nào cho phép Customer hủy đơn.

### Admin

* Giá trị lưu trong hệ thống: Cần Technical Lead xác nhận giá trị chính xác trong database, ví dụ `Admin`, `admin` hoặc enum khác.
* Mục đích: Quản lý sản phẩm và đơn hàng trong phạm vi hệ thống.
* Cách role được gán: Cần Technical Lead xác nhận. Source hiện tại chưa có role assignment.
* Trang mặc định: Cần Technical Lead xác nhận, ví dụ admin product management, admin orders hoặc dashboard.
* Phạm vi dữ liệu: Managed scope only. Phạm vi cụ thể cần Technical Lead xác nhận.
* Chức năng được phép: AUTH-01, AUTH-02, AUTH-03, AUTH-04 theo route dành cho Admin, SHOP-01, SHOP-02, SHOP-03, SHOP-04, SHOP-05, SHOP-06, SHOP-07, SHOP-08, PROD-01, PROD-02, quản lý đơn hàng theo trạng thái hợp lệ, I18N-01, SYS-01.
* Chức năng bị cấm: Tùy ý sửa thông tin xác thực của người dùng; bỏ qua trạng thái đơn hàng khi hủy/chuyển trạng thái; tự mở rộng quyền ngoài managed scope.
* Điều kiện ownership: Admin thao tác trong managed scope. Với đơn hàng, mọi thao tác phải tuân thủ trạng thái đơn hàng theo `business-rules.md`. Admin không được dùng quyền quản lý để sửa authentication credentials của user tùy ý.
* Nguồn tham chiếu trong code: Product CRUD UI/API có trong `src/features/shop/pages/ShopPage.tsx`, `src/features/shop/components/ProductCard.tsx`, `src/features/shop/components/ProductModal.tsx`, `src/features/shop/api/productApi.ts`. Source chưa có Admin role check.
* Mức độ chắc chắn: Cao về nghiệp vụ đã xác nhận; backend/frontend enforcement chưa implement trong source hiện tại.
* Cần Technical Lead xác nhận: Giá trị role trong database, managed scope, admin default route, giới hạn cụ thể với user credentials và order status transitions.

## 4. Feature Permission Matrix

| Feature ID | Hành động | Guest state | Customer | Admin | Backend enforcement |
| ---------- | --------- | ----------- | -------- | ----- | ------------------- |
| AUTH-01 | App init kiểm tra token | Allow | Allow | Allow | Unverified; source dùng DummyJSON `/auth/me` |
| AUTH-02 | Login | Allow | Not applicable | Not applicable | Unverified; source dùng DummyJSON `/auth/login` |
| AUTH-03 | Logout | Not applicable | Allow | Allow | Unverified; hiện chỉ xóa local token |
| AUTH-04 | Truy cập protected route | Deny | Allow theo Customer routes | Allow theo Admin routes | Cần backend enforcement |
| SHOP-01 | Xem danh sách sản phẩm | Allow | Allow | Allow | Unverified; source dùng DummyJSON |
| SHOP-02 | Tìm kiếm sản phẩm | Allow | Allow | Allow | Unverified; source dùng DummyJSON |
| SHOP-03 | Gợi ý tìm kiếm | Allow | Allow | Allow | Unverified; source dùng DummyJSON |
| SHOP-04 | Lọc sản phẩm | Allow | Allow | Allow | Not applicable; client-side |
| SHOP-05 | Phân trang | Allow | Allow | Allow | Not applicable; client-side |
| SHOP-06 | Thêm sản phẩm | Deny | Deny | Allow | Cần Admin role enforcement |
| SHOP-07 | Sửa sản phẩm | Deny | Deny | Allow | Cần Admin role enforcement |
| SHOP-08 | Xóa sản phẩm | Deny | Deny | Allow | Cần Admin role enforcement |
| PROD-01 | Xem chi tiết sản phẩm | Allow | Allow | Allow | Unverified; source dùng DummyJSON |
| PROD-02 | Chọn màu và ảnh | Allow | Allow | Allow | Not applicable; client-side |
| CART-01 | Add to cart, buy now | Deny | Allow | Not applicable | Cần backend cart ownership nếu có server cart |
| CART-02 | Xem và cập nhật cart | Deny | Own data only | Not applicable | Cần backend cart ownership nếu có server cart |
| CART-03 | Tính subtotal, tax, total | Deny | Own data only | Not applicable | Not applicable; hiện client-side |
| USER-01 | Xem profile | Deny | Own data only | Own profile; quản lý user cần xác nhận | Cần token ownership enforcement |
| ORDER-READ | Xem đơn hàng | Deny | Own data only | Managed scope only | Cần implement; source chưa có order module |
| ORDER-CANCEL | Hủy đơn | Deny | Own data only | Managed scope only | Cần ownership/scope + status enforcement theo `business-rules.md` |
| ORDER-MANAGE | Quản lý đơn hàng | Deny | Deny | Managed scope only | Cần implement; source chưa có order module |
| I18N-01 | Dùng translation | Allow | Allow | Allow | Not applicable |
| SYS-01 | Error boundary | Allow | Allow | Allow | Not applicable |

## 5. Page and Route Access Matrix

| Route hoặc trang | Guest | Customer | Admin | Ghi chú |
| ---------------- | ----- | -------- | ----- | ------- |
| `/login` | Allow | Not applicable; redirect nếu đã login | Not applicable; redirect nếu đã login | Source hiện redirect authenticated user về `returnUrl` hoặc `/shop` |
| `/shop` | Allow | Allow | Allow | Product CRUD buttons hiện có trong shop nhưng cần chỉ Admin được dùng |
| `/shop/:slug` | Allow | Allow | Allow | Public product detail |
| `/cart` | Deny | Allow | Not applicable | Source hiện chỉ check authenticated, chưa phân biệt Customer/Admin |
| `/profile` | Deny | Own data only | Own profile only; quản lý user cần xác nhận | Source hiện đọc `auth.userData` |
| Customer orders page | Deny | Own data only | Managed scope only | Chưa có route trong source |
| Admin products page | Deny | Deny | Allow | Chưa có route riêng; CRUD hiện nằm trong `/shop` |
| Admin orders page | Deny | Deny | Managed scope only | Chưa có route trong source |
| Unknown route `*` | Redirect `/shop` | Redirect `/shop` | Redirect `/shop` | Source fallback route |

## 6. API Permission Matrix

| API | Method | Role được phép | Ownership | Backend enforcement |
| --- | ------ | -------------- | --------- | ------------------- |
| `/auth/login` | POST | Guest state | Not applicable | Unverified; DummyJSON |
| `/auth/me` | GET | Customer, Admin | Own identity from token | Unverified; DummyJSON |
| `/products` | GET | Guest state, Customer, Admin | Public data | Unverified; DummyJSON |
| `/products/:id` | GET | Guest state, Customer, Admin | Public data | Unverified; DummyJSON |
| `/products/search?q=...` | GET | Guest state, Customer, Admin | Public data | Unverified; DummyJSON |
| `/products/add` | POST | Admin | Managed scope only | Cần Admin enforcement; source hiện chưa có |
| `/products/:id` | PUT | Admin | Managed scope only | Cần Admin enforcement; source hiện chưa có |
| `/products/:id` | DELETE | Admin | Managed scope only | Cần Admin enforcement; source hiện chưa có |
| Customer orders API | GET | Customer | Own data only | Cần implement |
| Customer cancel order API | PATCH/POST | Customer | Own data only + allowed status | Cần implement theo `business-rules.md` |
| Admin orders API | GET/PATCH | Admin | Managed scope only + allowed status | Cần implement |
| User credentials API | PATCH/PUT | Cần Technical Lead xác nhận | Strict own/admin policy | Admin không được sửa tùy ý |

## 7. Data Ownership Rules

- Guest state chỉ được truy cập dữ liệu công khai.
- Customer chỉ được truy cập và thao tác dữ liệu của chính mình.
- Customer chỉ được xem, cập nhật hoặc hủy đơn hàng của chính mình.
- Customer không được xem, sửa, hủy hoặc thao tác đơn hàng của người khác.
- Customer không được quản lý sản phẩm.
- Admin được quản lý sản phẩm.
- Admin được quản lý đơn hàng trong managed scope.
- Admin không được sửa thông tin xác thực của người dùng tùy ý.
- Quyền hủy đơn của Customer hoặc Admin phải kiểm tra trạng thái đơn hàng theo `business-rules.md`.
- Backend không được tin `userId` do frontend gửi lên để xác định ownership; identity phải lấy từ token/session. Cần Technical Lead xác nhận cơ chế token/session khi dựng lại.

## 8. Authentication Requirements

- Các chức năng public không yêu cầu đăng nhập: xem danh sách sản phẩm, tìm kiếm, gợi ý tìm kiếm, lọc, phân trang, xem chi tiết sản phẩm.
- Login yêu cầu username và password.
- Protected routes hiện tại gồm `/cart` và `/profile`.
- Add to cart và buy now yêu cầu authenticated state.
- Customer/Admin phải được xác định từ phiên đăng nhập hợp lệ.
- Source hiện tại lưu token trong `localStorage`; cần Technical Lead xác nhận chiến lược auth khi dựng lại.

## 9. Authorization Requirements

- Backend phải enforce role, không chỉ dựa vào route guard hoặc ẩn/hiện UI.
- Product create/update/delete chỉ dành cho Admin.
- Customer cart/profile/order phải enforce own-data access.
- Admin order management phải enforce managed scope.
- Hủy đơn phải enforce cả role, ownership/scope và trạng thái đơn hàng theo `business-rules.md`.
- Admin không được có quyền mặc định để sửa authentication credentials của user tùy ý.
- Không có Seller/Shipper, nên không tạo route, API hoặc policy cho các role này trong phạm vi hiện tại.

## 10. Frontend Visibility Rules

- Guest state có thể thấy public navigation và login.
- Customer có thể thấy shop, cart, profile và các chức năng đơn hàng của chính mình khi được implement.
- Admin có thể thấy chức năng quản lý sản phẩm và quản lý đơn hàng khi được implement.
- Product CRUD buttons trong source hiện tại chưa có role gating rõ ràng; khi dựng lại phải chỉ hiển thị hoặc cho phép thao tác với Admin.
- Ẩn button, ẩn menu hoặc redirect frontend không thay thế kiểm tra quyền ở backend.
- Mọi API thay đổi dữ liệu phải có backend authorization tương ứng.

## 11. Known Authorization Gaps

- Source hiện tại chưa có role `Customer`/`Admin` trong type, model, token hoặc store.
- Source hiện tại chỉ có `isAuthenticated`, chưa phân biệt Customer và Admin.
- Product CRUD UI/API client hiện có nhưng chưa có Admin role enforcement.
- `/cart` và `/profile` chỉ được bảo vệ ở frontend.
- Không có backend nội bộ để xác minh authentication middleware, authorization middleware hoặc ownership check.
- Không có order module trong source, trong khi quyền Customer/Admin về đơn hàng đã được xác nhận ở mức nghiệp vụ.
- Không có kiểm tra trạng thái đơn hàng cho quyền hủy đơn vì order module chưa tồn tại.
- Không có database model cho user role.
- Không có audit log cho Admin product/order actions.
- Token hiện lưu trong `localStorage`, có rủi ro bảo mật nếu có XSS.

## 12. Items Requiring Technical Lead Confirmation

- Giá trị role lưu trong database là `Customer`/`Admin`, `customer`/`admin` hay enum khác.
- Cách gán role khi tạo tài khoản hoặc seed dữ liệu.
- Customer default route sau login.
- Admin default route sau login.
- Product CRUD nên nằm ở route admin riêng hay giữ trong shop UI với role gating.
- Admin managed scope cụ thể là toàn hệ thống hay một phạm vi quản lý hẹp hơn.
- Định nghĩa chính xác "thông tin xác thực của người dùng" gồm password, email đăng nhập, token/session, MFA hoặc field nào khác.
- Admin có được xem thông tin user không và ở mức nào.
- Order statuses hợp lệ.
- Customer được hủy đơn ở trạng thái nào.
- Admin được hủy hoặc chuyển trạng thái đơn ở trạng thái nào.
- Backend sẽ lấy user identity từ token/session theo cơ chế nào.
- Có cần audit log cho Admin product/order actions không.
- Có cần tách Customer orders API và Admin orders API không.
