import React, { useState } from "react";
import styles from "./BookingSection.module.css";
import { IoCalendar, IoPeople } from "react-icons/io5";

function BookingSection({ roomData }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      alert("Vui lòng chọn ngày check-in và check-out");
      return;
    }
    alert("Đặt phòng thành công!");
  };

  return (
    <section className={styles.bookingSection}>
      <div className={styles.priceBox}>
        <div className={styles.price}>
          <span className={styles.priceAmount}>{roomData.price}</span>
          <span className={styles.priceUnit}> {roomData.currency}</span>
        </div>
        <div className={styles.priceNote}>Giá đã bao gồm thuế</div>
      </div>

      <div className={styles.bookingForm}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <IoCalendar className={styles.labelIcon} />
            Check-in
          </label>
          <input
            type="date"
            className={styles.input}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
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
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <IoPeople className={styles.labelIcon} />
            Số khách
          </label>
          <div className={styles.guestSelector}>
            <button
              className={styles.guestButton}
              onClick={() => setGuests(Math.max(1, guests - 1))}
              disabled={guests <= 1}
            >
              −
            </button>
            <span className={styles.guestCount}>{guests}</span>
            <button
              className={styles.guestButton}
              onClick={() => setGuests(Math.min(roomData.guests, guests + 1))}
              disabled={guests >= roomData.guests}
            >
              +
            </button>
          </div>
        </div>

        <button className={styles.bookButton} onClick={handleBooking}>
          Đặt phòng ngay
        </button>

        <div className={styles.bookingNote}>
          Bạn sẽ không bị tính phí ngay bây giờ
        </div>
      </div>
    </section>
  );
}

export default BookingSection;
