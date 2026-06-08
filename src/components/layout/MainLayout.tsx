import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { logout } from "../../store/auth";
import { Logo, Cart, Human } from "../../assets";
import styles from "./MainLayout.module.css";
import type { RootState } from "../../store/store";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 576);

  // Click Outside → đóng logout dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setShowLogout(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Track viewport for mobile sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 576;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };
    // Set initial state
    if (window.innerWidth <= 576) {
      setIsCollapsed(true);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = () => {
    if (isMobile) setIsCollapsed(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowLogout(false);
    navigate("/shop");
  };

  const MENU_ITEMS = [
    { path: "/shop", label: t("layout.nav.shop"), icon: Logo },
    { path: "/cart", label: t("layout.nav.cart"), icon: Cart },
    { path: "/profile", label: t("layout.nav.profile"), icon: Human },
  ];

  return (
    <div className={styles.layoutContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          {isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={styles.hamburgerBtn}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          )}
          <Link to="/shop">
            <img src={Logo} alt="Logo" />
          </Link>
          <h1>{t("layout.appName")}</h1>
        </div>

        <div className={styles.headerRight}>
          {isAuthenticated && userData ? (
            <>
              <span className={styles.greeting}>
                {t("auth.greeting")},{" "}
                <strong>
                  {userData.firstName} {userData.lastName}
                </strong>
              </span>
              <div
                className={styles.avatarWrapper}
                ref={avatarRef}
                onClick={() => setShowLogout((prev) => !prev)}
              >
                <div style={{ cursor: "pointer" }}>
                  <img
                    src={userData.image || userData.avatar}
                    alt="Avatar"
                    className={styles.avatar}
                  />
                </div>
                {showLogout && (
                  <div className={styles.logoutDropdown}>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                      {t("auth.logout")}
                    </button>
                    <Link
                      to="/profile"
                      className={styles.logoutBtn}
                      onClick={() => setShowLogout(false)}
                    >
                      {t("layout.nav.profile")}
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className={styles.logoutBtn}>
              {t("auth.loginButton")}
            </Link>
          )}
        </div>
      </header>

      {/* Sidebar + Content */}
      <div className={styles.subContainer}>
        {/* Overlay on mobile when sidebar is open */}
        {isMobile && !isCollapsed && (
          <div
            className={styles.overlay}
            onClick={() => setIsCollapsed(true)}
          />
        )}

        <aside
          className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}
        >
          <div className={styles.sidebarHeader}>
            {!isCollapsed && <span>{t("layout.menu")}</span>}
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
                  onClick={handleNavClick}
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

        {/* Page content */}
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
