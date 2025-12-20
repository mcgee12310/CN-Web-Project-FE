import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../component/header/header";
import Footer from "../../component/footer/footer";
import styles from "./booking.module.css";
import { IoChevronBack, IoPricetag } from "react-icons/io5";
import { toast } from "react-toastify";

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const {
    checkInDate,
    checkOutDate,
    totalPeople,
    selectedRooms = [],
    roomType = "Phòng",
    roomPrice = "",
    new_price = "",
    heroImage = "",
    paymentUrl = "",
    discount = 0,
  } = bookingData || {};

  const formatPrice = (price) => price.toLocaleString("vi-VN") + " VNĐ";

  // --- TÍNH TOÁN GIÁ TIỀN ---
  const oldPrice = new_price / (1 - discount / 100);
  console.log("Old Price:", oldPrice);
  console.log("New Price:", new_price);
  console.log("Discount (%):", discount);

  const numberOfNights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diff = end.getTime() - start.getTime();
    if (Number.isNaN(diff) || diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [checkInDate, checkOutDate]);

  const nightsUsed = numberOfNights > 0 ? numberOfNights : 1;

  const effectiveTotalPeople = useMemo(() => {
    if (typeof totalPeople === "number" && totalPeople > 0) return totalPeople;
    return selectedRooms.reduce((sum, room) => sum + (room.occupancy || 0), 0);
  }, [totalPeople, selectedRooms]);

  // --- XỬ LÝ THANH TOÁN (Navigate sang VNPAY) ---
  const handleConfirmPayment = () => {
    if (!paymentUrl) {
      toast.error("Không tìm thấy đường dẫn thanh toán!");
      return;
    }

    // Chuyển hướng sang VNPAY
    window.location.href = paymentUrl;
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
                    {roomPrice
                      ? `${formatPrice(roomPrice)} / đêm`
                      : "Giá đang cập nhật"}
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
                      <div className={styles.roomListItem}>
                        <div>
                          Phòng số {room.roomNumber} •{" "}
                          <strong>{room.occupancy || 0} khách</strong>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.totalPriceBox}>
              <h3 className={styles.totalPriceLabel}>Tổng tiền</h3>

              {oldPrice > 0 ? (
                new_price && new_price !== oldPrice ? (
                  <div className={styles.priceWrapper}>
                    <span className={styles.oldPrice}>
                      {formatPrice(oldPrice)}
                    </span>
                    <span className={styles.newPrice}>
                      {formatPrice(new_price)}
                    </span>
                  </div>
                ) : (
                  <p className={styles.totalPriceValue}>
                    {formatPrice(oldPrice)}
                  </p>
                )
              ) : (
                <p className={styles.totalPriceValue}>Đang cập nhật</p>
              )}
            </div>

            <p className={styles.priceDisclaimer}>
              Lưu ý: Giá có thể thay đổi nếu phát sinh phụ phí hoặc khuyến mãi.
            </p>
          </section>

          {/* --- Cột Phải: Thanh toán --- */}
          <div className={styles.rightColumn}>
            <section className={styles.paymentSection}>
              <h2 className={styles.sectionTitle}>Thanh toán</h2>
              <div className={styles.paymentOptions}>
                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="VNPAY"
                    checked={true}
                    readOnly
                  />
                  <span className={styles.paymentLabel}>Thanh toán VNPAY</span>
                </label>
              </div>

              <button
                className={styles.confirmButton}
                onClick={handleConfirmPayment}
              >
                Xác nhận và thanh toán
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
