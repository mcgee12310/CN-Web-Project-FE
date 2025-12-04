import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./header.module.css";
import { useAuth } from "../../../auth/auth-context";
import { IoNotifications } from "react-icons/io5";

const Header = () => {
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();
  const { user } = useAuth();

  const tabsLoggedOut = [
    { id: "home", label: "Trang chủ", path: "/" },
    { id: "explore", label: "Khám phá", path: "/rooms" },
  ];

  const tabsLoggedIn = [
    { id: "home", label: "Trang chủ", path: "/" },
    { id: "explore", label: "Khám phá", path: "/rooms" },
  ];

  const tabs = user ? tabsLoggedIn : tabsLoggedOut;

  const handleClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.path);
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerLeft}>
        <div className={styles.logo}>Logo</div>
        <nav className={styles.headerNav}>
          {tabs.map((t) => (
            <NavLink
              key={t.id}
              to={t.path}
              className={({ isActive }) =>
                isActive ? `${styles.active} ${styles.link}` : styles.link
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className={styles.actions}>
        {!user ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className={styles.btnLogin}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => navigate("/signup")}
              className={styles.btnSignup}
            >
              Đăng ký
            </button>
          </>
        ) : (
          <>
            <IoNotifications />
            <img
              src={user?.avatar || "/avatar-default.jpg"}
              alt="avatar"
              onClick={() => navigate(`/profile`)}
              style={{ cursor: "pointer" }}
            />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
