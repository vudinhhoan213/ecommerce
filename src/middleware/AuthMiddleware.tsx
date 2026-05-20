import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState } from "../store/store";

const AuthMiddleware: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth,
  );

  if (loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center", fontSize: "18px" }}>
        {t("auth.checkingAccess")}
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect về trang login kèm returnUrl để sau login quay lại
    return (
      <Navigate
        to={`/?returnUrl=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }

  return <Outlet />;
};

export default AuthMiddleware;
