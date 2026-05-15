import React from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./ProfilePage.module.css";
import { CalendarFilled } from "@ant-design/icons";

const ProfilePage = () => {
  const { userData, loading } = useAuth();

  if (loading) {
    return (
      <div className={styles.loading}>Đang tải thông tin người dùng...</div>
    );
  }

  if (!userData) {
    return (
      <div className={styles.loading}>
        Vui lòng đăng nhập để xem thông tin cá nhân.
      </div>
    );
  }

  return (
    <div className={styles.myProfileContainer}>
      <div className={styles.title}>My Profile</div>
      <div className={styles.headerInfo}>
        <img
          src={userData.avatar || userData.image}
          alt="User Avatar"
          className={styles.avatar}
        />
        <div className={styles.metaText}>
          <h1>{userData.name}</h1>
          <p>Email: {userData.email}</p>
        </div>
      </div>

      <div className={styles.infoForm}>
        <div className={styles.formGroup}>
          <span className={styles.label}>Date of birth:</span>
          <div className={styles.valueWrapper}>
            <span className={styles.valueText}>{userData.dob}</span>
            <span className={styles.icon}>
              <CalendarFilled />
            </span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <span className={styles.label}>Sex:</span>
          <div className={styles.valueWrapper}>
            <span className={styles.valueText}>{userData.gender}</span>
            <span className={styles.icon}>▼</span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <span className={styles.label}>Address Company:</span>
          <div className={styles.valueWrapper}>
            <span className={styles.valueText}>{userData.companyAddress}</span>
            <span className={styles.icon}></span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <span className={styles.label}>Address Home:</span>
          <div className={styles.valueWrapper}>
            <span className={styles.valueText}>{userData.homeAddress}</span>
            <span className={styles.icon}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
