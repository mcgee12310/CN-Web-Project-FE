import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./otp.module.css";
import { IoArrowBack } from "react-icons/io5";
import authService from "../../services/auth";
import { toast } from "react-toastify";

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  const email =
    location.state?.email ||
    localStorage.getItem("pendingVerificationEmail") ||
    "";

  useEffect(() => {
    if (!email) {
      navigate("/signup");
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [email, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setError("");
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;
    const next = [...otp];
    for (let i = 0; i < 6; i++) next[i] = pasted[i] || "";
    setOtp(next);
    setError("");
    const last = Math.min(pasted.length - 1, 5);
    inputRefs.current[last]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 số OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // GỌI API VỚI CHUỖI
      const res = await authService.verifyOtp(email, otpCode);

      // Tuỳ backend: nếu trả { success: true } hoặc chỉ cần HTTP 200 là ok
      if (res?.success !== false) {
        localStorage.removeItem("pendingVerificationEmail");
        toast.success("Xác thực thành công! Vui lòng đăng nhập.");
        navigate("/login", {
          state: { message: "Xác thực thành công! Vui lòng đăng nhập." },
        });
      } else {
        // server trả success=false
        setError(res?.message || "Mã OTP không đúng. Vui lòng thử lại.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        toast.error(res?.message || "Mã OTP không đúng.");
      }
    } catch (error) {
      // phân biệt lỗi mạng / lỗi server
      if (!error.response) {
        setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
        toast.error("Không thể kết nối đến máy chủ.");
      } else if (
        error.response.status === 400 ||
        error.response.status === 401
      ) {
        const msg = error.response.data?.message || "Mã OTP không đúng.";
        setError(msg);
        toast.error(msg);
      } else {
        setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    setIsLoading(true);
    setError("");

    try {
      await authService.resendOtp(email);
      setTimer(300);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      toast.success("Mã OTP mới đã được gửi đến email của bạn!");
    } catch (error) {
      setError("Không thể gửi lại mã OTP. Vui lòng thử lại sau.");
      toast.error("Không thể gửi lại mã OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => navigate("/signup");

  return (
    <div className={styles.otpContainer}>
      <div className={styles.otpCard}>
        <button className={styles.backButton} onClick={handleBack}>
          <IoArrowBack />
          <span>Quay lại</span>
        </button>

        <div className={styles.otpHeader}>
          <h1 className={styles.otpTitle}>Xác thực tài khoản</h1>
          <p className={styles.otpSubtitle}>
            Chúng tôi đã gửi mã OTP đến email
            <br />
            <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.otpForm}>
          <div className={styles.otpInputs}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`${styles.otpInput} ${
                  error ? styles.inputError : ""
                }`}
                disabled={isLoading}
              />
            ))}
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.timerContainer}>
            <p className={styles.timerText}>
              Mã OTP sẽ hết hạn sau:{" "}
              <span className={styles.timer}>{formatTime(timer)}</span>
            </p>
          </div>

          <button
            type="submit"
            className={styles.verifyButton}
            disabled={isLoading || otp.join("").length !== 6}
          >
            {isLoading ? "Đang xác thực..." : "Xác thực"}
          </button>

          <div className={styles.resendContainer}>
            <p className={styles.resendText}>
              Không nhận được mã?{" "}
              <button
                type="button"
                className={`${styles.resendButton} ${
                  !canResend ? styles.disabled : ""
                }`}
                onClick={handleResendOTP}
                disabled={!canResend || isLoading}
              >
                Gửi lại mã
              </button>
            </p>
          </div>
        </form>

        <div className={styles.otpFooter}>
          <p className={styles.footerText}>
            Lưu ý: Mã OTP có hiệu lực trong 5 phút. Vui lòng kiểm tra cả thư mục
            spam.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTP;
