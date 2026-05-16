import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { logout } from "../../store/authSlice";
import { Logo, Cart, Human } from "../../assets";
import styles from "./MainLayout.module.css";
import type { RootState } from "../../store/store";

const MENU_ITEMS = [
  { path: "/shop", label: "Shop", icon: Logo },
  { path: "/cart", label: "Cart", icon: Cart },
  { path: "/profile", label: "Profile", icon: Human },
];

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state: RootState) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (loading) {
    return (
      <div className={styles.loadingScreen}>{t("auth.checkingAccess")}</div>
    );
  }

  if (!userData) return null;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className={styles.layoutContainer}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link to="/shop">
            <img src={Logo} alt="Logo" />
          </Link>
          <h1>{t("layout.appName")}</h1>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.greeting}>
            {t("auth.greeting")},{" "}
            <strong>
              {userData.firstName} {userData.lastName}
            </strong>
          </span>
          <Link to="/profile">
            <img
              src={userData.image || userData.avatar}
              alt="Avatar"
              className={styles.avatar}
            />
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            {t("auth.logout")}
          </button>
        </div>
      </header>

      <div className={styles.subContainer}>
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
            <h4>{t("layout.footer.about")}</h4>
            <p>{t("layout.footer.aboutText")}</p>
          </div>
          <div className={styles.footerSection}>
            <h4>{t("layout.footer.contact")}</h4>
            <p>{t("layout.footer.email")}</p>
            <p>{t("layout.footer.phone")}</p>
          </div>
          <div className={styles.footerSection}>
            <h4>{t("layout.footer.follow")}</h4>
            <p>{t("layout.footer.social")}</p>
          </div>
          <div className={styles.footerSection}>
            <h4>{t("layout.footer.support")}</h4>
            <p>{t("layout.footer.privacy")}</p>
            <p>{t("layout.footer.terms")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
