# 1. Project Overview

Project hien tai la mot React SPA e-commerce cho ung dung "Mobile Shopping". He thong tap trung vao cac luong: xem danh sach san pham, tim kiem, loc, xem chi tiet san pham, dang nhap, them vao gio hang, xem gio hang va xem ho so ca nhan.

Repository khong co backend noi bo, controller, service backend, migration, ORM hoac database schema. Frontend goi truc tiep DummyJSON thong qua bien moi truong `REACT_APP_API_BASE_URL=https://dummyjson.com`.

Kien truc chinh:

- Frontend: React, TypeScript, Create React App, React Router, Redux Toolkit, Redux Observable, Redux Persist, TanStack React Query, Ant Design, i18next.
- Backend lien quan: DummyJSON API ben ngoai.
- Database lien quan: khong co database noi bo trong repository. Du lieu local duoc luu qua `localStorage` va Redux Persist.

Nhom nguoi dung co can cu trong code:

- Guest: xem shop, xem chi tiet san pham, tim kiem/loc san pham, vao login.
- Authenticated User: truy cap cart/profile, them san pham vao gio hang, mua ngay, logout.
- Admin/Seller: co giao dien them/sua/xoa san pham nhung khong co role hoac authorization ro rang. Can Technical Lead xac nhan.

# 2. Feature Summary

| ID | Module | Chuc nang | Role | Trang thai project cu | Uu tien dung lai |
| -- | ------ | --------- | ---- | --------------------- | ---------------- |
| AUTH-01 | Auth | Khoi tao phien dang nhap tu token | Guest, Authenticated User | Partially implemented | P0 |
| AUTH-02 | Auth | Dang nhap | Guest | Complete demo | P0 |
| AUTH-03 | Auth | Dang xuat | Authenticated User | Complete local | P0 |
| AUTH-04 | Auth | Bao ve route can dang nhap | Authenticated User | Frontend only | P0 |
| SHOP-01 | Shop | Xem danh sach san pham | Guest, Authenticated User | Missing tests | P0 |
| SHOP-02 | Shop | Tim kiem san pham | Guest, Authenticated User | Missing tests | P1 |
| SHOP-03 | Shop | Goi y tim kiem san pham | Guest, Authenticated User | Missing tests | P2 |
| SHOP-04 | Shop | Loc san pham theo gia va rating | Guest, Authenticated User | Frontend only | P1 |
| SHOP-05 | Shop | Phan trang danh sach san pham | Guest, Authenticated User | Complete local | P1 |
| SHOP-06 | Shop | Them san pham | Can Technical Lead xac nhan | Needs human confirmation | P2 |
| SHOP-07 | Shop | Sua san pham | Can Technical Lead xac nhan | Needs human confirmation | P2 |
| SHOP-08 | Shop | Xoa san pham | Can Technical Lead xac nhan | Needs human confirmation | P2 |
| PROD-01 | Product | Xem chi tiet san pham | Guest, Authenticated User | Partially implemented | P0 |
| PROD-02 | Product | Chon mau va anh san pham | Guest, Authenticated User | Frontend only | P2 |
| CART-01 | Cart | Them san pham vao gio hang | Authenticated User | Frontend only | P0 |
| CART-02 | Cart | Xem va cap nhat gio hang | Authenticated User | Frontend only | P0 |
| CART-03 | Cart | Tinh subtotal, tax va total | Authenticated User | Complete local | P1 |
| USER-01 | User Profile | Xem ho so ca nhan | Authenticated User | Complete demo | P1 |
| I18N-01 | Support | Da ngon ngu VI/EN | Guest, Authenticated User | Partially implemented | P3 |
| SYS-01 | System | Error boundary | Guest, Authenticated User | Missing tests | P2 |

# 3. Detailed Features

## AUTH-01: Khoi tao phien dang nhap tu token

### Muc tieu

Khoi phuc trang thai dang nhap khi user reload hoac mo lai ung dung.

### Nguoi su dung va quyen han

Guest va Authenticated User. Chuc nang chay tu dong khi app khoi dong.

### Dieu kien truoc

Ung dung duoc mount va Redux store da san sang.

### Du lieu dau vao

`accessToken` trong `localStorage`.

### Rang buoc du lieu

Neu token ton tai thi goi API lay profile. Neu khong co token thi set unauthenticated.

### Luong thanh cong

App dispatch `appInit`, epic doc `localStorage.accessToken`, dispatch `fetchUserProfile`, goi `/auth/me`, map profile va cap nhat Redux auth.

### Truong hop loi va truong hop bien

Khong co token thi user o trang thai chua dang nhap. API profile loi thi clear user va set unauthenticated.

### Ket qua dau ra

