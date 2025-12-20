import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import styles from "./RoomDayEditor.module.css";
import { formatDate } from "../../../../utils/format";

import roomService from "../../../../services/admin/room";

/**
 * Format date YYYY-MM-DD (tránh lệch timezone)
 */
const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Lấy khoảng ngày của tháng hiện tại
 */
const getMonthRange = (date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return {
    from: formatDateToYYYYMMDD(firstDay),
    to: formatDateToYYYYMMDD(lastDay),
  };
};

function RoomDayEditor({ roomData = {} }) {
  const navigate = useNavigate();
  const roomId = roomData.id;

  const [selectedDate, setSelectedDate] = useState(null);
  const [dayInfo, setDayInfo] = useState(null);

  // dữ liệu lịch theo tháng
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(false);

  // tháng đang hiển thị (CHỈ dùng để gọi API)
  const [activeDate, setActiveDate] = useState(new Date());

  /**
   * GỌI API KHI ĐỔI THÁNG
   */
  useEffect(() => {
    if (!roomId) return;

    const fetchCalendarData = async () => {
      setLoading(true);
      const { from, to } = getMonthRange(activeDate);

      try {
        const data = await roomService.getRoomCalendar(roomId, from, to);
        setCalendarData(data || []);
      } catch (err) {
        console.error("Lỗi khi tải lịch phòng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [roomId, activeDate]);

  /**
   * CẬP NHẬT THÔNG TIN NGÀY ĐƯỢC CHỌN
   */
  useEffect(() => {
    if (!selectedDate) {
      setDayInfo(null);
      return;
    }

    const dayStr = formatDateToYYYYMMDD(selectedDate);
    const found = calendarData.find((d) => d.date === dayStr);
    setDayInfo(found || null);
  }, [selectedDate, calendarData]);

  /**
   * TÔ MÀU NGÀY TRÊN CALENDAR
   */
  const tileClassName = ({ date, view }) => {
    if (view !== "month" || loading) return "";

    const dayStr = formatDateToYYYYMMDD(date);
    const info = calendarData.find((d) => d.date === dayStr);

    const classes = [];

    // trạng thái phòng
    if (info) {
      classes.push(info.isAvailable ? styles.available : styles.unavailable);
    }

    // hôm nay
    const todayStr = formatDateToYYYYMMDD(new Date());
    if (
      dayStr === todayStr &&
      (!selectedDate ||
        dayStr !== formatDateToYYYYMMDD(selectedDate))
    ) {
      classes.push(styles.today);
    }

    // ngày đang chọn
    if (selectedDate && dayStr === formatDateToYYYYMMDD(selectedDate)) {
      classes.push(styles.selected);
    }

    return classes.join(" ");
  };

  /**
   * CLICK BOOKING
   */
  const handleBookingClick = () => {
    if (dayInfo?.bookingId) {
      navigate(`/admin/bookings/${dayInfo.bookingId}`);
    }
  };

  if (!roomId) {
    return <p>Không có dữ liệu phòng (thiếu ID phòng).</p>;
  }

  return (
    <section className={styles.container}>
      {/* CALENDAR */}
      <Calendar
        locale="vi-VN"
        onClickDay={(date) => setSelectedDate(date)}
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate) {
            setActiveDate(activeStartDate);
            setSelectedDate(null);
            setDayInfo(null);
          }
        }}
        tileClassName={tileClassName}
      />

      {/* THÔNG TIN NGÀY */}
      {selectedDate && (
        <div className={styles.editBox}>
          <h3>Ngày: {formatDate(selectedDate)}</h3>

          {dayInfo ? (
            <>
              <div className={styles.formGroup}>
                <label>Giá phòng</label>
                <div className={styles.infoText}>
                  {dayInfo.price.toLocaleString("vi-VN")} VNĐ
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Trạng thái</label>
                <div className={styles.infoText}>
                  {dayInfo.isAvailable ? "Còn phòng" : "Đã đặt"}
                </div>
              </div>

              {dayInfo.bookingCode && (
                <div className={styles.formGroup}>
                  <label>Mã đặt phòng</label>
                  <div
                    className={styles.bookingLink}
                    onClick={handleBookingClick}
                  >
                    {dayInfo.bookingCode}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className={styles.noData}>Chưa có dữ liệu cho ngày này</p>
          )}
        </div>
      )}
    </section>
  );
}

export default RoomDayEditor;
  