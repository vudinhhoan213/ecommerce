# Code Review — Ecommerce Frontend

> **Reviewer:** Senior Frontend Engineer (Claude)
> **Date:** 2026-05-16
> **Stack:** React 19 + TypeScript + Redux Toolkit + redux-persist + Ant Design + i18next
> **Scope:** Full codebase review — `src/`

## 1. Critical Issues

### [C-1] Dispatch string type thủ công — `App.tsx:18`

**File:** `src/App.tsx`

```typescript
// ❌ Hiện tại
dispatch({ type: "auth/fetchUserProfile/rejected" });
```

**Tại sao nguy hiểm:**
RTK's `createAsyncThunk` tạo action với cấu trúc `{ type, meta, error }`. Khi dispatch một plain object thiếu `meta` và `error`, handler `addCase(fetchUserProfile.rejected)` trong `authSlice` **có thể không match đúng** tùy vào phiên bản Redux. Kết quả: `loading` (khởi tạo là `true`) không bao giờ được set về `false` → `AuthMiddleware` hiển thị "Đang kiểm tra..." vĩnh viễn.

**Production risk:** User không có token sẽ bị kẹt màn hình loading, không thể vào trang login.

**Sửa ngay:**
```typescript
// authSlice.ts — thêm action
setUnauthenticated: (state) => {
  state.loading = false;
  state.isAuthenticated = false;
  state.userData = null;
},

// App.tsx — dùng action creator
const token = localStorage.getItem("accessToken");
if (token) {
  dispatch(fetchUserProfile(token));
} else {
  dispatch(setUnauthenticated());
}
```

---

### [C-2] `currentPage` không reset khi `products` thay đổi — `ShopPage.tsx:57-62`

**File:** `src/pages/shop/ShopPage.tsx`

**Tại sao nguy hiểm:**
Khi user đang ở trang 3, sau đó xóa nhiều sản phẩm, `totalPages` có thể giảm xuống 1 hoặc 2. `currentPage` vẫn là 3 → `paginatedProducts = []` dù còn sản phẩm. User thấy trang trống, tưởng không còn sản phẩm.

**Production risk:** Broken UX sau thao tác delete — mất sản phẩm hiển thị một cách giả tạo.

**Sửa ngay:**
```typescript
// Thêm useEffect theo dõi products
useEffect(() => {
  if (totalPages > 0 && currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
}, [products.length, totalPages, currentPage]);
```

---

### [C-3] `item: any` trong CartPage làm mất type safety — `CartPage.tsx:34`

**File:** `src/pages/cart/CartPage.tsx`

```typescript
// ❌ Hiện tại
{cartList.map((item: any, index: number) => (
  <div key={`${item.id}-${index}`}>
```

**Tại sao nguy hiểm:**
`item: any` vô hiệu hóa toàn bộ type checking cho cart items. Nếu `CartItem` interface thay đổi, TypeScript sẽ không cảnh báo. `key` dùng `index` thay vì unique ID làm React diff sai khi reorder.

**Sửa ngay:**
```typescript
// Dùng CartItem type, key không dùng index
{cartList.map((item: CartItem) => (
  <div key={`${item.id}-${item.selectedColor}`}>
```

---

### [C-4] `window.location.href` hard redirect trong service layer — `httpClient.ts:36`

**File:** `src/services/httpClient.ts`

```typescript
// ❌ Hiện tại
private handle401(): void {
  localStorage.removeItem("accessToken");
  window.location.href = "/";
}
```

**Tại sao nguy hiểm:**
- Hard reload phá vỡ React Router state, Redux state, và toàn bộ UI context.
- Service layer không nên có side effect liên quan đến routing.
- Không thể unit test.
- Nếu nhiều requests đồng thời đều 401, `handle401` chạy nhiều lần, gây race condition với nhiều redirect.

**Production risk:** Mất unsaved state, cart bị clear nếu redux-persist chưa kịp flush trước redirect.

**Sửa tốt hơn:** Throw error đặc biệt, để store/middleware xử lý:
```typescript
// httpClient.ts
if (response.status === 401) {
  localStorage.removeItem("accessToken");
  throw new Error("UNAUTHORIZED");
}

// authThunk.ts hoặc store middleware — intercept "UNAUTHORIZED" và dispatch logout
```

