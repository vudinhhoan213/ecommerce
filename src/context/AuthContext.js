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

      if (!res.ok) {
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
      }

      const data = await res.json();

      setUserData({
        ...data,
        name: `${data.firstName} ${data.lastName}`,
        avatar: data.image,
        dob: data.birthDate || "N/A",
        companyAddress: data.company?.address?.address || "N/A",
        homeAddress: data.address?.address || "N/A",
      });
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

  const updateUserData = (updatedFields) => {
    setUserData((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        loading,
        loginRefresh,
        logout,
        updateUserData,
        isAuthenticated: !!userData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
