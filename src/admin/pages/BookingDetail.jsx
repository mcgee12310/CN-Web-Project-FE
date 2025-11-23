import React, { useState } from "react";
import { Input, Tabs } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "./BookingDetail.module.css";

import RequestCard from "./RequestCard";

const booking = {
  id: "BK-2025-001",
  customerName: "Nguyễn Văn A",
  customerEmail: "nguyenvana@example.com",
  customerPhone: "0987654321",

  // Danh sách request
  requests: [
    {
      id: 1,
      roomNumber: "A101",
      roomType: "Garden Superior",
      totalPeople: 2,
      status: "CHECKIN",
      price: 1200000,
      note: "Khách muốn phòng gần hồ bơi.",
      checkIn: "2025-11-10",
      checkOut: "2025-11-12",

      guests: [
        {
          id: 1,
          guestName: "Trần Thị B",
          identityType: "CCCD",
          identityNumber: "012345678999",
          identityIssueDate: "2020-01-20",
          identityIssuePlace: "Hà Nội",
        },
        {
          id: 2,
          guestName: "Lê Văn C",
          identityType: "Passport",
          identityNumber: "P1234567",
          identityIssueDate: "2022-05-11",
          identityIssuePlace: "TP.HCM",
        },
      ],
    },

    {
      id: 2,
      roomNumber: "B202",
      roomType: "Superior",
      totalPeople: 3,
      status: "Check out",
      price: 1800000,
      note: "Yêu cầu thêm chăn.",
      checkIn: "2025-11-08",
      checkOut: "2025-11-10",

      guests: [
        {
          id: 1,
          guestName: "Phạm Văn D",
          identityType: "CCCD",
          identityNumber: "036987456321",
          identityIssueDate: "2019-09-12",
          identityIssuePlace: "Đà Nẵng",
        },
      ],
    },
  ],
};

const { TextArea } = Input;

export default function BookingDetail({ }) {
  const [requests, setRequests] = useState(booking.requests || []);

  const handleUpdate = (updatedRequest) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r))
    );
  };

  const tabItems = requests.map((req) => ({
    key: String(req.id),
    label: `Request ${req.id}`,
    children: (
      <RequestCard request={req} onUpdate={handleUpdate} />
    ),
  }));

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Thông tin chi tiết - {booking.id}</h2>

      <div className={styles.cardRow}>
        {/* --- CUSTOMER INFORMATION --- */}
        <div className={styles.customerCard}>
          <div className={styles.cardHeader}>
            <span>Thông tin khách hàng</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Họ tên:</span>
            <span>{booking.customerName}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Email:</span>
            <span>{booking.customerEmail}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Số điện thoại:</span>
            <span>{booking.customerPhone}</span>
          </div>
        </div>

        {/* --- BOOKING INFORMATION --- */}
        <div className={styles.customerCard}>
          <div className={styles.cardHeader}>
            <span>Thông tin đơn</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Mã đơn:</span>
            <span>{booking.customerName}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Tổng tiền:</span>
            <span>{booking.customerEmail}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Phương thức thanh toán:</span>
            <span>{booking.customerPhone}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Trạng thái:</span>
            <span>{booking.customerPhone}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Ngày đặt:</span>
            <span>{booking.customerPhone}</span>
          </div>
        </div>
      </div>

      {/* --- REQUEST CARDS --- */}
      <Tabs
        defaultActiveKey="1"
        items={tabItems}
        tabPosition="top"
      />
    </div>
  );
}
