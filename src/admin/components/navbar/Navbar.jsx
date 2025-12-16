import React, { useState } from "react";
import styles from "./Navbar.module.css";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const userName = user?.fullName || "Admin User";

  const getAvatarUrl = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const goToUserView = () => {
    navigate("/");
  };

  return (
    <div className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo}>
        <img src="/hikari-logo3.png" alt="logo" className={styles.logoIcon} />
        <div className={styles.logoText}>
          <span className={styles.logoName}>HIKARI</span>
          <span className={styles.logoSubtext}>HOTEL</span>
        </div>
      </div>

      {/* User menu */}
      <div className={styles.userWrapper}>
        <div className={styles.user}>
          <span className={styles.username}>{userName}</span>
          <img src={getAvatarUrl(userName)} className={styles.avatar} />
          <ChevronDown className={styles.chevron} />
        </div>

        <div className={styles.dropdown}>
          <button className={styles.dropdownItem} onClick={goToUserView}>
            <User size={16} />
            <span>Giao diện người dùng</span>
          </button>

          <button
            className={`${styles.dropdownItem} ${styles.logout}`}
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
