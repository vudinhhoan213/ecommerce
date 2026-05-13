import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Ban đầu chưa có dữ liệu, để là null thay vì Mock Data
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm fetch lấy dữ liệu thật từ API /auth/me bằng Token
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("accessToken");

    // Nếu không có Token, dừng xử lý và chuyển trạng thái loading
    if (!token) {
      setUserData(null);
      setLoading(false);
      return;
    }

    try {
      // Sử dụng chính xác đoạn mã API fetch bạn gửi
      const response = await fetch("https://dummyjson.com/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUserData({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          gender: data.gender,
          dob: data.birthDate || data.dob || "N/A",
          avatar: data.image,
          companyAddress: data.address?.address || "N/A",
          homeAddress: data.address?.address || "N/A",
        });
      } else {
        localStorage.removeItem("accessToken");
        setUserData(null);
      }
    } catch (error) {
      console.error("Lỗi kết nối API /auth/me:", error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const updateUserData = (updatedFields) => {
    setUserData((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        updateUserData,
        loading,
        loginRefresh: fetchCurrentUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
