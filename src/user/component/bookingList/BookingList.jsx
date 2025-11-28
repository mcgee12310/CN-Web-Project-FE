import React, { useState, useMemo } from "react";
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

const data = [
  {
    id: 1,
    bookingCode: "BK1001",
    roomType: "Phòng Standard",
    image: "/background.jpg",
    request: [
      {
        id: 1,
        roomNumber: "Phòng 601",
        guests: 3,
        checkIn: "2023-09-01",
        checkOut: "2023-09-03",
        status: "CHECKOUT",
      },
      {
        id: 2,
        roomNumber: "Phòng 602",
        guests: 2,
        checkIn: "2023-09-01",
        checkOut: "2023-09-03",
        status: "CONFIRMED",
      },
      {
        id: 3,
        roomNumber: "Phòng 603",
        guests: 1,
        checkIn: "2023-09-01",
        checkOut: "2023-09-03",
        status: "CONFIRMED",
      },
    ],
    price: 5000000000,
    status: "CONFIRMED",
    bookingDate: "2023-08-20",
  },
  {
    id: 2,
    bookingCode: "BK1002",
    roomType: "Phòng Standard",
    image: "/background.jpg",
    request: [
      {
        id: 4,
        roomNumber: "Phòng 501",
        guests: 2,
        checkIn: "2023-10-05",
        checkOut: "2023-10-07",
        status: "PENDING",
      },
      {
        id: 5,
        roomNumber: "Phòng 504",
        guests: 1,
        checkIn: "2023-10-05",
        checkOut: "2023-10-07",
        status: "PENDING",
      },
    ],
    price: 2700000,
    status: "PENDING",
    bookingDate: "2023-09-15",
  },
  {
    id: 3,
    bookingCode: "BK1003",
    roomType: "Phòng Suite đôi",
    image: "/background.jpg",
    request: [
      {
        id: 6,
        roomNumber: "Phòng 404",
        guests: 4,
        checkIn: "2023-11-10",
        checkOut: "2023-11-12",
        status: "CANCELED",
      },
    ],
    price: 3000000,
    status: "CANCELED",
    bookingDate: "2023-10-01",
  },
];

const BookingList = () => {
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = (code) => {
    const booking = data.find((b) => b.bookingCode === code);
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleDelete = (record) => {
    console.log("Hủy đơn:", record);
    // Xử lý hủy đơn
  };

  const getBookingStatusTag = (status) => {
    const colorMap = {
      CANCELED: "red",
      CONFIRMED: "green",
      PENDING: "orange",
      COMPLETED: "blue",
    };
    const labelMap = {
      CANCELED: "Đã hủy",
      CONFIRMED: "Đã xác nhận",
      PENDING: "Chờ xử lý",
      COMPLETED: "Hoàn thành",
    };
    return (
      <Tag color={colorMap[status] || "gray"}>{labelMap[status] || status}</Tag>
    );
  };

  // Lọc dữ liệu theo mã đơn
  const filteredData = data.filter((b) =>
    b.bookingCode.toLowerCase().includes(search.toLowerCase())
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
            const menu = (
              <Menu>
                <Menu.Item
                  key="view"
                  icon={<EyeOutlined />}
                  onClick={() => handleView(booking.bookingCode)}
                >
                  Xem chi tiết
                </Menu.Item>
                {!["COMPLETED", "CANCELED"].includes(booking.status) && (
                  <Menu.Item
                    key="delete"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(booking)}
                    danger
                  >
                    Hủy đơn
                  </Menu.Item>
                )}
              </Menu>
            );

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
                          {booking.request.map((r) => r.roomNumber).join(", ")}
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
                        onClick={() => handleView(booking.bookingCode)}
                      >
                        Xem
                      </Button>
                      <Dropdown overlay={menu} trigger={["click"]}>
                        <Button icon={<MoreOutlined />} />
                      </Dropdown>
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