---

## 2. Architecture Issues

### [A-1] `loading` state dùng chung cho fetch và CRUD operations — `productSlice.ts`

**File:** `src/store/productSlice.ts`

`loading` một boolean dùng chung cho tất cả operations: `fetchProducts`, `fetchProductById`, `createProduct`, `updateProduct`, `deleteProduct`. Khi đang delete một sản phẩm, `loading = true` khiến toàn bộ ShopPage hiển thị skeleton — trải nghiệm người dùng sai.

**Gợi ý:**
```typescript
interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  fetchLoading: boolean;   // cho fetch list/detail
  mutateLoading: boolean;  // cho create/update/delete
  error: string;
}
```

---

### [A-2] Duplicate state: `isLoading` local vs Redux `loading` — `ShopPage.tsx:44`

**File:** `src/pages/shop/ShopPage.tsx`

```typescript
const [isLoading, setIsLoading] = useState(false); // local — cho CRUD
const loading = useSelector(selectProductLoading);  // Redux — cho fetch
```

Hai loading state song song gây nhầm lẫn. `isLoading` local còn được truyền xuống **tất cả** `ProductCard` như prop, làm tất cả cards bị disabled khi đang save/update một sản phẩm bất kỳ.

---

### [A-3] `formatVND` duplicate ở 3 file

**Files:** `src/pages/shop/ShopPage.tsx:51`, `src/pages/shop/ProductDetailPage.tsx:54`, `src/pages/cart/CartPage.tsx:19`

Hàm giống hệt nhau được định nghĩa 3 lần. Vi phạm DRY. Nếu format thay đổi (ví dụ: thêm ký hiệu `₫`), phải sửa 3 chỗ.

**Sửa:** Tạo `src/utils/format.ts`:
```typescript
export const formatVND = (num: number): string =>
  new Intl.NumberFormat("vi-VN").format(num) + " VND";
```

---

### [A-4] `MainLayout` kiểm tra `loading` và `userData` — trùng với `AuthMiddleware`

**File:** `src/components/layout/MainLayout.tsx:27-33`

```typescript
if (loading) return <div>...</div>;
if (!userData) return null;
```

`AuthMiddleware` đã guard route trước khi render Layout. Layout không cần kiểm tra lại — đây là duplicated guard logic. Nếu `userData` là `null` sau khi `AuthMiddleware` đã pass, đó là bug ở tầng trên, không nên xử lý bằng `return null` silent.

---

### [A-5] Selectors trong `productSlice` dùng inline type thay vì `RootState`

**File:** `src/store/productSlice.ts:83-86`

```typescript
// ❌ Hiện tại — inline type dễ mất sync
export const selectProducts = (state: { product: ProductState }) => ...
export const selectCurrentProduct = (state: { product: ProductState }) => ...

// ✅ Nên dùng RootState
import type { RootState } from "./store";
export const selectProducts = (state: RootState) => state.product.products;
```

Nếu store structure thay đổi, các inline types này sẽ lỗi thầm lặng thay vì TypeScript báo lỗi ngay.

---

### [A-6] `MENU_ITEMS` hardcode label tiếng Anh, bỏ qua i18n — `MainLayout.tsx:10-14`

**File:** `src/components/layout/MainLayout.tsx`

```typescript
const MENU_ITEMS = [
  { path: "/shop", label: "Shop", icon: Logo },  // ← hardcode, không dùng t()
  ...
];
```

App có i18n nhưng sidebar menu không dùng. Khi chuyển ngôn ngữ, menu không thay đổi.

---

## 3. Performance Issues

### [P-1] `getImages()` tính toán lại mỗi render — `ProductDetailPage.tsx:78`

**File:** `src/pages/shop/ProductDetailPage.tsx`

```typescript
// ❌ Chạy lại mọi render
const images = getImages();
const colors = product?.colors || DEFAULT_COLORS;
```

`getImages()` duyệt mảng và tạo array mới mỗi lần render. `useCallback` cho `handleColorSelect` phụ thuộc `images.length`, nhưng `images` reference thay đổi mỗi render → memoization không hiệu quả.

