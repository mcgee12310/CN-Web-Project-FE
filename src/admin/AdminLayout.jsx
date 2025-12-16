import React from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/footer"
import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
  return (
    <div className={styles.container}>
      {/* Navbar */}
      <header className={styles.navbar}>
        <Navbar />
      </header>

      {/* Body: content + footer */}
      <div className={styles.body}>
        {/* Sidebar + Main */}
        <div className={styles.content}>
          <aside className={styles.sidebar}>
            <Sidebar />
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
