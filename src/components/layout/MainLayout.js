import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Logo, Cart, Human } from "../../assets";
import styles from "./MainLayout.module.css";

const MENU_ITEMS = [
  { path: "/shop", label: "Shop", icon: Logo },
  { path: "/cart", label: "Cart", icon: Cart },
  { path: "/profile", label: "Profile", icon: Human },
];

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const { userData, loading, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        Đang kiểm tra quyền truy cập hệ thống...
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={styles.layoutContainer}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link to="/shop">
            <img src={Logo} alt="Logo" />
          </Link>
          <h1>Mobile Shopping</h1>
        </div>

        <div className={styles.headerRight}>
          <span className={styles.greeting}>
            Chào,{" "}
            <strong>
              {userData.firstName} {userData.lastName}
            </strong>
          </span>
          <Link to="/profile">
            <img
              src={userData.image || userData.avatar}
              alt="User Avatar"
              className={styles.avatar}
            />
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
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
