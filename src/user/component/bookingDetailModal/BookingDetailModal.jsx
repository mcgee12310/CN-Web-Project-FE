import React, { useState, useMemo } from "react";
import { Modal, Tag, Button, Divider } from "antd";
import {
  CalendarOutlined,
  HomeOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { formatDate, formatPrice } from "../../../utils/format";
import styles from "./BookingDetailModal.module.css";
import FeedbackModal from "../../component/feedbackModal/FeedbackModal";

const BookingDetailModal = ({ visible, onClose, booking }) => {
  if (!booking) return null;

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Tính số đêm
  const numberOfNights = useMemo(() => {
    if (!booking.requests || booking.requests.length === 0) return 0;
    const firstRequest = booking.requests[0];
    const start = new Date(firstRequest.checkIn);
    const end = new Date(firstRequest.checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [booking]);

  // Tính tổng số khách
  const totalGuests = useMemo(() => {
    return booking?.requests.reduce((sum, r) => sum + (r.guests || 0), 0);
  }, [booking]);

  const handleFeedback = (request) => {
    setSelectedRequest(request);
    setIsFeedbackOpen(true);
  };

  const getStatusTag = (status) => {
    const config = {
      CANCELLED: { color: "red", label: "Đã hủy" },
      PAYMENT_COMPLETED: { color: "green", label: "Đã xác nhận" },
      PENDING: { color: "orange", label: "Chờ xử lý" },
      COMPLETED: { color: "blue", label: "Hoàn thành" },
      CHECKED_OUT: { color: "geekblue", label: "Đã trả phòng" },
      CHECKED_IN: { color: "cyan", label: "Đã nhận phòng" },
    };
    const { color, label } = config[status] || { color: "gray", label: status };
    return <Tag color={color}>{label}</Tag>;
  };

  const allCheckedOut = useMemo(() => {
    return (
      booking?.requests?.length > 0 &&
      booking.requests.every((r) => r.status?.toUpperCase() === "CHECKED_OUT")
    );
  }, [booking]);

  return (
    <>
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        width={800}
        centered
        className={styles.modal}
      >
        {/* Header với ảnh */}
        <div className={styles.modalHeader}>
          <div className={styles.imageWrapper}>
            <img
              src={booking.image || "/background.jpg"}
              alt={booking.roomType}
              className={styles.headerImage}
            />
          </div>
          <div className={styles.headerInfo}>
            <h2 className={styles.roomType}>{booking.roomType}</h2>
            <div className={styles.bookingCodeRow}>
              <span className={styles.bookingCode}>
                Mã đặt phòng: {booking.bookingCode}
              </span>
              {getStatusTag(booking.status)}
            </div>
            <div className={styles.priceRow}>
              <DollarOutlined className={styles.icon} />
              <span className={styles.totalPrice}>
                {formatPrice(booking.price)}
              </span>
            </div>
          </div>
        </div>

        <Divider />

        {/* Thông tin tổng quan */}
        <div className={styles.summarySection}>
          <h3 className={styles.sectionTitle}>Thông tin chi tiết</h3>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <CalendarOutlined className={styles.itemIcon} />
              <div>
                <div className={styles.itemLabel}>Ngày đặt phòng</div>
                <div className={styles.itemValue}>
                  {formatDate(booking.bookingDate)}
                </div>
              </div>
            </div>
            <div className={styles.summaryItem}>
              <CalendarOutlined className={styles.itemIcon} />
              <div>
                <div className={styles.itemLabel}>Số đêm</div>
                <div className={styles.itemValue}>{numberOfNights} đêm</div>
              </div>
            </div>
            <div className={styles.summaryItem}>
              <UserOutlined className={styles.itemIcon} />
              <div>
                <div className={styles.itemLabel}>Tổng khách</div>
                <div className={styles.itemValue}>{totalGuests} khách</div>
              </div>
            </div>
            <div className={styles.summaryItem}>
              <HomeOutlined className={styles.itemIcon} />
              <div>
                <div className={styles.itemLabel}>Số phòng</div>
                <div className={styles.itemValue}>
                  {booking.requests.length} phòng
                </div>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        {/* Danh sách phòng */}
        <div className={styles.roomListSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Phòng đã chọn</h3>

            <Button
              type="primary"
              size="small"
              onClick={() => handleFeedback(booking)}
              disabled={!allCheckedOut}
              className={styles.feedbackBtn}
            >
              Đánh giá
            </Button>
          </div>
          <div className={styles.roomList}>
            {booking.requests.map((request, index) => (
              <div key={request.id} className={styles.roomCard}>
                <div className={styles.roomCardHeader}>
                  <div className={styles.roomInfo}>
                    <span className={styles.roomCode}>
                      {booking.bookingCode}-{index + 1}
                    </span>
                    <span className={styles.roomNumber}>
                      {request.roomNumber}
                    </span>
                    {getStatusTag(request.status)}
                  </div>
                </div>

                <div className={styles.roomCardBody}>
                  <div className={styles.roomDetail}>
                    <CalendarOutlined className={styles.detailIcon} />
                    <div>
                      <div className={styles.detailLabel}>Check-in</div>
                      <div className={styles.detailValue}>
                        {formatDate(request.checkIn)}
                      </div>
                    </div>
                  </div>
                  <div className={styles.roomDetail}>
                    <CalendarOutlined className={styles.detailIcon} />
                    <div>
                      <div className={styles.detailLabel}>Check-out</div>
                      <div className={styles.detailValue}>
                        {formatDate(request.checkOut)}
                      </div>
                    </div>
                  </div>
                  <div className={styles.roomDetail}>
                    <UserOutlined className={styles.detailIcon} />
                    <div>
                      <div className={styles.detailLabel}>Số khách</div>
                      <div className={styles.detailValue}>
                        {request.guests} khách
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Divider />
      </Modal>

      <FeedbackModal
        visible={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        request={selectedRequest}
      />
    </>
  );
};

export default BookingDetailModal;
