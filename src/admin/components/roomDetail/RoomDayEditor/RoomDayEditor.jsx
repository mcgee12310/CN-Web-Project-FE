import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import styles from "./RoomDayEditor.module.css";
import { formatDate } from "../../../../utils/format";

// Import service đã tạo
import roomService from "../../../../services/admin/room";

// Constants: Dùng để xác định khoảng ngày cần tải (ví dụ: tháng hiện tại)
const getMonthRange = (date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  // Trả về định dạng YYYY-MM-DD
  return {
    from: firstDay.toISOString().split("T")[0],
    to: lastDay.toISOString().split("T")[0],
  };
};

// Component chỉ xem lịch phòng, không chỉnh sửa
function RoomDayEditor({ roomData = {} }) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayInfo, setDayInfo] = useState(null);

  // State mới để lưu dữ liệu lịch từ API
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(false);

  // State theo dõi tháng đang hiển thị trên Calendar
  const [activeDate, setActiveDate] = useState(new Date());

  const roomId = roomData.id;

  // GỌI API LẤY LỊCH PHÒNG
  useEffect(() => {
    if (!roomId) return;

    const fetchCalendarData = async () => {
      setLoading(true);
      const { from, to } = getMonthRange(activeDate);

      try {
        // Gọi service với ID phòng và dải ngày
        const data = await roomService.getRoomCalendar(roomId, from, to);
        console.log(data);
        // Lưu dữ liệu lịch vào state
        setCalendarData(data);
      } catch (err) {
        console.error("Lỗi khi tải lịch phòng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [roomId, activeDate]);

  // HIỂN THỊ CHI TIẾT NGÀY ĐƯỢC CHỌN
  useEffect(() => {
    if (!selectedDate || !calendarData) return;

    const dayStr = selectedDate.toISOString().split("T")[0];
    const found = calendarData.find((d) => d.date === dayStr);

    setDayInfo(found || null);
  }, [selectedDate, calendarData]);

  // CẬP NHẬT TILE CLASSIFICATION (MÀU SẮC TRÊN LỊCH)
  const tileClassName = ({ date, view }) => {
  if (view !== "month" || loading) return "";

  const dayStr = date.toISOString().split("T")[0];
  const info = calendarData.find((d) => d.date === dayStr);

  let classes = [];
  
  // 1. Thêm class trạng thái (Available/Unavailable)
  if (info) {
    classes.push(info.isAvailable ? styles.available : styles.unavailable);
  }

  // 2. Highlight ngày hiện tại (nếu cần)
  // Lấy ngày hôm nay
  const todayStr = new Date().toISOString().split("T")[0];
  if (dayStr === todayStr) {
    // Thêm class today VÀ chỉ thêm class today nếu nó KHÔNG phải là ngày được chọn
    // (Vì ngày được chọn thường có style mạnh hơn)
    if (!selectedDate || dayStr !== selectedDate.toISOString().split("T")[0]) {
      classes.push(styles.today); 
    }
  }

  // 3. Thêm class ngày được chọn
  if (
    selectedDate &&
    dayStr === selectedDate.toISOString().split("T")[0]
  ) {
    classes.push(styles.selected);
  }

  return classes.join(" ");
};

  // Xử lý khi click vào booking code
  const handleBookingClick = () => {
    if (dayInfo?.bookingId) {
      navigate(`/admin/bookings/${dayInfo.bookingId}`);
    }
  };

  if (!roomData || !roomId) return <p>Không có dữ liệu phòng (thiếu ID phòng).</p>;
  if (loading && calendarData.length === 0) return <p>Đang tải lịch...</p>;

  return (
    <section className={styles.container}>
      {/* Calendar */}
      <Calendar
        onActiveStartDateChange={({ activeStartDate }) => {
          setActiveDate(activeStartDate);
        }}
        onClickDay={(date) => setSelectedDate(date)}
        tileClassName={tileClassName}
        locale="vi-VN"
        value={selectedDate}
      />

      {/* Hiển thị thông tin ngày đã chọn */}
      {selectedDate && (
        <div className={styles.editBox}>
          <h3>Ngày: {formatDate(selectedDate)}</h3>

          {dayInfo ? (
            <>
              <div className={styles.formGroup}>
                <label>Giá phòng</label>
                <div className={styles.infoText}>
                  {dayInfo.price.toLocaleString('vi-VN')} VNĐ
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Trạng thái</label>
                <div className={styles.infoText}>
                  {dayInfo.isAvailable ? "Còn phòng" : "Hết phòng"}
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