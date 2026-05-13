import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (token) => {
    try {
      const res = await fetch("https://dummyjson.com/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error("Lỗi xác thực người dùng:", err.message);
      localStorage.removeItem("accessToken");
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const loginRefresh = (token) => {
    setLoading(true);
    fetchUserProfile(token);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUserData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        loading,
        loginRefresh,
        logout,
        isAuthenticated: !!userData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
