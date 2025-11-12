import React from "react";
import styles from "./DetailHeader.module.css";
import { IoCalendar } from "react-icons/io5";

function DetailHeader({
  checkInDate = "",
  checkOutDate = "",
  onChangeCheckIn,
  onChangeCheckOut,
}) {
  const today = new Date().toISOString().split("T")[0];

  const handleSearch = () => {
    if (!checkInDate || !checkOutDate) {
      alert("Vui lòng chọn ngày check-in và check-out");
      return;
    }
  };

  const handleCheckInChange = (value) => {
    onChangeCheckIn?.(value);
    if (checkOutDate && new Date(checkOutDate) <= new Date(value)) {
      onChangeCheckOut?.("");
    }
  };

  const handleCheckOutChange = (value) => {
    onChangeCheckOut?.(value);
  };

  return (
    <section className={styles.detailSection}>
      <div className={styles.searchForm}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <IoCalendar className={styles.labelIcon} />
            Check-in
          </label>
          <input
            type="date"
            className={styles.input}
            value={checkInDate}
            onChange={(e) => handleCheckInChange(e.target.value)}
            min={today}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <IoCalendar className={styles.labelIcon} />
            Check-out
          </label>
          <input
            type="date"
            className={styles.input}
            value={checkOutDate}
            onChange={(e) => handleCheckOutChange(e.target.value)}
            min={checkInDate || today}
          />
        </div>
        <button className={styles.searchButton} onClick={handleSearch}>
          Tìm kiếm ngay
        </button>
      </div>
    </section>
  );
}

export default DetailHeader;
