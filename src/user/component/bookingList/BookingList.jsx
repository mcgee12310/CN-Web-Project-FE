import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Tag, Button, Dropdown, Menu, Card, Empty, Space } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  MoreOutlined,
  CalendarOutlined,
  DollarOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { formatDate, formatPrice } from "../../../utils/format";
import styles from "./BookingList.module.css";

import BookingDetailModal from "../../component/bookingDetailModal/BookingDetailModal";
import profileService from "../../../services/user/profile";
import Booking1Page from "../../../user/pages/BookingPage/booking1";

const BookingList = () => {
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await profileService.getMyBookings();
        setData(res); // res phải là array
      } catch (error) {
        console.error("Lỗi lấy danh sách booking", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleView = (booking) => {
    // 1. Nếu đang chờ thanh toán → quay lại trang thanh toán
    if (booking.status === "PAYMENT_PENDING") {
      navigate(`/booking/payment/${booking.id}`);
      return;
    }

    // 2. Các trạng thái khác → mở modal
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const getBookingStatusTag = (status) => {
    const colorMap = {
      CANCELLED: "red",
      PAYMENT_COMPLETED: "green",
      PENDING: "orange",
      COMPLETED: "blue",
    };
    const labelMap = {
      CANCELLED: "Đã hủy",
      PAYMENT_COMPLETED: "Đã thanh toán",
      PENDING: "Chờ xử lý",
      COMPLETED: "Hoàn thành",
    };
    return (
      <Tag color={colorMap[status] || "gray"}>{labelMap[status] || status}</Tag>
    );
  };

  // Lọc dữ liệu theo mã đơn
  const filteredData = data.filter((b) =>
    b.bookingCode?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Danh sách đặt phòng</h2>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <SearchOutlined />
          <Input
            placeholder="Tìm theo mã đơn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 300, marginLeft: 8 }}
          />
        </div>
      </div>

      {filteredData.length === 0 ? (
        <Empty description="Không tìm thấy đơn đặt phòng" />
      ) : (
        <div className={styles.cardList}>
          {filteredData.map((booking) => {
            return (
              <Card
                key={booking.id}
                hoverable
                className={styles.horizontalCard}
              >
                <div className={styles.cardBody}>
                  {/* Image Section */}
                  <div className={styles.imageSection}>
                    <img
                      src={booking.image}
                      alt={booking.roomType}
                      className={styles.roomImage}
                    />
                  </div>

                  {/* Left Section - Code & Status */}
                  <div className={styles.leftSection}>
                    <div className={styles.codeSection}>
                      <span className={styles.bookingCode}>
                        {booking.bookingCode}
                      </span>
                      {getBookingStatusTag(booking.status)}
                    </div>
                    <div className={styles.dateInfo}>
                      <CalendarOutlined style={{ marginRight: 6 }} />
                      <span style={{ fontSize: 13, color: "#666" }}>
                        {formatDate(booking.bookingDate)}
                      </span>
                    </div>
                  </div>

                  {/* Middle Section - Room Info */}
                  <div className={styles.middleSection}>
                    <div className={styles.infoItem}>
                      <HomeOutlined className={styles.icon} />
                      <div>
                        <div className={styles.label}>Loại phòng</div>
                        <div className={styles.value}>{booking.roomType}</div>
                        <div className={styles.roomNumbers}>
                          {booking.requests.map((r) => r.roomNumber).join(", ")}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Price & Actions */}
                  <div className={styles.rightSection}>
                    <div className={styles.priceSection}>
                      <DollarOutlined className={styles.priceIcon} />
                      <div>
                        <div className={styles.label}>Tổng tiền</div>
                        <div className={styles.priceValue}>
                          {formatPrice(booking.price)}
                        </div>
                      </div>
                    </div>

                    <div className={styles.actions}>
                      <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => handleView(booking)}
                      >
                        {booking.status === "PAYMENT_PENDING"
                          ? "Thanh toán"
                          : "Xem"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <BookingDetailModal
        visible={isModalOpen}
        onClose={handleCloseModal}
        booking={selectedBooking}
      />
    </div>
  );
};

export default BookingList;