Redux auth co `isAuthenticated`, `userData`, `loading` dung voi ket qua kiem tra.

### Business rules

Token local la can cu khoi tao phien dang nhap. Profile thanh cong moi set authenticated.

### Frontend lien quan

`src/App.tsx`, `src/features/auth/store/initAuthEpic.ts`, `src/features/auth/store/authEpic.ts`, `src/features/auth/store/authSlice.ts`.

### Backend lien quan

`GET /auth/me` tren DummyJSON.

### Database lien quan

Khong co database noi bo. Token luu trong `localStorage`.

### Trang thai trien khai cu

Partially implemented.

### Dieu kien hoan thanh khi dung lai

Co session initialization ro rang, xu ly token het han, loi API, loading state va test tu dong.

### Nguon tham chieu trong code

`src/App.tsx`, `src/features/auth/store/initAuthEpic.ts`, `src/features/auth/store/authEpic.ts`.

### Noi dung can Technical Lead xac nhan

Can Technical Lead xac nhan co dung JWT/localStorage tiep khong, co refresh token hay khong.

## AUTH-02: Dang nhap

### Muc tieu

Cho phep user xac thuc va truy cap cac khu vuc can dang nhap.

### Nguoi su dung va quyen han

Guest.

### Dieu kien truoc

User truy cap `/login`.

### Du lieu dau vao

Username va password.

### Rang buoc du lieu

Username va password bat buoc. Username duoc trim truoc khi goi API.

### Luong thanh cong

User submit form, dispatch `loginUser`, epic goi `POST /auth/login`, luu token vao `localStorage`, dispatch `fetchUserProfile`, redirect ve `returnUrl` hoac `/shop`.

### Truong hop loi va truong hop bien

Thieu username/password hien validation form. API loi hoac response khong co token thi hien login error.

### Ket qua dau ra

User dang nhap thanh cong va Redux auth co user profile.

### Business rules

Request login gui `expiresInMins: 30`. Response chap nhan `accessToken` hoac `token`.

### Frontend lien quan

`src/features/auth/pages/LoginPage.tsx`, `src/features/auth/store/authEpic.ts`, `src/features/auth/store/authSlice.ts`.

### Backend lien quan

`POST /auth/login` tren DummyJSON.

### Database lien quan

Khong co database noi bo.

### Trang thai trien khai cu

Complete demo.

### Dieu kien hoan thanh khi dung lai

Co validation, error message, redirect returnUrl, test login success/failure va co chinh sach session ro rang.

### Nguon tham chieu trong code

`src/features/auth/pages/LoginPage.tsx`, `src/features/auth/store/authEpic.ts`.

### Noi dung can Technical Lead xac nhan

Can Technical Lead xac nhan account test, password policy va co can refresh token hay khong.

## AUTH-03: Dang xuat

### Muc tieu

Ket thuc phien dang nhap tren client.

### Nguoi su dung va quyen han

Authenticated User.

### Dieu kien truoc

User dang dang nhap.

### Du lieu dau vao

Click logout trong header dropdown.

### Rang buoc du lieu

Khong co input nghiep vu.

### Luong thanh cong

Dispatch `logout`, xoa `accessToken`, reset `userData`, set unauthenticated va dieu huong ve `/shop`.

### Truong hop loi va truong hop bien

Khong thay xu ly loi logout vi khong goi backend.

### Ket qua dau ra

User tro ve trang thai Guest.

### Business rules

Logout chi xoa state local, khong revoke token tren server.

### Frontend lien quan

`src/layouts/MainLayout.tsx`, `src/features/auth/store/authSlice.ts`.

### Backend lien quan

Khong co.

### Database lien quan

Khong co.

### Trang thai trien khai cu

Complete local.

### Dieu kien hoan thanh khi dung lai

Co logout UX ro rang, reset state nhay cam va revoke/invalidate session neu backend yeu cau.

### Nguon tham chieu trong code

`src/layouts/MainLayout.tsx`, `src/features/auth/store/authSlice.ts`.

### Noi dung can Technical Lead xac nhan

Can Technical Lead xac nhan logout co can goi backend de revoke token hay khong.

## AUTH-04: Bao ve route can dang nhap

### Muc tieu

Chan user chua dang nhap truy cap cart va profile.

### Nguoi su dung va quyen han

Authenticated User duoc truy cap. Guest bi redirect ve login.

### Dieu kien truoc

Route thuoc danh sach protected routes.

### Du lieu dau vao

Trang thai `auth.isAuthenticated`, `auth.loading`, current location.

### Rang buoc du lieu

Khi auth dang loading thi chua render protected page.

### Luong thanh cong

Neu authenticated thi render child route qua `Outlet`.

