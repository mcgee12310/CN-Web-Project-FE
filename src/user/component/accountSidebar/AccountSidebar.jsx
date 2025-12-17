import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { User, CreditCard, Star, Lock, LogOut } from "lucide-react";
import styles from "./AccountSidebar.module.css";
import { useAuth } from "../../../auth/auth-context";

export default function AccountSidebar({ active }) {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 1,
      label: "Thông tin tài khoản",
      icon: User,
      path: "/profile/setting",
    },
    {
      id: 2,
      label: "Đơn của tôi",
      icon: CreditCard,
      path: "/profile/bookings",
    },
    { id: 3, label: "Đánh giá", icon: Star, path: "/profile/reviews" },
    {
      id: 4,
      label: "Thay đổi mật khẩu",
      icon: Lock,
      path: "/profile/password",
    },
  ];

  const handleMenuClick = (item) => {
    navigate(item.path);
  };

  return (
    <div className={styles.sidebar}>
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isLogout = item.action === "logout";

        return isLogout ? (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item)}
            className={`${styles.menuItem} ${styles.logoutButton}`}
          >
            <Icon className={styles.icon} />
            <span>{item.label}</span>
          </button>
        ) : (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.active : styles.inactive}`
            }
          >
            <Icon className={styles.icon} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
}
