import React from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/navbar/Navbar";
import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
  return (
    <div className={styles.container}>
      {/* Navbar trên cùng */}
      <header className={styles.navbar}>
        <Navbar />
      </header>

      <div className={styles.body}>
        {/* Sidebar bên trái */}
        <aside className={styles.sidebar}>
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