**Sửa:**
```typescript
const images = useMemo(() => getImages(), [product]);
const colors = useMemo(() => product?.colors ?? DEFAULT_COLORS, [product]);
```

---

### [P-2] Không có virtualization cho danh sách sản phẩm lớn

**File:** `src/pages/shop/ShopPage.tsx`

Pagination render 20 items/trang — hiện tại chấp nhận được. Nhưng không có virtualization, mỗi `ProductCard` render đồng thời. Nếu `PRODUCTS_PER_PAGE` tăng lên, đây sẽ là bottleneck.

---

### [P-3] `selectCartTotals` tính toán mỗi lần selector chạy — không có memoization

**File:** `src/store/cartSlice.ts:58-63`

```typescript
export const selectCartTotals = (state: RootState) => {
  const subTotal = state.cart.cartList.reduce(...); // tính lại mỗi lần
  const tax = Math.round(subTotal * 0.1);
  return { subTotal, tax, total: subTotal + tax };
};
```

Selector trả về object mới mỗi lần → component re-render mỗi khi bất kỳ phần nào của store thay đổi, dù cart không đổi. Nên dùng `createSelector` từ `reselect`.

**Sửa:**
```typescript
import { createSelector } from "@reduxjs/toolkit";

export const selectCartTotals = createSelector(
  selectCartList,
  (cartList) => {
    const subTotal = cartList.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subTotal * 0.1);
    return { subTotal, tax, total: subTotal + tax };
  }
);
```

---

## 4. TypeScript Issues

### [T-1] `err: any` trong mọi catch block

**Files:** `src/store/authThunk.ts:19`, `src/store/productThunk.ts` (nhiều chỗ), `src/pages/shop/ShopPage.tsx:91`

```typescript
// ❌ Lặp lại khắp nơi
} catch (err: any) {
  return rejectWithValue(err.message);
}
```

`err.message` sẽ crash nếu `err` không phải `Error` object (ví dụ network error trả về string). Nên type narrowing:

```typescript
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  return rejectWithValue(message);
}
```

---

### [T-2] `UserData` interface trộn lẫn raw API fields và computed fields

**File:** `src/types.ts:3-20`

```typescript
export interface UserData {
  // Raw API fields
  firstName: string;
  lastName: string;
  image: string;
  birthDate?: string;
  // Computed fields (được tạo trong authThunk)
  name: string;      // = firstName + lastName
  avatar: string;    // = image
  dob: string;       // = birthDate || "N/A"
}
```

`name` là duplicate của `firstName + lastName`. `avatar` là alias của `image`. Đây là data transformation artifact lọt vào type definition. Nếu API thay đổi field names, phải sửa cả type lẫn thunk.

**Gợi ý:** Tách thành `ApiUserData` (raw) và `UserData` (transformed), hoặc bỏ computed fields ra khỏi interface và tính trực tiếp ở nơi dùng.

---

### [T-3] `CartItem` extends `Product` không tường minh — có optional fields trùng

**File:** `src/types.ts:30-43`

`CartItem` định nghĩa lại nhiều fields từ `Product` (`id`, `title`, `price`, `images`...) nhưng không extend `Product`. Có thể gây drift nếu `Product` thay đổi.

**Gợi ý:**
```typescript
export interface CartItem extends Pick<Product, "id" | "title" | "price" | "thumbnail" | "images" | "rating" | "colors"> {
  selectedColor: string;
  quantity: number;
}
```

---

### [T-4] `CartPage` dùng `useDispatch()` không typed

**File:** `src/pages/cart/CartPage.tsx:15`

```typescript
const dispatch = useDispatch(); // ❌ không typed
```

Nên dùng `useDispatch<AppDispatch>()` như các page khác để có type checking khi dispatch thunk.

---

## 5. Maintainability Issues

### [M-1] `DEFAULT_COLORS` hardcode tiếng Việt, không qua i18n

**File:** `src/pages/shop/ProductDetailPage.tsx:20`

```typescript
const DEFAULT_COLORS = ["Đen", "Trắng", "Xanh"]; // ← hardcode
```

