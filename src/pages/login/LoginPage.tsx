import React, { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { loginUser } from "../../store/authThunk";
import { clearLoginError } from "../../store/authSlice";
import type { RootState, AppDispatch } from "../../store/store";
import styles from "./LoginPage.module.css";
import { Button, Form, Input, message, Alert } from "antd";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading, loginLoading, loginError } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    dispatch(clearLoginError());
  }, [dispatch]);

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/shop" replace />;

  const handleLoginSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    const result = await dispatch(
      loginUser({ username: values.username, password: values.password }),
    );
    if (loginUser.fulfilled.match(result)) {
      message.success(t("auth.loginSuccess"));
      navigate("/shop");
    }
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
