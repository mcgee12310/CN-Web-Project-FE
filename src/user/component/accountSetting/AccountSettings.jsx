import React, { useState } from "react";
import styles from "./AccountSettings.module.css";

const user = {
  id: 1,
  name: "Nguyễn Văn A",
  email: "a@gmail.com",
  phone: "0123456789",
  birthDate: "2025-11-02T07:10:17.429Z",
  rank: "DIAMOND",
  totalBookings: 8,
  totalSpent: 12500000,
};

export default function AccountSettings() {
  const [formData, setFormData] = useState({
    email: user.email,
    fullName: user.name,
    phone: user.phone,
    birthday: new Date(user.birthDate).toISOString().split("T")[0],
    gender: user.gender,
  });

  // Hàm sinh avatar ngẫu nhiên
  const getAvatarUrl = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random`;

  const getRankClass = (rank) => {
    switch (rank) {
      case "SILVER":
        return styles.silver;
      case "GOLD":
        return styles.gold;
      case "DIAMOND":
        return styles.diamond;
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Information updated!");
  };

  const handleDelete = () => {
    alert("Account deleted!");
  };

  return (
    <div className={styles.accountPage}>
      <div className={styles.header}>
        <h2>Thông tin tài khoản</h2>
      </div>
      <div className={styles.content}>
        <div className={styles.avatarSection}>
          <img
            src={getAvatarUrl(user.name)}
            alt="avatar"
            className={styles.avatar}
          />
          <div className={styles.name}>{user.name}</div>
          <div className={`${styles.badge} ${getRankClass(user.rank)}`}>
            {user.rank}
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{user.totalBookings}</div>
              <div className={styles.statLabel}>Đơn đã đặt</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>
                {user.totalSpent.toLocaleString("vi-VN")}₫
              </div>
              <div className={styles.statLabel}>Tổng chi tiêu</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} readOnly />
          </div>

          <div className={styles.field}>
            <label>Họ và tên</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label>Ngày sinh</label>
            <input
              type="date"
              name="birthday"
              defaultValue={formData.birthday}
              value={formData.birthday}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className={styles.submit}>
            Lưu thông tin
          </button>

          <button
            type="delete"
            className={styles.delete}
            onClick={handleDelete}
          >
            Vô hiệu hóa tài khoản
          </button>
        </form>
      </div>
    </div>
  );
}