### Truong hop loi va truong hop bien

Neu unauthenticated thi redirect `/login?returnUrl=...`.

### Ket qua dau ra

Protected page duoc render hoac user bi redirect.

### Business rules

Protected routes hien co: `/cart`, `/profile`.

### Frontend lien quan

`src/config/routes.ts`, `src/features/auth/components/AuthMiddleware.tsx`, `src/features/auth/hooks/useRequireAuth.ts`.

### Backend lien quan

Khong co backend authorization trong repository.

### Database lien quan

Khong co.

### Trang thai trien khai cu

Frontend only.

### Dieu kien hoan thanh khi dung lai

Frontend guard va backend authorization phai dong nhat, co test redirect va access allowed.

### Nguon tham chieu trong code

`src/config/routes.ts`, `src/features/auth/components/AuthMiddleware.tsx`.

### Noi dung can Technical Lead xac nhan

Can Technical Lead xac nhan role model va backend authorization mong muon.

## SHOP-01: Xem danh sach san pham

### Muc tieu

Cho phep user xem catalog san pham.

### Nguoi su dung va quyen han

Guest va Authenticated User.

### Dieu kien truoc

User truy cap `/shop`.

### Du lieu dau vao

Khong co input bat buoc.

### Rang buoc du lieu

San pham duoc map ve cac field `id`, `title`, `description`, `price`, `rating`, `thumbnail`, `images`, `colors`.

### Luong thanh cong

`useProducts` goi `productApi.getAll`, fetch `/products`, map danh sach va render grid san pham.

### Truong hop loi va truong hop bien

Co skeleton loading, error text va empty state khi khong co san pham.

### Ket qua dau ra

Danh sach san pham hien tren trang shop.

### Business rules

React Query cache query mac dinh stale 5 phut, gc 10 phut, retry 2 lan.

### Frontend lien quan

`src/features/shop/pages/ShopPage.tsx`, `src/features/shop/hooks/useProducts.ts`, `src/features/shop/api/productApi.ts`, `src/features/shop/components/ProductCard.tsx`.

### Backend lien quan

`GET /products` tren DummyJSON.

### Database lien quan

Khong co database noi bo. Entity lien quan: `Product`.

### Trang thai trien khai cu

Missing tests.

### Dieu kien hoan thanh khi dung lai

Co API/list UI on dinh, loading/error/empty state, test page va API hook.

### Nguon tham chieu trong code

`src/features/shop/pages/ShopPage.tsx`, `src/features/shop/hooks/useProducts.ts`, `src/features/shop/api/productApi.ts`.

### Noi dung can Technical Lead xac nhan

Can Technical Lead xac nhan product schema that su va nguon du lieu backend moi.

## SHOP-02: Tim kiem san pham

### Muc tieu

Cho phep user tim san pham theo keyword.

### Nguoi su dung va quyen han

Guest va Authenticated User.

### Dieu kien truoc

User o trang shop va nhap keyword.

### Du lieu dau vao

Search term.

### Rang buoc du lieu

Chi goi API khi search term sau trim co do dai lon hon 0.

### Luong thanh cong

Input debounce 500ms, `useSearchProducts` goi `/products/search?q=...`, render danh sach ket qua.

### Truong hop loi va truong hop bien

Khong co ket qua thi hien no-search-result. API loi hien error message tu query.

### Ket qua dau ra

Danh sach san pham khop keyword.

### Business rules

Khi search/filter thay doi thi reset current page ve 1.

### Frontend lien quan

`src/features/shop/pages/ShopPage.tsx`, `src/features/shop/hooks/useProducts.ts`, `src/features/shop/components/SearchAutocomplete.tsx`.

### Backend lien quan

`GET /products/search?q=...`.

### Database lien quan

Khong co database noi bo.

### Trang thai trien khai cu

Missing tests.

### Dieu kien hoan thanh khi dung lai

Co search debounce, empty/error state, test cho query va UI.

### Nguon tham chieu trong code

`src/features/shop/pages/ShopPage.tsx`, `src/features/shop/hooks/useProducts.ts`.

### Noi dung can Technical Lead xac nhan

Can Technical Lead xac nhan search la client-visible keyword search hay can full-text/search backend rieng.

## SHOP-03: Goi y tim kiem san pham

### Muc tieu

Goi y san pham nhanh trong khi user nhap tu khoa.

### Nguoi su dung va quyen han

Guest va Authenticated User.

### Dieu kien truoc

User focus va nhap vao search box.

### Du lieu dau vao

Keyword da debounce.

### Rang buoc du lieu

Keyword rong thi tra ve mang rong va khong goi API.

### Luong thanh cong

