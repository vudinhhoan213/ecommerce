import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthMiddleware = () => {
  const { isAuthenticated, loading } = useAuth();

  // Nếu đang trong quá trình chờ API /auth/me xác thực token cũ, hiện màn hình chờ tạm thời
  if (loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center", fontSize: "18px" }}>
        Đang kiểm tra quyền truy cập hệ thống...
      </div>
    );
  }

  // Nếu đã xác thực xong: Đúng user thật -> Cho đi tiếp vào các trang con (Outlet)
  // Nếu không có user -> Đá văng ngược về trang đăng nhập gốc "/"
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default AuthMiddleware;
