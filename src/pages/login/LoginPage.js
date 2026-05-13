import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginRefresh } = useAuth(); // Gọi hook chuẩn useAuth vừa tạo
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          expiresInMins: 30, // Token sống trong 30 phút
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const tokenValue = data.accessToken || data.token;

        // 1. Lưu token thật vào localStorage ngay lập tức
        localStorage.setItem("accessToken", tokenValue);

        // 2. Báo cho Context biết để đi lấy profile user về
        loginRefresh(tokenValue);

        // 3. Chuyển hướng sang trang mua sắm
        navigate("/shop");
      } else {
        // Hiển thị thông báo lỗi từ API của DummyJSON trả về
        setErrorMessage(data.message || "Tài khoản hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      setErrorMessage("Lỗi kết nối mạng, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleLoginSubmit} className={styles.loginForm}>
        <h2>ĐĂNG NHẬP HỆ THỐNG</h2>

        {errorMessage && (
          <div className={styles.errorAlert}>{errorMessage}</div>
        )}

        <div className={styles.inputGroup}>
          <label>Tài khoản</label>
          <input
            type="text"
            placeholder="Nhập username (Ví dụ: emilys)"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Mật khẩu</label>
          <input
            type="password"
            placeholder="Nhập password (Ví dụ: emilyspass)"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.loginBtn} disabled={loading}>
          {loading ? "Đang xác thực..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
