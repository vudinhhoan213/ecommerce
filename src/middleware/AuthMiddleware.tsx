import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState } from "../store/store";

const AuthMiddleware: React.FC = () => {
  const { t } = useTranslation();
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

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default AuthMiddleware;