App hỗ trợ EN/VI nhưng fallback colors không theo ngôn ngữ. Nên đưa vào file translation hoặc ít nhất là constants file.

---

### [M-2] Magic values rải rác không có constant

- `expiresInMins: 30` trong `authService` — hardcode, không rõ nguồn gốc
- `0.1` (tax rate) trong `cartSlice.ts:62` — nên là `const TAX_RATE = 0.1`
- `PRODUCTS_PER_PAGE = 20` — đã đặt constant, tốt

---

### [M-3] `cart.itemCount` dùng `cartList.length` thay vì `selectTotalItems`

**File:** `src/pages/cart/CartPage.tsx:26`

```typescript
<span>{t("cart.itemCount", { count: cartList.length })}</span>
```

`cartList.length` là số loại sản phẩm, không phải tổng số lượng. Nếu user thêm 3 cái cùng loại, `cartList.length = 1` nhưng thực tế có 3 items. Nên dùng `selectTotalItems` selector.

---

### [M-4] Comment "Không cần ... nữa" để lại trong code — `cartSlice.ts:5`

```typescript
// Không cần loadCart/saveCart nữa — redux-persist tự xử lý
```

Comment giải thích lịch sử refactor không có giá trị cho reader tương lai. Nên xóa.

---

## 6. Suggested Refactor Plan

### Ngay lập tức (Critical fixes)

1. **[C-1]** Thêm `setUnauthenticated` action vào `authSlice`, thay thế dispatch string thủ công trong `App.tsx`
2. **[C-2]** Thêm `useEffect` reset `currentPage` khi `products.length` hoặc `totalPages` thay đổi trong `ShopPage`
3. **[C-3]** Đổi `item: any` → `item: CartItem` và `key` → `${item.id}-${item.selectedColor}` trong `CartPage`

### Ngắn hạn (1–2 sprint)

4. **[A-3]** Extract `formatVND` vào `src/utils/format.ts`
5. **[T-1]** Thống nhất error handling trong catch blocks — bỏ `err: any`
6. **[P-3]** Dùng `createSelector` cho `selectCartTotals`
7. **[P-1]** Wrap `getImages()` và `colors` trong `useMemo` ở `ProductDetailPage`
8. **[A-5]** Đổi selector types trong `productSlice` sang dùng `RootState`
9. **[T-4]** Typed dispatch trong `CartPage`
10. **[M-3]** Dùng `selectTotalItems` thay `cartList.length` ở cart header

### Dài hạn (Architecture improvements)

11. **[A-1]** Tách `loading` thành `fetchLoading` / `mutateLoading` trong `productSlice`
12. **[C-4]** Refactor 401 handling: throw từ httpClient, xử lý ở store middleware
13. **[T-2]** Tách `ApiUserData` và `UserData` — không để computed fields trong interface
14. **[T-3]** `CartItem extends Pick<Product, ...>` để tránh type drift
15. **[A-6]** Đưa `MENU_ITEMS` labels vào i18n

---

## 7. Positive Feedback

- **Redux Toolkit dùng đúng:** `createSlice` với Immer mutations, `createAsyncThunk` với `rejectWithValue` — pattern chuẩn.
- **redux-persist config hợp lý:** Chỉ persist `auth` và `cart`, không persist `product` (luôn fresh fetch) — đúng business requirement.
- **`clearCurrentProduct` cleanup khi unmount:** `ProductDetailPage` dispatch cleanup trong return của `useEffect` — đúng pattern tránh stale data.
- **`ErrorBoundary` bao toàn app:** Tốt cho production stability.
- **Cart logic theo `id + color`:** Track cart items bằng composite key `productId + selectedColor` — đúng business logic cho sản phẩm nhiều màu.
- **Tách service layer rõ ràng:** `authService`, `productService`, `httpClient` tách biệt trách nhiệm tốt.
- **`LoginPage` kiểm tra `isAuthenticated` sớm:** Redirect ngay nếu đã login, tránh render form không cần thiết.
- **Skeleton loading ở ShopPage:** UX tốt hơn spinner đơn giản.
- **i18n cho toàn bộ UI text:** Nhất quán sử dụng `t()` ở hầu hết nơi.
