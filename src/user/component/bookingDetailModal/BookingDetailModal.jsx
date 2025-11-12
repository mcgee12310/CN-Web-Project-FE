import React, { useState } from "react";
import { Modal, Table, Tag, Button } from "antd";
import { formatDate, formatPrice } from "../../../utils/format";
import styles from "./BookingDetailModal.module.css";
import FeedbackModal from "../../component/feedbackModal/FeedbackModal";

const BookingDetailModal = ({ visible, onClose, booking }) => {
  // ✅ Kiểm tra dữ liệu trước khi render
  if (!booking) return null;

  // ✅ State
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // ✅ Mở Feedback modal
  const handleFeedback = (request) => {
    setSelectedRequest(request);
    setIsFeedbackOpen(true);
  };

  // ✅ Hàm render tag trạng thái
  const getBookingStatusTag = (status) => {
    const colorMap = {
      CANCELED: "red",
      CONFIRMED: "green",
      PENDING: "orange",
      COMPLETED: "blue",
      CHECKOUT: "geekblue",
    };
    return <Tag color={colorMap[status] || "gray"}>{status}</Tag>;
  };

  // ✅ Cấu hình bảng
  const columns = [
    {
      title: "Mã đặt phòng",
      dataIndex: "code",
      key: "code",
      render: (_, __, index) => (
        <div className={styles.codeCell}>
          {booking.bookingCode}-{index + 1}
        </div>
      ),
    },
    {
      title: "Phòng",
      dataIndex: "roomName",
      key: "roomName",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Giá (VND)",
      dataIndex: "price",
      key: "price",
      render: (price) => <div className={styles.priceCell}>{formatPrice(price)}</div>,
    },
    {
      title: "Check-in",
      dataIndex: "checkIn",
      key: "checkIn",
      render: (d) => <div className={styles.dateCell}>{formatDate(d)}</div>,
    },
    {
      title: "Check-out",
      dataIndex: "checkOut",
      key: "checkOut",
      render: (d) => <div className={styles.dateCell}>{formatDate(d)}</div>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getBookingStatusTag(status),
    },
    {
      title: "Đánh giá",
      key: "feedback",
      render: (_, record) => (
        <Button
          className={styles.feedbackButton}
          type="primary"
          disabled={record.status !== "CHECKOUT"}
          onClick={() => handleFeedback(record)}
        >
          Feedback
        </Button>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => 
        <Button 
          danger
          disabled={record.status == "CHECKOUT" || record.status == "CHECKIN"}
        >
          Cancel
        </Button>,
    },
  ];

  return (
    <>
      <Modal
        title={
          <div className={styles.modalHeader}>
            <h2>Chi tiết đặt phòng</h2>
            <p className={styles.bookingId}>BookingID: {booking.bookingCode}</p>
          </div>
        }
        open={visible}
        onCancel={onClose}
        footer={null}
        width={900}
        centered
      >
        <Table
          columns={columns}
          dataSource={booking.request.map((r, idx) => ({
            key: idx,
            ...r,
            code: booking.bookingCode,
          }))}
          pagination={false}
          className={styles.table}
        />
      </Modal>

      {/* ✅ Modal feedback */}
      <FeedbackModal
        visible={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        request={selectedRequest}
      />
    </>
  );
};

export default BookingDetailModal;
