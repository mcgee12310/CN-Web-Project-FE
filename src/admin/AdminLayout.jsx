import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/footer";
import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={styles.container}>
      {/* Navbar - truyền toggle function */}
      <header className={styles.navbar}>
        <Navbar onToggleSidebar={toggleSidebar} />
      </header>

      {/* Body: content + footer */}
      <div className={styles.body}>
        {/* Overlay cho mobile */}
        <div
          className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ""}`}
          onClick={closeSidebar}
        />

        {/* Sidebar + Main */}
        <div className={styles.content}>
          <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
            <Sidebar onClose={closeSidebar} />
          </aside>

          <main className={styles.main}>
            <Outlet />
          </main>
        </div>

        {/* Footer nằm dưới cả sidebar + main */}
        <footer className={styles.footer}>
          <Footer />
        </footer>
      </div>
    </div>
  );
}