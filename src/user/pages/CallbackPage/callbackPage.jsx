import React, { useEffect, useState } from "react";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import paymentService from "../../../services/user/payment";
import styles from "./callbackPage.module.css";

export default function VNPayCallback() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const processPayment = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlParams.entries());
        const res = await paymentService.payment(params);

        if (res.status === 200) {
          setSuccess(true);
          // Chuyển hướng sau 2 giây
          setTimeout(() => {
            navigate("/profile/bookings", { replace: true });
          }, 2000);
        }
      } catch (err) {
        console.error("Error processing payment:", err);
        setError("Không thể kết nối đến server. Đang thử lại...");
      }
    };
    processPayment();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {!success ? (
          <>
            <FaSpinner className={styles.spinner} />
            <h2 className={styles.title}>Đang xử lý thanh toán</h2>
            <p className={styles.subtitle}>Vui lòng đợi trong giây lát...</p>
          </>
        ) : (
          <>
            <FaCheckCircle className={styles.successIcon} />
            <h2 className={styles.title}>Thanh toán thành công!</h2>
            <p className={styles.subtitle}>Đang chuyển hướng...</p>
          </>
        )}

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
