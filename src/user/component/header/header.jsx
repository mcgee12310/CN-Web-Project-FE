import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./header.module.css";
import { useAuth } from "../../../auth/auth-context";
import { IoNotifications } from "react-icons/io5";
import { FiMenu, FiX } from "react-icons/fi";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const tabsLoggedOut = [
    { id: "home", label: "Trang chủ", path: "/" },
    { id: "explore", label: "Khám phá", path: "/rooms" },
  ];

  const tabsLoggedIn = [
    { id: "home", label: "Trang chủ", path: "/" },
    { id: "explore", label: "Khám phá", path: "/rooms" },
  ];

  const tabs = user ? tabsLoggedIn : tabsLoggedOut;

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false); // đóng menu mobile
  };

  return (
    <>
      <header className={styles.headerContainer}>
        {/* LEFT */}
        <div className={styles.headerLeft}>
          <div className={styles.logo} onClick={() => handleNavigate("/")}>
            Logo
          </div>

          {/* DESKTOP NAV */}
          <nav className={styles.headerNav}>
            {tabs.map((t) => (
              <NavLink
                key={t.id}
                to={t.path}
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
              >
                {t.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* ACTIONS */}
        <div className={styles.actions}>
          {!user ? (
            <>
              <button
                onClick={() => handleNavigate("/login")}
                className={styles.btnLogin}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => handleNavigate("/signup")}
                className={styles.btnSignup}
              >
                Đăng ký
              </button>
            </>
          ) : (
            <>
              <IoNotifications className={styles.icon} />
              <img
                src={user?.avatar || "/avatar-default.jpg"}
                alt="avatar"
                onClick={() => handleNavigate("/profile")}
              />
            </>
          )}

          {/* HAMBURGER */}
          <div
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {tabs.map((t) => (
            <div
              key={t.id}
              className={styles.mobileLink}
              onClick={() => handleNavigate(t.path)}
            >
              {t.label}
            </div>
          ))}

          {!user ? (
            <div className={styles.mobileAuth}>
              <button onClick={() => handleNavigate("/login")}>
                Đăng nhập
              </button>
              <button onClick={() => handleNavigate("/signup")}>Đăng ký</button>
            </div>
          ) : (
            <div
              className={styles.mobileProfile}
              onClick={() => handleNavigate("/profile")}
            >
              Hồ sơ cá nhân
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