Debounce 300ms, goi `/products/search?q=...&limit=8`, render dropdown, click item thi navigate sang product detail.

### Truong hop loi va truong hop bien

API loi throw error. UI co loading row khi dang tim.

### Ket qua dau ra

Danh sach toi da 8 goi y san pham.

### Business rules

Suggest cache ngan: stale 30 giay, gc 60 giay.

### Frontend lien quan

`src/features/shop/components/SearchAutocomplete.tsx`, `src/features/shop/hooks/useSearchSuggest.ts`, `src/features/shop/api/searchSuggestApi.ts`.

### Backend lien quan

`GET /products/search?q=...&limit=8`.

### Database lien quan

Khong co database noi bo.

### Trang thai trien khai cu

Missing tests.

### Dieu kien hoan thanh khi dung lai

Co dropdown, loading, outside-click close, select behavior va test.

### Nguon tham chieu trong code

`src/features/shop/components/SearchAutocomplete.tsx`, `src/features/shop/api/searchSuggestApi.ts`.

### Noi dung can Technical Lead xac nhan

Can Technical Lead xac nhan limit goi y mac dinh va ranking logic.

## SHOP-04: Loc san pham theo gia va rating

### Muc tieu

Cho phep user thu hep danh sach san pham theo khoang gia va rating.

### Nguoi su dung va quyen han

Guest va Authenticated User.

### Dieu kien truoc

Da co danh sach san pham hoac ket qua search.

### Du lieu dau vao

`priceFrom`, `priceTo`, `ratingFrom`, `ratingTo`.

### Rang buoc du lieu

Gia nam trong cac option `[0, 1000, 5000, 10000, 20000, 50000, 100000]`. Rating nam trong `[0, 1, 2, 3, 4, 5]`. From khong lon hon To.

### Luong thanh cong

User chon filter, ShopPage loc mang products tren client va reset page ve 1.

### Truong hop loi va truong hop bien

Neu khong co san pham khop filter thi hien no result.

### Ket qua dau ra

Danh sach san pham da loc.

### Business rules

Filter hien tai hoan toan client-side.

### Frontend lien quan

`src/features/shop/components/FilterPopover.tsx`, `src/features/shop/pages/ShopPage.tsx`.

### Backend lien quan

Khong co API filter rieng trong code.

### Database lien quan

Khong co database noi bo.

### Trang thai trien khai cu

Frontend only.

### Dieu kien hoan thanh khi dung lai

Can thong nhat filter client-side hay server-side, co validation va test.

### Nguon tham chieu trong code

`src/features/shop/components/FilterPopover.tsx`, `src/features/shop/pages/ShopPage.tsx`.

### Noi dung can Technical Lead xac nhan

Can Technical Lead xac nhan khoang gia/rating co phai business rule that khong.

## SHOP-05: Phan trang danh sach san pham

### Muc tieu

Chia danh sach san pham thanh cac trang de de xem.

### Nguoi su dung va quyen han

Guest va Authenticated User.

### Dieu kien truoc

Co danh sach san pham sau search/filter.

### Du lieu dau vao

Current page, total pages.

### Rang buoc du lieu

Moi trang 20 san pham. Page phai nam trong `[1, totalPages]`.

### Luong thanh cong

User click page/previous/next hoac dung phim trai/phai, app cap nhat current page va slice danh sach.

### Truong hop loi va truong hop bien

Neu total pages <= 1 thi khong render pagination. Neu current page vuot total pages thi set ve total pages.

### Ket qua dau ra

Danh sach san pham cua trang hien tai.

### Business rules

Pagination dang client-side.

### Frontend lien quan

`src/components/ui/Pagination.tsx`, `src/features/shop/pages/ShopPage.tsx`.

### Backend lien quan

Khong co API pagination rieng trong code.

### Database lien quan

Khong co database noi bo.

### Trang thai trien khai cu

Complete local.

### Dieu kien hoan thanh khi dung lai

Co pagination on dinh, support dataset lon neu can server-side pagination, co test.

### Nguon tham chieu trong code

`src/components/ui/Pagination.tsx`, `src/features/shop/pages/ShopPage.tsx`.

### Noi dung can Technical Lead xac nhan

Can Technical Lead xac nhan pagination nen client-side hay server-side.

## SHOP-06: Them san pham

### Muc tieu

Cho phep tao san pham moi.

### Nguoi su dung va quyen han

Can Technical Lead xac nhan. Code hien khong co role admin/seller.

### Dieu kien truoc

User click nut them san pham tren trang shop.

### Du lieu dau vao

Title, price, rating, thumbnail.

### Rang buoc du lieu

Title required. Price required va min 0. Rating min 1 max 5. Thumbnail khong validate URL.

### Luong thanh cong

