import React from "react";
import styles from "./Navbar.module.css";
import { Hotel } from 'lucide-react';

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      {/* Logo bên trái */}
      <div className={styles.logo}>
        <div className={styles.logoBox}>
          <Hotel className={styles.logoIcon} />
        </div>
        Hotel Management
      </div>

      {/* Avatar admin bên phải */}
      <div className={styles.user}>
        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className={styles.avatar}
        />
        <span className={styles.username}>Admin</span>
      </div>
    </div>
  );
};

export default Navbar;
