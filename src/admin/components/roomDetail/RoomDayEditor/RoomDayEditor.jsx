import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { Link } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import styles from "./RoomDayEditor.module.css";

import { formatDate } from "../../../../utils/format";

function RoomDayEditor({ roomData = [], onSave = () => { } }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [price, setPrice] = useState(0);
  const [available, setAvailable] = useState(true);
  const [bookingCode, setBookingCode] = useState("");
  const [original, setOriginal] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Khi chọn ngày từ calendar
  useEffect(() => {
    if (!selectedDate || !roomData) return;

    const dayStr = selectedDate.toISOString().split("T")[0];
    const found = roomData.availableDate?.find((d) => d.date === dayStr);

    if (found) {
      setPrice(found.price);
      setAvailable(found.is_available);
      setBookingCode(found.bookingCode || "");
      setOriginal(found);
    } else {
      setPrice(0);
      setAvailable(true);
      setBookingCode("");
      setOriginal(null);
    }

    setIsDirty(false);
  }, [selectedDate, roomData]);

  const markDirty = () => setIsDirty(true);

  const tileClassName = ({ date, view }) => {
    if (view !== "month" || !roomData) return "";

    const dayStr = date.toISOString().split("T")[0];
    const info = roomData.availableDate?.find((d) => d.date === dayStr);

    let classes = [];

    if (info) {
      classes.push(info.is_available ? styles.available : styles.unavailable);
    }

    if (
      selectedDate &&
      dayStr === selectedDate.toISOString().split("T")[0]
    ) {
      classes.push(styles.selected);
    }

    return classes.join(" ");
  };

  const handleSave = () => {
    if (!isDirty || !roomData || !selectedDate) return;

    const payload = {
      roomId: roomData.id,
      roomNumber: roomData.roomNumber,
      date: selectedDate.toISOString().split("T")[0],
      price,
      is_available: available,
    };

    console.log("SAVE PAYLOAD:", payload);

    onSave(payload);
    setIsDirty(false);
  };

  const handleCancel = () => {
    if (original) {
      setPrice(original.price);
      setAvailable(original.is_available);
    } else {
      setPrice(0);
      setAvailable(true);
    }
    setIsDirty(false);
  };

  if (!roomData) return <p>Không có dữ liệu phòng.</p>;

  return (
    <section className={styles.container}>
      {/* Calendar */}
      <Calendar
        today={null}
        onClickDay={(date) => setSelectedDate(date)}
        tileClassName={tileClassName}
        locale="vi-VN"
        value={selectedDate}
      />

      {/* Form sửa */}
      {selectedDate && (
        <div className={styles.editBox}>
          <h3>Ngày: {formatDate(selectedDate)}</h3>

          <div className={styles.formGroup}>
            <label>Giá phòng</label>
            <input
              type="number"
              className={styles.input}
              value={price}
              onChange={(e) => {
                setPrice(Number(e.target.value));
                markDirty();
              }}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Trạng thái</label>
            <select
              className={styles.input}
              value={available ? "1" : "0"}
              onChange={(e) => {
                setAvailable(e.target.value === "1");
                markDirty();
              }}
            >
              <option value="1">Còn phòng</option>
              <option value="0">Hết phòng</option>
            </select>

            {bookingCode && (
              <p className={styles.bookingLink}>
                Mã đặt phòng:{" "}
                <Link to={`/admin/bookings/${bookingCode}`} className={styles.link}>
                  {bookingCode}
                </Link>
              </p>
            )}
          </div>

          <div className={styles.actions}>
            <button
              className={styles.saveBtn}
              disabled={!isDirty}
              onClick={handleSave}
            >
              Lưu
            </button>
            <button className={styles.cancelBtn} onClick={handleCancel}>
              Hủy
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default RoomDayEditor;