Mo modal, submit form, goi create mutation, `POST /products/add`, dong modal, hien success message va invalidate product list.

### Truong hop loi va truong hop bien

Mutation loi thi hien message `Create failed`. Thieu title/price thi form validation chan submit.

### Ket qua dau ra

San pham moi duoc API tra ve va list duoc refetch.

### Business rules

Chua co rule ve role, stock, category, brand, image list.

### Frontend lien quan

`src/features/shop/pages/ShopPage.tsx`, `src/features/shop/components/ProductModal.tsx`, `src/features/shop/hooks/useProducts.ts`.

### Backend lien quan

`POST /products/add` tren DummyJSON.

### Database lien quan

Khong co database noi bo.

### Trang thai trien khai cu

Needs human confirmation.

### Dieu kien hoan thanh khi dung lai

Chi expose cho role duoc phep, co backend authorization, validation day du va test.

### Nguon tham chieu trong code

`src/features/shop/pages/ShopPage.tsx`, `src/features/shop/components/ProductModal.tsx`, `src/features/shop/api/productApi.ts`.

### Noi dung can Technical Lead xac nhan

Can Technical Lead xac nhan day la feature that hay demo, role nao duoc phep tao san pham.

## SHOP-07: Sua san pham

### Muc tieu

Cho phep cap nhat thong tin san pham.

### Nguoi su dung va quyen han

Can Technical Lead xac nhan.

### Dieu kien truoc

User click nut edit tren product card.

### Du lieu dau vao

Product id va form data gom title, price, rating, thumbnail.

### Rang buoc du lieu

Tuong tu them san pham: title required, price required min 0, rating 1-5.

### Luong thanh cong

Mo modal voi data san pham, submit form, goi `PUT /products/:id`, update cache detail, invalidate list, dong modal va hien success message.

### Truong hop loi va truong hop bien

Mutation loi thi hien `Update failed`.

### Ket qua dau ra

San pham duoc cap nhat trong cache/list.

### Business rules

Chua co rule phan quyen hoac audit thay doi.

### Frontend lien quan

`src/features/shop/pages/ShopPage.tsx`, `src/features/shop/components/ProductModal.tsx`, `src/features/shop/hooks/useProducts.ts`.

### Backend lien quan

`PUT /products/:id` tren DummyJSON.

### Database lien quan

Khong co database noi bo.

### Trang thai trien khai cu

Needs human confirmation.

### Dieu kien hoan thanh khi dung lai

Co role authorization, validation server-side/client-side, optimistic/cache handling va test.

### Nguon tham chieu trong code

`src/features/shop/pages/ShopPage.tsx`, `src/features/shop/hooks/useProducts.ts`, `src/features/shop/api/productApi.ts`.

### Noi dung can Technical Lead xac nhan

Can Technical Lead xac nhan role sua san pham va field nao duoc phep sua.

## SHOP-08: Xoa san pham

### Muc tieu

Cho phep xoa san pham khoi catalog.

### Nguoi su dung va quyen han

Can Technical Lead xac nhan.

### Dieu kien truoc

User click nut delete tren product card.

### Du lieu dau vao

Product id.

### Rang buoc du lieu

Product id la number.

### Luong thanh cong

Hien confirm modal, user confirm, goi `DELETE /products/:id`, optimistic update list, invalidate list va hien success message.

### Truong hop loi va truong hop bien

Neu API loi thi rollback list tu `previousProducts` va hien `Delete failed`.

### Ket qua dau ra

San pham bi loai khoi danh sach hien thi.

### Business rules

Chua co rule soft delete/hard delete, role, audit hay rang buoc san pham da co order.

### Frontend lien quan

`src/features/shop/pages/ShopPage.tsx`, `src/features/shop/components/ProductCard.tsx`, `src/features/shop/hooks/useProducts.ts`.

### Backend lien quan

`DELETE /products/:id` tren DummyJSON.

### Database lien quan

Khong co database noi bo.

### Trang thai trien khai cu

Needs human confirmation.

### Dieu kien hoan thanh khi dung lai

Co backend authorization, confirm UX, rollback/error handling, rule xoa ro rang va test.

### Nguon tham chieu trong code

`src/features/shop/pages/ShopPage.tsx`, `src/features/shop/hooks/useProducts.ts`, `src/features/shop/api/productApi.ts`.

### Noi dung can Technical Lead xac nhan

Can Technical Lead xac nhan co cho xoa san pham that khong, soft delete hay hard delete.

## PROD-01: Xem chi tiet san pham

### Muc tieu

Cho phep user xem thong tin chi tiet cua mot san pham.

### Nguoi su dung va quyen han

Guest va Authenticated User.

### Dieu kien truoc

