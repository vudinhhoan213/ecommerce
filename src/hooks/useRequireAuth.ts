import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import type { RootState } from "../store/store";

/**
 * useRequireAuth — Hook kiểm tra auth trước khi thực hiện action
 *
 * Nếu đã login → chạy action bình thường
 * Nếu chưa login → redirect sang /login kèm returnUrl
 *
 * @returns requireAuth(callback) — wrapper function
 *
 * @example
 * const requireAuth = useRequireAuth();
 *
 * const handleAddToCart = () => {
 *   requireAuth(() => {
 *     dispatch(addToCart({ product, color }));
 *     message.success("Đã thêm vào giỏ hàng");
 *   });
 * };
 */
export function useRequireAuth() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = (callback: () => void) => {
    if (isAuthenticated) {
      callback();
    } else {
      // Redirect về login kèm returnUrl = trang hiện tại
      const returnUrl = encodeURIComponent(
        location.pathname + location.search,
      );
      navigate(`/?returnUrl=${returnUrl}`);
    }
  };

  return requireAuth;
}
