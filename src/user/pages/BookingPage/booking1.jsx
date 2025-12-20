import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../component/header/header";
import Footer from "../../component/footer/footer";
import styles from "./booking.module.css";
import { IoChevronBack, IoPricetag } from "react-icons/io5";
import { toast } from "react-toastify";
import profileService from "../../../services/user/profile";
import Loading from "../../component/loading/Loading";

function Booking1Page() {
  const { id: bookingId } = useParams(); // /booking/payment/:id
  const navigate = useNavigate();

  // ================= STATE =================
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH BOOKING =================
  useEffect(() => {
    let mounted = true;

    const fetchBooking = async () => {
      try {
        const data = await profileService.getBookingId(bookingId);
        if (mounted) setBookingData(data);
      } catch (error) {
        console.error("Lỗi lấy booking:", error);
        toast.error("Không thể lấy thông tin đặt phòng");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (bookingId) fetchBooking();

    return () => {
      mounted = false;
    };
  }, [bookingId]);

  // ================= SAFE DATA =================
  const safeBooking = bookingData || {};
  console.log("Booking Data:", safeBooking);
  const {
    roomType = "",
    image = "",
    requests = [],
    price = 0,
    paymentUrl = "",
  } = safeBooking;

  const firstRequest = requests[0] || {};
  const { roomNumber = "", guests = 0, checkIn, checkOut } = firstRequest;

  // ================= FORMAT DATE =================
  const checkInDate = useMemo(() => {
    return checkIn ? new Date(checkIn).toLocaleDateString("vi-VN") : "";
  }, [checkIn]);

  const checkOutDate = useMemo(() => {
    return checkOut ? new Date(checkOut).toLocaleDateString("vi-VN") : "";
  }, [checkOut]);

  // ================= CALC NIGHTS =================
  const numberOfNights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  }, [checkIn, checkOut]);

  // Tính tổng số phòng và khách từ tất cả các requests
  const totalRooms = requests.length;
  const totalGuests = requests.reduce((sum, req) => sum + (req.guests || 0), 0);

  // ================= PRICE =================
  const formatPrice = (value) => value?.toLocaleString("vi-VN") + " VNĐ";

  // ================= PAYMENT =================
  const handleConfirmPayment = () => {
    if (!paymentUrl) {
      toast.error("Không tìm thấy đường dẫn thanh toán!");
      return;
    }
    window.location.href = paymentUrl;
  };

  // ================= RENDER =================
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        {loading ? (
          <Loading />
        ) : !bookingData ? (
          <div className={styles.error}>Không tìm thấy booking</div>
        ) : (
          <div className={styles.container}>
            {/* ===== TOP BAR ===== */}
            <div className={styles.topBar}>
              <button className={styles.backLink} onClick={() => navigate(-1)}>
                <IoChevronBack /> Quay lại
              </button>
              <h1 className={styles.pageTitle}>Xác nhận đặt phòng</h1>
            </div>

            {/* ===== LEFT COLUMN ===== */}
            <section className={styles.summaryCard}>
              <div className={styles.roomHero}>
                <div className={styles.roomImageWrapper}>
                  <img
                    src={image || "/background.jpg"}
                    alt={roomType}
                    className={styles.roomImage}
                  />
                </div>

                <div className={styles.roomInfoBlock}>
                  <h2 className={styles.roomTitle}>{roomType}</h2>

                  <div className={styles.roomPriceRow}>
                    <IoPricetag className={styles.roomPriceIcon} />
                    <span className={styles.roomPrice}>
                      {price ? formatPrice(price) : "Giá đang cập nhật"}
                    </span>
                  </div>

                  <p className={styles.roomMeta}>
                    {totalRooms} phòng • {totalGuests} khách
                  </p>
                </div>
              </div>

              {/* ===== DETAIL ===== */}
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
                  <p className={styles.sectionValue}>{numberOfNights} đêm</p>
                </div>

                <div>
                  <h2 className={styles.sectionLabel}>Tổng khách</h2>
                  <p className={styles.sectionValue}>{totalGuests} khách</p>
                </div>
              </div>

              {/* ===== ROOM ===== */}
              <div className={styles.roomList}>
                <h3 className={styles.sectionSubTitle}>Phòng đã đặt</h3>

                {requests.length === 0 ? (
                  <p className={styles.emptyRooms}>Không có phòng nào</p>
                ) : (
                  <ul>
                    {requests.map((req) => (
                      <li key={req.id} className={styles.roomListItem}>
                        <div>
                          Phòng <strong>{req.roomNumber}</strong> •{" "}
                          <strong>{req.guests}</strong> khách
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* ===== TOTAL PRICE ===== */}
              <div className={styles.totalPriceBox}>
                <h3 className={styles.totalPriceLabel}>Tổng tiền</h3>
                <p className={styles.totalPriceValue}>{formatPrice(price)}</p>
              </div>

              <p className={styles.priceDisclaimer}>
                Lưu ý: Giá đã bao gồm thuế và phí dịch vụ.
              </p>
            </section>

            {/* ===== RIGHT COLUMN ===== */}
            <div className={styles.rightColumn}>
              <section className={styles.paymentSection}>
                <h2 className={styles.sectionTitle}>Thanh toán</h2>

                <div className={styles.paymentOptions}>
                  <label className={styles.paymentOption}>
                    <input type="radio" checked readOnly />
                    <span className={styles.paymentLabel}>
                      Thanh toán VNPAY
                    </span>
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
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Booking1Page;