User truy cap `/shop/:slug`.

### Du lieu dau vao

Slug tren URL.

### Rang buoc du lieu

Slug phai match `slugify(product.title)` cua mot product tim duoc tu search API.

### Luong thanh cong

Chuyen slug thanh search term, goi search API de tim product id, goi `GET /products/:id`, render title, description, price, rating, image gallery va actions.

### Truong hop loi va truong hop bien

Neu fetch detail loi thi hien error text. Neu khong tim duoc product id thi not-found state chua ro rang.

### Ket qua dau ra

Trang chi tiet san pham duoc hien thi.

### Business rules

Product detail hien tai khong fetch truc tiep bang slug ma phai search de suy ra id.

### Frontend lien quan

`src/features/shop/pages/ProductDetailPage.tsx`, `src/features/shop/hooks/useProducts.ts`, `src/utils/slugify.ts`.

### Backend lien quan

`GET /products/search?q=...`, `GET /products/:id`.

### Database lien quan

Khong co database noi bo.

### Trang thai trien khai cu

Partially implemented.

### Dieu kien hoan thanh khi dung lai

Co route detail on dinh, not-found state ro rang, URL canonical va test.

### Nguon tham chieu trong code

`src/features/shop/pages/ProductDetailPage.tsx`, `src/features/shop/api/productApi.ts`, `src/utils/slugify.ts`.

### Noi dung can Technical Lead xac nhan

Can Technical Lead xac nhan route detail nen dung id, slug hay ca hai.

## PROD-02: Chon mau va anh san pham

### Muc tieu

Cho phep user chon mau va xem anh tuong ung khi xem chi tiet san pham.

### Nguoi su dung va quyen han

Guest va Authenticated User.

### Dieu kien truoc

Product detail da load thanh cong.

### Du lieu dau vao

Danh sach `colors`, `images`, selected color index, current image index.

### Rang buoc du lieu

Neu API khong co du anh theo mau thi tao fallback image. Neu khong co colors thi dung mau mac dinh.

### Luong thanh cong

User click mau, app cap nhat selected color va anh hien tai. User click arrow/thumbnail de doi anh.

### Truong hop loi va truong hop bien

Anh thieu thi dung fallback DummyJSON image. Neu images rong thi UI co the khong day du. Can Technical Lead xac nhan.

### Ket qua dau ra

Mau va anh san pham dang chon duoc hien thi.

### Business rules

Mau mac dinh gom den/trang/xanh theo translation.

### Frontend lien quan

`src/features/shop/pages/ProductDetailPage.tsx`.

### Backend lien quan

Khong co API rieng.

### Database lien quan

Khong co database noi bo. Product co optional `colors`.

### Trang thai trien khai cu

Frontend only.

### Dieu kien hoan thanh khi dung lai

Product schema can ho tro variants/colors/images ro rang va co test UI.

### Nguon tham chieu trong code

`src/features/shop/pages/ProductDetailPage.tsx`, `src/types/product.types.ts`.

### Noi dung can Technical Lead xac nhan

Can Technical Lead xac nhan color/variant co phai domain that khong.

## CART-01: Them san pham vao gio hang

### Muc tieu

Cho phep user dang nhap them san pham vao gio hang.

### Nguoi su dung va quyen han

Authenticated User.

### Dieu kien truoc

User da dang nhap. Neu chua dang nhap thi redirect login.

### Du lieu dau vao

Product va selected color.

### Rang buoc du lieu

Product phai co id. Neu add tu product card thi default color la `product.colors[0]` hoac `Default`.

### Luong thanh cong

`useRequireAuth` cho phep callback, dispatch `addToCart`, neu item cung product id va color da ton tai thi tang quantity, neu chua co thi them item moi.

### Truong hop loi va truong hop bien

Guest bi redirect ve login kem returnUrl. Khong co validation stock.

### Ket qua dau ra

Cart trong Redux Persist duoc cap nhat.

### Business rules

Cart item unique theo `product.id + selectedColor`.

### Frontend lien quan

`src/features/shop/components/ProductCard.tsx`, `src/features/shop/pages/ProductDetailPage.tsx`, `src/features/auth/hooks/useRequireAuth.ts`, `src/features/cart/store/cartSlice.ts`.

### Backend lien quan

Khong co.

### Database lien quan

Khong co database noi bo. Cart luu local qua Redux Persist.

### Trang thai trien khai cu

Frontend only.

### Dieu kien hoan thanh khi dung lai

Co cart behavior ro rang, auth guard, stock validation neu co, persistence mong muon va test.

### Nguon tham chieu trong code

`src/features/cart/store/cartSlice.ts`, `src/features/auth/hooks/useRequireAuth.ts`, `src/features/shop/components/ProductCard.tsx`.

