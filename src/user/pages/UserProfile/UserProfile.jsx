import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "../../component/header/header";
import Footer from "../../component/footer/footer";
import AccountSidebar from "../../component/accountSidebar/AccountSidebar";

import styles from "./UserProfile.module.css";

export default function UserProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  // Xác định tab đang active dựa trên đường dẫn
  const getActiveTab = () => {
    if (location.pathname.includes("/account/bookings")) return "My bookings";
    if (location.pathname.includes("/account/reviews")) return "My reviews";
    if (location.pathname.includes("/account/password")) return "Change password";
    return "Personal info";
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>

          <div className={styles.content}>
            <AccountSidebar active={getActiveTab()} />
            <div className={styles.outletWrapper}>
              {/* 👇 Framer Motion animation vùng outlet */}
              <AnimatePresence mode="wait" initial={true}>
                <motion.div
                  key={location.pathname} // mỗi route là 1 animation riêng
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ height: "100%" }}
                >
                  {/* 👇 Giúp render outlet MƯỢT, không bị hiện sớm */}
                  <React.Suspense fallback={<div className={styles.loading}>Đang tải...</div>}>
                    <Outlet />
                  </React.Suspense>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
