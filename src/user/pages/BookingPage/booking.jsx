import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../component/header/header";
import Footer from "../../component/footer/footer";
import styles from "./booking.module.css";
import { IoChevronBack, IoPricetag } from "react-icons/io5";

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  const {
    checkInDate,
    checkOutDate,
    totalPeople,
    selectedRooms = [],
    roomType = "Phòng",
    price = "",
    currency = "",
    heroImage = "",
  } = bookingData || {};

  // 🔹 Tính số đêm
  const numberOfNights = useMemo(() => {
    if (!checkInDate || !checkOutDate) {
      return 0;
    }
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diff = end.getTime() - start.getTime();

    if (Number.isNaN(diff) || diff <= 0) {
      return 0;
    }

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [checkInDate, checkOutDate]);

  // 🔹 Đơn giá (số) từ price
  const unitPrice = useMemo(() => {
    if (!price) {
      return 0;
    }
    const numeric = parseInt(String(price).replace(/[^\d]/g, ""), 10);
    if (Number.isNaN(numeric)) {
      return 0;
    }
    return numeric;
  }, [price]);

  const nightsUsed = numberOfNights > 0 ? numberOfNights : 1;
  const roomCount = selectedRooms.length;
  const totalPrice =
    unitPrice > 0 && roomCount > 0 ? unitPrice * roomCount * nightsUsed : 0;
  const currencyUnit = currency ? currency.split("/")[0] : "VNĐ";

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN").format(value) + ` ${currencyUnit}`;

  // 🔹 Tính tổng khách từ state nếu totalPeople chưa có
  const effectiveTotalPeople = useMemo(() => {
    if (typeof totalPeople === "number" && totalPeople > 0) return totalPeople;
    return selectedRooms.reduce((sum, room) => sum + (room.occupancy || 0), 0);
  }, [totalPeople, selectedRooms]);

  if (!bookingData) {
    return (
      <div className={styles.pageFallback}>
        <p>
          Không tìm thấy thông tin đặt phòng. Vui lòng quay lại trang phòng.
        </p>
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
          <div className={styles.topBar}>
            <button
              className={styles.backLink}
              onClick={() => navigate(-1)}
              aria-label="Quay lại"
            >
              <IoChevronBack />
              Quay lại
            </button>
            <h1 className={styles.pageTitle}>Xác nhận đặt phòng</h1>
          </div>

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
                    {price ? `${price} ${currency}` : "Giá đang cập nhật"}
                  </span>
                </div>
                <p className={styles.roomMeta}>
                  {selectedRooms.length} phòng • {effectiveTotalPeople} khách
                </p>
              </div>
            </div>

            <h3 className={styles.title}>Thông tin đặt phòng</h3>
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
                <p className={styles.sectionValue}>
                  {numberOfNights > 0
                    ? `${numberOfNights} đêm`
                    : "Không hợp lệ"}
                </p>
              </div>
              <div>
                <h2 className={styles.sectionLabel}>Số khách</h2>
                <p className={styles.sectionValue}>
                  {effectiveTotalPeople} khách
                </p>
              </div>
              <div>
                <h2 className={styles.sectionLabel}>Loại phòng</h2>
                <p className={styles.sectionValue}>{roomType}</p>
              </div>
              <div>
                <h2 className={styles.sectionLabel}>Số lượng phòng</h2>
                <p className={styles.sectionValue}>{selectedRooms.length}</p>
              </div>
            </div>

            <div className={styles.totalPriceBox}>
              <div>
                <h3 className={styles.totalPriceLabel}>Tổng tiền tạm tính</h3>
                <p className={styles.totalPriceValue}>
                  {totalPrice > 0
                    ? formatCurrency(totalPrice)
                    : "Đang cập nhật"}
                </p>
                <p className={styles.totalPriceNote}>
                  Công thức: đơn giá × số phòng ({roomCount || 0}) × số đêm (
                  {nightsUsed})
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
                      Phòng số {room.number ?? room.id} •{" "}
                      <strong>{room.occupancy || 0} khách</strong>{" "}
                      {room.status === "booked" ? "(Đã đặt)" : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className={styles.priceDisclaimer}>
              Lưu ý: Giá có thể thay đổi nếu phát sinh phụ phí hoặc khuyến mãi
              so với giá niêm yết ban đầu. Hiện tại hệ thống tính theo đơn giá
              phòng nhân với số phòng và số đêm bạn đã chọn.
            </p>
          </section>

          <section className={styles.paymentSection}>
            <h2 className={styles.sectionTitle}>Chọn phương thức thanh toán</h2>
            <div className={styles.paymentOptions}>
              <label className={styles.paymentOption}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit-card"
                  checked={paymentMethod === "credit-card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Thẻ tín dụng/Thẻ ghi nợ</span>
              </label>
              <label className={styles.paymentOption}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank-transfer"
                  checked={paymentMethod === "bank-transfer"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Chuyển khoản ngân hàng</span>
              </label>
              <label className={styles.paymentOption}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Thanh toán tại khách sạn</span>
              </label>
            </div>

            <button className={styles.confirmButton}>
              Xác nhận và tiếp tục
            </button>
            <p className={styles.paymentNote}>
              Bạn có thể hoàn tất thanh toán ở bước tiếp theo. Chúng tôi sẽ giữ
              chỗ trong vòng 30 phút.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BookingPage;