### Noi dung can Technical Lead xac nhan

Can Technical Lead xac nhan cart co can luu server-side va validate stock khong.

## CART-02: Xem va cap nhat gio hang

### Muc tieu

Cho phep user xem gio hang, thay doi so luong va xoa item.

### Nguoi su dung va quyen han

Authenticated User.

### Dieu kien truoc

User truy cap `/cart` va da dang nhap.

### Du lieu dau vao

Cart list, product id, selected color, new quantity.

### Rang buoc du lieu

Quantity input min 1. Neu reducer nhan `newQuantity < 1` thi xoa item.

### Luong thanh cong

Render cart items, user tang/giam/sua quantity hoac xoa item, Redux cart cap nhat.

### Truong hop loi va truong hop bien

Cart rong hien empty message. Product khong tim thay trong reducer thi khong thay doi.

### Ket qua dau ra

Cart list duoc cap nhat tren UI va persisted local.

### Business rules

Xoa item dua tren cap `productId + color`.

### Frontend lien quan

`src/features/cart/pages/CartPage.tsx`, `src/components/ui/QuantityControl.tsx`, `src/features/cart/store/cartSlice.ts`.

### Backend lien quan

Khong co.

### Database lien quan

Khong co database noi bo.

### Trang thai trien khai cu

Frontend only.

### Dieu kien hoan thanh khi dung lai

Co cart UI, empty state, quantity validation, persistence ro rang va test.

### Nguon tham chieu trong code

`src/features/cart/pages/CartPage.tsx`, `src/features/cart/store/cartSlice.ts`.

### Noi dung can Technical Lead xac nhan

Can Technical Lead xac nhan cart local hay server-side trong ban dung lai.

## CART-03: Tinh subtotal, tax va total

### Muc tieu

Tinh tong tien gio hang cho user.

### Nguoi su dung va quyen han

Authenticated User.

### Dieu kien truoc

Cart co hoac khong co item.

### Du lieu dau vao

Danh sach cart item voi `price` va `quantity`.

### Rang buoc du lieu

Tax rate co dinh 10%. Tax duoc round.

### Luong thanh cong

Selector tinh subtotal, tax va total, CartPage render billing section.

### Truong hop loi va truong hop bien

Cart rong tra ve cac tong bang 0.

### Ket qua dau ra

`subTotal`, `tax`, `total`.

### Business rules

Tax = `Math.round(subTotal * 0.1)`.

### Frontend lien quan

`src/features/cart/store/cartSelectors.ts`, `src/features/cart/pages/CartPage.tsx`.

### Backend lien quan

Khong co.

### Database lien quan

Khong co.

### Trang thai trien khai cu

Complete local.

### Dieu kien hoan thanh khi dung lai

Co pricing/tax rule duoc xac nhan, test selector va test UI.

### Nguon tham chieu trong code

`src/features/cart/store/cartSelectors.ts`.

### Noi dung can Technical Lead xac nhan

Can Technical Lead xac nhan tax 10% co phai business rule that khong.

## USER-01: Xem ho so ca nhan

### Muc tieu

Cho phep user dang nhap xem thong tin ca nhan.

### Nguoi su dung va quyen han

Authenticated User.

### Dieu kien truoc

User da dang nhap va profile da duoc fetch.

### Du lieu dau vao

User profile tu `/auth/me`.

### Rang buoc du lieu

Mapper fallback cac field thieu ve chuoi rong hoac `N/A`.

### Luong thanh cong

ProfilePage doc `auth.userData`, render avatar, name, email, phone, dob, gender, company address va home address.

### Truong hop loi va truong hop bien

Dang loading thi hien spinner. Khong co userData thi hien warning not logged in. Field thieu thi hien `N/A`.

### Ket qua dau ra

Thong tin profile hien thi cho user.

### Business rules

Gender male hien tag blue, khac male hien tag magenta/female label.

### Frontend lien quan

`src/features/profile/pages/ProfilePage.tsx`, `src/mappers/authMapper.ts`.

### Backend lien quan

`GET /auth/me`.

### Database lien quan

Khong co database noi bo. Entity lien quan: `UserData`.

### Trang thai trien khai cu

Complete demo.

### Dieu kien hoan thanh khi dung lai

Co profile API, mapping day du, loading/error/empty state va test.

### Nguon tham chieu trong code

`src/features/profile/pages/ProfilePage.tsx`, `src/mappers/authMapper.ts`.

### Noi dung can Technical Lead xac nhan

Can Technical Lead xac nhan user profile fields that su can hien thi.

## I18N-01: Da ngon ngu VI/EN

### Muc tieu

Quan ly text UI bang translation resources.

