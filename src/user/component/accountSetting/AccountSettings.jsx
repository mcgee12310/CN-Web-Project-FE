import React, { useEffect, useState } from "react";
import styles from "./AccountSettings.module.css";
import profileService from "../../../services/user/profile";
import { toast } from "react-toastify";
import { Skeleton, Card } from "antd";

export default function AccountSettings() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phone: "",
    birthday: "",
  });

  const fetchProfile = async () => {
    try {
      const res = await profileService.myInfo();

      setUser(res);
      setFormData({
        email: res.email,
        fullName: res.name,
        phone: res.phone || "",
        birthday: res.birthDate
          ? new Date(res.birthDate).toISOString().split("T")[0]
          : "",
      });
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Avatar
  const getAvatarUrl = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random`;

  // Rank badge
  const getRankClass = (tier) => {
    switch (tier) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await profileService.updateInfo({
        name: formData.fullName,
        phone: formData.phone,
        birthDate: formData.birthday,
      });
      toast.success("Cập nhật thông tin thành công!");
      fetchProfile();
    } catch (error) {
      toast.error("Cập nhật thất bại!");
    }
  };

  const handleDelete = () => {
    alert("Vô hiệu hóa tài khoản (chưa implement)");
  };

  if (!user) {
    return (
      <Card>
        <Skeleton avatar active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  return (
    <div className={styles.accountPage}>
      <div className={styles.header}>
        <h2>Thông tin tài khoản</h2>
      </div>

      <div className={styles.content}>
        {/* LEFT */}
        <div className={styles.avatarSection}>
          <img
            src={getAvatarUrl(user.name)}
            alt="avatar"
            className={styles.avatar}
          />

          <div className={styles.name}>{user.name}</div>

          <div className={`${styles.badge} ${getRankClass(user.customerTier)}`}>
            {user.customerTier}
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

        {/* RIGHT */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" value={formData.email} readOnly />
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
        </form>
      </div>
    </div>
  );
}
