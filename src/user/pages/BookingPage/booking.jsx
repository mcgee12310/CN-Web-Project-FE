import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../component/header/header";
import Footer from "../../component/footer/footer";
import styles from "./booking.module.css";
import { IoChevronBack, IoPricetag } from "react-icons/io5";
import { toast } from "react-toastify";
import roomService from "../../../services/user/room";

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;
  const [paymentMethod, setPaymentMethod] = useState("VNPAY");
  const [bookingNote, setBookingNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    checkInDate,
    checkOutDate,
    totalPeople,
    selectedRooms = [],
    roomType = "Phòng",
    price = "",
    heroImage = "",
  } = bookingData || {};

  // 🔹 Tính số đêm
  const numberOfNights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diff = end.getTime() - start.getTime();
    if (Number.isNaN(diff) || diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [checkInDate, checkOutDate]);

  // 🔹 Đơn giá
  const unitPrice = useMemo(() => {
    if (!price) return 0;
    const numeric = parseInt(String(price).replace(/[^\d]/g, ""), 10);
    return Number.isNaN(numeric) ? 0 : numeric;
  }, [price]);

  const formatPrice = (price) => price.toLocaleString("vi-VN") + " VNĐ";

  const nightsUsed = numberOfNights > 0 ? numberOfNights : 1;
  const roomCount = selectedRooms.length;
  const totalPrice =
    unitPrice > 0 && roomCount > 0 ? unitPrice * roomCount * nightsUsed : 0;

  const effectiveTotalPeople = useMemo(() => {
    if (typeof totalPeople === "number" && totalPeople > 0) return totalPeople;
    return selectedRooms.reduce((sum, room) => sum + (room.occupancy || 0), 0);
  }, [totalPeople, selectedRooms]);

  // --- XỬ LÝ GỌI API ĐẶT PHÒNG ---
  const handleConfirmBooking = async () => {
    if (selectedRooms.length === 0) {
      toast.warn("Không có phòng nào được chọn!");
      return;
    }

    try {
      setIsProcessing(true);

      const payload = {
        rooms: selectedRooms.map((room) => ({
          roomId: room.id,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          numberOfGuests: room.occupancy || 1,
          note: "",
        })),
        paymentMethod: paymentMethod,
        bookingNote: bookingNote,
      };

      console.log("Sending Payload:", payload);

      const response = await roomService.bookingRooms(payload);

      if (response?.paymentUrl) {
        window.location.href = response.paymentUrl;
      }
    } catch (error) {
      console.error("Booking Error:", error);
      toast.error("Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại!");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingData) {
    return (
      <div className={styles.pageFallback}>
        <p>Không tìm thấy thông tin đặt phòng.</p>
        <button
          onClick={() => navigate("/rooms")}
          className={styles.backButton}
        >
          Quay lại danh sách phòng
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* --- Hàng 1: Top Bar --- */}
          <div className={styles.topBar}>
            <button
              className={styles.backLink}
              onClick={() => navigate(-1)}
              aria-label="Quay lại"
            >
              <IoChevronBack /> Quay lại
            </button>
            <h1 className={styles.pageTitle}>Xác nhận đặt phòng</h1>
          </div>

          {/* --- Cột Trái: Thông tin phòng --- */}
          <section className={styles.summaryCard}>
            <div className={styles.roomHero}>
              <div className={styles.roomImageWrapper}>
                <img
                  src={heroImage || "/background.jpg"}
                  alt={roomType}
                  className={styles.roomImage}
                />
              </div>
              <div className={styles.roomInfoBlock}>
                <h2 className={styles.roomTitle}>{roomType}</h2>
                <div className={styles.roomPriceRow}>
                  <IoPricetag className={styles.roomPriceIcon} />
                  <span className={styles.roomPrice}>
                    {price ? `${formatPrice(price)}` : "Giá đang cập nhật"}
                  </span>
                </div>
                <p className={styles.roomMeta}>
                  {selectedRooms.length} phòng • {effectiveTotalPeople} khách
                </p>
              </div>
            </div>

            <h3 className={styles.title}>Thông tin chi tiết</h3>
            <div className={styles.summaryGrid}>
              <div>
                <h2 className={styles.sectionLabel}>Ngày nhận phòng</h2>
                <p className={styles.sectionValue}>{checkInDate}</p>
              </div>
              <div>
                <h2 className={styles.sectionLabel}>Ngày trả phòng</h2>
                <p className={styles.sectionValue}>{checkOutDate}</p>
              </div>
              <div>
                <h2 className={styles.sectionLabel}>Số đêm</h2>
                <p className={styles.sectionValue}>{nightsUsed} đêm</p>
              </div>
              <div>
                <h2 className={styles.sectionLabel}>Tổng khách</h2>
                <p className={styles.sectionValue}>
                  {effectiveTotalPeople} khách
                </p>
              </div>
            </div>

            <div className={styles.roomList}>
              <h3 className={styles.sectionSubTitle}>Phòng đã chọn</h3>
              {selectedRooms.length === 0 ? (
                <p className={styles.emptyRooms}>Chưa chọn phòng nào.</p>
              ) : (
                <ul>
                  {selectedRooms.map((room) => (
                    <li key={room.id}>
                      Phòng số {room.roomNumber} •{" "}
                      <strong>{room.occupancy || 0} khách</strong>{" "}
                      {room.status === "booked" ? "(Đã đặt)" : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.totalPriceBox}>
              <h3 className={styles.totalPriceLabel}>Tổng tiền tạm tính</h3>
              <p className={styles.totalPriceValue}>
                {totalPrice > 0 ? formatPrice(totalPrice) : "Đang cập nhật"}
              </p>
              <p className={styles.totalPriceNote}>
                Công thức: đơn giá × số phòng ({roomCount}) × số đêm (
                {nightsUsed})
              </p>
            </div>

            <p className={styles.priceDisclaimer}>
              Lưu ý: Giá có thể thay đổi nếu phát sinh phụ phí hoặc khuyến mãi.
            </p>
          </section>

          {/* --- Cột Phải: Ghi chú & Thanh toán --- */}
          <div className={styles.rightColumn}>
            {/* 1. Ghi chú */}
            <section className={styles.noteSection}>
              <h2 className={styles.sectionTitle}>Ghi chú / Yêu cầu</h2>
              <textarea
                className={styles.noteInput}
                placeholder="Ví dụ: Check-in muộn, cần phòng yên tĩnh..."
                rows={4}
                value={bookingNote}
                onChange={(e) => setBookingNote(e.target.value)}
              />
            </section>

            {/* 2. Thanh toán */}
            <section className={styles.paymentSection}>
              <h2 className={styles.sectionTitle}>Thanh toán</h2>
              <div className={styles.paymentOptions}>
                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="VNPAY"
                    checked={paymentMethod === "VNPAY"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className={styles.paymentLabel}>Thanh toán VNPAY</span>
                </label>
              </div>

              <button
                className={styles.confirmButton}
                onClick={handleConfirmBooking}
                disabled={isProcessing}
              >
                {isProcessing ? "Đang xử lý..." : "Xác nhận và tiếp tục"}
              </button>
              <p className={styles.paymentNote}>
                Chúng tôi sẽ giữ chỗ trong vòng 30 phút.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BookingPage;
