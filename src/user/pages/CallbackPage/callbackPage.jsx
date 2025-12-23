import React, { useEffect, useState } from "react";
import { FaSpinner, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import paymentService from "../../../services/user/payment";
import styles from "./callbackPage.module.css";

export default function VNPayCallback() {
  const [status, setStatus] = useState("loading");
  // loading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const processPayment = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlParams.entries());

        const res = await paymentService.payment(params);
        console.log("Payment response:", res);

        if (res.status === 200) {
          if (res.data.status === "failed") {
            setStatus("error");
            setErrorMessage("Giao dịch không thành công hoặc đã bị hủy.");
          } else {
            setStatus("success");
          }

          setTimeout(() => {
            navigate("/profile/bookings", { replace: true });
          }, 2000);
        }
      } catch (err) {
        console.error("Error processing payment:", err);
        setStatus("error");
        setErrorMessage("Không thể kết nối đến server.");
      }
    };

    processPayment();
  }, [navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {status === "loading" && (
          <>
            <FaSpinner className={styles.spinner} />
            <h2 className={styles.title}>Đang xử lý thanh toán</h2>
            <p className={styles.subtitle}>Vui lòng đợi trong giây lát...</p>

            <div className={styles.dots}>
              <div className={`${styles.dot} ${styles.dot1}`}></div>
              <div className={`${styles.dot} ${styles.dot2}`}></div>
              <div className={`${styles.dot} ${styles.dot3}`}></div>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <FaCheckCircle className={styles.successIcon} />
            <h2 className={styles.title}>Thanh toán thành công</h2>
            <p className={styles.subtitle}>Đang chuyển hướng...</p>
          </>
        )}

        {status === "error" && (
          <>
            <FaTimesCircle className={styles.errorIcon} />
            <h2 className={styles.title}>Thanh toán thất bại</h2>
            <p className={styles.errorText}>{errorMessage}</p>
            <p className={styles.subtitle}>Đang chuyển hướng...</p>
          </>
        )}
      </div>
    </div>
  );
}
