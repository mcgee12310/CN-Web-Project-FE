import React from "react";
import styles from "./Navbar.module.css";
import { Hotel, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const userName = user?.fullName || 'Admin User';
  const userEmail = user?.email || 'admin@example.com';

  // Hàm tạo avatar từ tên
  const getAvatarUrl = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random`;

  // Hàm tạo màu nền từ tên
  const getColorFromName = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 65%, 55%)`;
  };

  return (
    <div className={styles.navbar}>
      {/* Logo bên trái - Redesigned */}
      <div className={styles.logo}>
        <div className={styles.logoBox}>
          {/* <Hotel className={styles.logoIcon} /> */}
          <img
          src="/hikari-logo.png"
          alt="avatar"
          className={styles.logoIcon}
        />
        </div>
        <div className={styles.logoText}>
          <span className={styles.logoName}>HIKARI</span>
          <span className={styles.logoSubtext}>HOTEL</span>
        </div>
      </div>

      {/* Avatar admin bên phải với tên động */}
      <div className={styles.user}>
        <div className={styles.userInfo}>
          <span className={styles.username}>{userName}</span>
        </div>
        <img
          src={getAvatarUrl(userName)}
          alt="avatar"
          className={styles.avatar}
        />
        <ChevronDown className={styles.chevron} />
      </div>
    </div>
  );
};

export default Navbar;
