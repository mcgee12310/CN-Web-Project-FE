import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

import paymentService from "../../../services/user/payment";
import styles from "./callbackPage.module.css";

export default function VNPayCallback() {
  const [error, setError] = useState(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlParams.entries());

        await paymentService.payment(params);
      } catch (err) {
        console.error("Error processing payment:", err);
        setError("Không thể kết nối đến server. Đang thử lại...");
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <FaSpinner className={styles.spinner} />

        <h2 className={styles.title}>Đang xử lý thanh toán</h2>
        <p className={styles.subtitle}>Vui lòng đợi trong giây lát...</p>

        {error && (
          <div className={styles.errorBox}>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        <div className={styles.dots}>
          <div className={`${styles.dot} ${styles.dot1}`}></div>
          <div className={`${styles.dot} ${styles.dot2}`}></div>
          <div className={`${styles.dot} ${styles.dot3}`}></div>
        </div>
      </div>
    </div>
  );
}
