import React, { useState } from "react";
import styles from "./signup.module.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) {
      newErrors.fullName = "Họ tên là bắt buộc";
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = "Họ tên phải có ít nhất 2 ký tự";
    }

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <div className={styles.signupHeader}>
          <h1 className={styles.signupTitle}>Đăng Ký</h1>
          <p className={styles.signupSubtitle}>Tạo tài khoản mới để bắt đầu!</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <div className={styles.formGroup}>
            <label htmlFor="fullName" className={styles.formLabel}>
              Họ và tên
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`${styles.formInput} ${
                errors.fullName ? styles.inputError : ""
              }`}
              placeholder="Nhập họ và tên của bạn"
            />
            {errors.fullName && (
              <span className={styles.errorMessage}>{errors.fullName}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.formInput} ${
                errors.email ? styles.inputError : ""
              }`}
              placeholder="Nhập email của bạn"
            />
            {errors.email && (
              <span className={styles.errorMessage}>{errors.email}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.formLabel}>
              Số điện thoại
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`${styles.formInput} ${
                errors.phone ? styles.inputError : ""
              }`}
              placeholder="Nhập số điện thoại của bạn"
            />
            {errors.phone && (
              <span className={styles.errorMessage}>{errors.phone}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`${styles.formInput} ${
                errors.password ? styles.inputError : ""
              }`}
              placeholder="Nhập mật khẩu của bạn"
            />
            {errors.password && (
              <span className={styles.errorMessage}>{errors.password}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.formLabel}>
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${styles.formInput} ${
                errors.confirmPassword ? styles.inputError : ""
              }`}
              placeholder="Nhập lại mật khẩu"
            />
            {errors.confirmPassword && (
              <span className={styles.errorMessage}>
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <button type="submit" className={styles.signupButton}>
            Đăng Ký
          </button>
        </form>

        <div className={styles.signupFooter}>
          <p className={styles.loginText}>
            Đã có tài khoản?
            <a href="/login" className={styles.loginLink}>
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
