import React, { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { loginUser, clearLoginError } from "../store/authSlice";
import type { RootState, AppDispatch } from "../../../lib/store";
import styles from "./LoginPage.module.css";
import { Button, Form, Input, Alert } from "antd";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/shop";

  const { isAuthenticated, loading, loginLoading, loginError } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    dispatch(clearLoginError());
  }, [dispatch]);

  if (loading) return null;
  if (isAuthenticated) return <Navigate to={returnUrl} replace />;

  const handleLoginSubmit = (values: {
    username: string;
    password: string;
  }) => {
    dispatch(
      loginUser({ username: values.username, password: values.password }),
    );
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h2>{t("auth.title")}</h2>
        {loginError && <Alert message={loginError} type="error" showIcon />}
        <Form layout="vertical" onFinish={handleLoginSubmit}>
          <Form.Item
            label={t("auth.username")}
            name="username"
            rules={[{ required: true, message: t("auth.usernameRequired") }]}
          >
            <Input placeholder={t("auth.usernamePlaceholder")} />
          </Form.Item>
          <Form.Item
            label={t("auth.password")}
            name="password"
            rules={[{ required: true, message: t("auth.passwordRequired") }]}
          >
            <Input.Password placeholder={t("auth.passwordPlaceholder")} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.loginBtn}
              loading={loginLoading}
              block
            >
              {t("auth.loginButton")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
