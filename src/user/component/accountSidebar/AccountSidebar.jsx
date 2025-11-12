import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { User, CreditCard, Star, Lock, LogOut } from "lucide-react";
import styles from "./AccountSidebar.module.css";

export default function AccountSidebar({ active }) {
  const navigate = useNavigate();

  const menuItems = [
    { id: 1, label: "Thông tin tài khoản", icon: User, path: "/user/:id/setting" },
    { id: 2, label: "Đơn của tôi", icon: CreditCard, path: "/user/:id/bookings" },
    { id: 3, label: "Đánh giá", icon: Star, path: "/user/:id/reviews" },
    { id: 4, label: "Thay đổi mật khẩu", icon: Lock, path: "/user/:id/password" },
    { id: 5, label: "Đăng xuất", icon: LogOut, action: "logout" }, // ✅ không có path
  ];

  const handleLogout = () => {
    localStorage.clear(); // giả lập đăng xuất
    navigate("/login"); // điều hướng về trang login hoặc home
  };

  const handleMenuClick = (item) => {
    if (item.action === "logout") {
      handleLogout();
    } else {
      navigate(item.path);
    }
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
