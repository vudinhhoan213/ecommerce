import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Logo, Cart, Human } from "../../assets";
import styles from "./MainLayout.module.css";

const MENU_ITEMS = [
  { path: "/shop", label: "Shop", icon: Logo },
  { path: "/cart", label: "Cart", icon: Cart },
  { path: "/profile", label: "Profile", icon: Human },
];

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Cờ kiểm soát tránh bộ nhớ đệm re-render vô hạn khi crash API
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      navigate("/");
      return;
    }

    fetch("https://dummyjson.com/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Token đã hết hạn hoặc không hợp lệ");
        }
        return res.json();
      })
      .then((data) => {
        // Chỉ cập nhật state nếu component vẫn đang được hiển thị thực tế
        if (isMounted) {
          setUser(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Xác thực thất bại:", err.message);

        if (isMounted) {
          localStorage.removeItem("accessToken"); // Dọn dẹp token lỗi
          setLoading(false);
          navigate("/"); // Đẩy về trang đăng nhập
        }
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // Hàm xử lý Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "100px 20px",
          textAlign: "center",
          fontWeight: "bold",
          color: "#00bee6",
          fontSize: "16px",
        }}
      >
        Đang kiểm tra quyền truy cập hệ thống...
      </div>
    );
  }

  return (
    <div className={styles.layoutContainer}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link to="/shop">
            <img src={Logo} alt="Logo" />
          </Link>
          <h1>Mobile Shopping</h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={{ fontSize: "14px", color: "#333" }}>
            Chào,{" "}
            <strong>
              {user?.firstName} {user?.lastName}
            </strong>
          </span>
          <Link to="/profile">
            <img
              src={user?.image}
              alt="User Avatar"
              className={styles.avatar}
            />
          </Link>
          <button
            onClick={handleLogout}
            style={{
              padding: "6px 12px",
              backgroundColor: "#ff4d4f",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "500",
            }}
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <div className={styles.subContainer}>
        <aside
          className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}
        >
          <div className={styles.sidebarHeader}>
            {!isCollapsed && <span>Menu</span>}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={styles.hamburgerBtn}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          <ul>
            {MENU_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={styles.menuLink}
                  style={({ isActive }) => ({
                    color: isActive ? "#00bee6" : "#000000",
                    fontWeight: isActive ? "bold" : "normal",
                    backgroundColor: isActive ? "#f0fafd" : "transparent",
                  })}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className={styles.menuIcon}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>

        <main className={styles.mainContent}>{children}</main>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>Về chúng tôi</h4>
            <p>
              Mobile Shopping - Cửa hàng điện thoại di động hàng đầu Việt Nam
            </p>
          </div>
          <div className={styles.footerSection}>
            <h4>Liên hệ</h4>
            <p>Email: info@mobileshopping.com</p>
            <p>Phone: 1800-1234</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Theo dõi</h4>
            <p>Facebook | Instagram | Twitter</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Hỗ trợ</h4>
            <p>Chính sách bảo mật</p>
            <p>Điều khoản sử dụng</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
