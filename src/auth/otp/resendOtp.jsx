import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import styles from "./resendOtp.module.css";
import authService from "../../services/auth";
import { toast } from "react-toastify";

const emailRegex = /\S+@\S+\.\S+/;

const ResendOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const persistedEmail =
    location.state?.email ||
    localStorage.getItem("pendingVerificationEmail") ||
    "";

  const [email, setEmail] = useState(persistedEmail);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (persistedEmail) {
      setEmail(persistedEmail);
    }
  }, [persistedEmail]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      setError("Vui lòng nhập email đã đăng ký.");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await authService.resendOtp(email);
      localStorage.setItem("pendingVerificationEmail", email);
      toast.success("Mã OTP mới đã được gửi. Vui lòng kiểm tra email của bạn.");
      navigate("/otp", { state: { email } });
    } catch (err) {
      if (!err.response) {
        const msg = "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.";
        setError(msg);
        toast.error(msg);
      } else {
        const msg =
          err.response.data?.message ||
          err.response.data?.error ||
          "Không thể gửi lại mã OTP. Vui lòng thử lại.";
        setError(msg);
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <div className={styles.resendOtpContainer}>
      <div className={styles.resendOtpCard}>
        <button className={styles.backButton} onClick={handleBack}>
          <IoArrowBack />
          <span>Quay lại</span>
        </button>

        <div className={styles.resendOtpHeader}>
          <h1 className={styles.resendOtpTitle}>Gửi lại mã xác thực</h1>
          <p className={styles.resendOtpSubtitle}>
            Tài khoản của bạn chưa được xác thực. Vui lòng nhập email đã đăng ký
            để chúng tôi gửi lại mã OTP.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.resendOtpForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) {
                  setError("");
                }
              }}
              className={`${styles.formInput} ${
                error ? styles.inputError : ""
              }`}
              placeholder="Nhập email đã đăng ký"
              disabled={isSubmitting}
            />
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang gửi..." : "Gửi lại mã OTP"}
          </button>
        </form>

        <div className={styles.resendOtpFooter}>
          <p className={styles.footerText}>
            Lưu ý: Mã OTP sẽ được gửi đến email của bạn. Vui lòng kiểm tra cả
            thư mục spam.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResendOtp;
