import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./LoginPage.module.css";
import { Button, Form, Input, message, Alert } from "antd";

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginRefresh } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoginSubmit = async (values) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: values.username.trim(),
          password: values.password.trim(),
          expiresInMins: 30,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const tokenValue = data.accessToken || data.token;
        localStorage.setItem("accessToken", tokenValue);
        loginRefresh(tokenValue);

        message.success("Login success!");

        navigate("/shop");
      } else {
        const errorText = data.message || "Tài khoản hoặc mật khẩu không đúng!";
        setErrorMessage(errorText);
      }
    } catch (error) {
      const networkError = "Lỗi kết nối mạng, vui lòng thử lại sau.";
      setErrorMessage(networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h2>ĐĂNG NHẬP HỆ THỐNG</h2>

        {errorMessage && <Alert message={errorMessage} type="error" showIcon />}

        <Form layout="vertical" onFinish={handleLoginSubmit}>
          <Form.Item
            label="User Name"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
          >
            <Input placeholder="Nhập username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Nhập password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.loginBtn}
              loading={loading}
              block
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