### Nguoi su dung va quyen han

Guest va Authenticated User.

### Dieu kien truoc

App khoi tao i18next.

### Du lieu dau vao

Translation key va resource `vi`, `en`.

### Rang buoc du lieu

Ngon ngu mac dinh la `vi`, fallback la `vi`.

### Luong thanh cong

Component dung `useTranslation` hoac i18n instance de render text.

### Truong hop loi va truong hop bien

Khong thay UI doi ngon ngu trong code. Mot so text trong file locale co dau hieu encoding loi.

### Ket qua dau ra

Text UI duoc lay tu locale.

### Business rules

Khong co rule nghiep vu ngoai default language.

### Frontend lien quan

`src/i18n.ts`, `src/locales/vi.json`, `src/locales/en.json`.

### Backend lien quan

Khong co.

### Database lien quan

Khong co.

### Trang thai trien khai cu

Partially implemented.

### Dieu kien hoan thanh khi dung lai

Co locale files dung encoding, co language switcher neu can va test translation critical UI.

### Nguon tham chieu trong code

`src/i18n.ts`, `src/locales/vi.json`, `src/locales/en.json`.

### Noi dung can Technical Lead xac nhan

Can Technical Lead xac nhan co can support da ngon ngu va co can UI doi ngon ngu khong.

## SYS-01: Error boundary

### Muc tieu

Bat loi render/runtime trong React tree va hien fallback UI.

### Nguoi su dung va quyen han

Guest va Authenticated User.

### Dieu kien truoc

Component con throw error trong React tree.

### Du lieu dau vao

Error object va React error info.

### Rang buoc du lieu

Chi bat loi trong React rendering lifecycle, khong thay the xu ly API error.

### Luong thanh cong

ErrorBoundary set `hasError`, hien Ant Design Result va nut reload.

### Truong hop loi va truong hop bien

Click reload se reset local state va reload page.

### Ket qua dau ra

Fallback error UI.

### Business rules

Log loi bang `console.error`.

### Frontend lien quan

`src/App.tsx`, `src/components/ui/ErrorBoundary.tsx`.

### Backend lien quan

Khong co.

### Database lien quan

Khong co.

### Trang thai trien khai cu

Missing tests.

### Dieu kien hoan thanh khi dung lai

Co ErrorBoundary, logging strategy phu hop, test fallback UI.

### Nguon tham chieu trong code

`src/App.tsx`, `src/components/ui/ErrorBoundary.tsx`.

### Noi dung can Technical Lead xac nhan

Can Technical Lead xac nhan co can gui error ve monitoring service khong.

# 4. Gaps in the Original Project

- Khong co backend noi bo, controller, service, middleware backend, model hoac migration trong repository.
- Khong co database schema noi bo cho product, cart, order, user.
- Cart chi luu local, khong co backend cart/order/checkout.
- Buy now chi them vao cart va navigate `/cart`, khong co payment/order flow.
- Product CRUD co UI va API client nhung khong co role/authorization ro rang.
- Authorization hien chi nam o frontend route guard, khong co backend authorization de doi chieu.
- Filter va pagination dang client-side, khong co API server-side tuong ung.
- Product detail phai search theo slug de tim id, khong co endpoint detail bang slug.
- Profile chi read-only, khong co update profile.
- README hien la CRA default, chua mo ta domain, setup, API, role, test account.
- Mot so field/type co dau hieu legacy hoac chua dung het: `CartItem.image`, `CartItem.name`, `LoginResponse`.
- Locale file co dau hieu encoding khong dung voi tieng Viet.

# 5. Rebuild Priorities

## P0: Bat buoc de he thong hoat dong

- AUTH-01
- AUTH-02
- AUTH-03
- AUTH-04
- SHOP-01
- PROD-01
- CART-01
- CART-02

Ly do: day la nhom feature tao thanh luong toi thieu: mo app, dang nhap, xem catalog, xem chi tiet, them va quan ly gio hang.

## P1: Chuc nang nghiep vu quan trong

- SHOP-02
- SHOP-04
- SHOP-05
- CART-03
- USER-01

Ly do: nang cao kha nang tim/xem san pham, tinh tien gio hang va ho tro tai khoan user.

## P2: Chuc nang ho tro hoac can xac nhan them

- SHOP-03
- SHOP-06
- SHOP-07
- SHOP-08
- PROD-02
- SYS-01

Ly do: cac feature nay huu ich nhung mot phan dang thieu authorization/domain confirmation, hoac la UX/support layer.

## P3: Co the hoan thien sau

- I18N-01

Ly do: i18n da co nen tang nhung chua co UI doi ngon ngu va can xac nhan co phai requirement bat buoc khong.
