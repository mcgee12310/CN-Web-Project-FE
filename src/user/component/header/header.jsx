import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./header.module.css";
import { useAuth } from "../../../auth/auth-context";
import { FiMenu, FiX } from "react-icons/fi";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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
    setMenuOpen(false);
  };

  return (
    <>
      <header className={styles.headerContainer}>
        {/* LEFT */}
        <div className={styles.headerLeft}>
          <div className={styles.logo} onClick={() => handleNavigate("/")}>
            <img
              src="/hikari-logo3.png"
              alt="logo"
              className={styles.logoIcon}
            />
          </div>

          {/* HAMBURGER (move to left, next to logo) */}
          <div
            className={styles.hamburger}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </div>

          {/* DESKTOP NAV */}
          <nav className={styles.headerNav}>
            {tabs.map((t) => (
              <NavLink
                key={t.id}
                to={t.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
              >
                {t.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* RIGHT ACTIONS (giữ nguyên) */}
        <div className={styles.actions}>
          {!user ? (
            <button
              onClick={() => handleNavigate("/login")}
              className={styles.btnLogin}
            >
              Đăng nhập
            </button>
          ) : (
            <>
              <img
                src={user?.avatar || "/avatar-default.jpg"}
                alt="avatar"
                onClick={() => handleNavigate("/profile")}
              />
              <button onClick={() => logout()} className={styles.btnLogout}>
                Đăng xuất
              </button>
            </>
          )}
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
        </div>
      )}
    </>
  );
};

export default Header;
