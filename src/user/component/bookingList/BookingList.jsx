import React, { useState, useMemo } from "react";
import { Table, Input, Tag, Button, Dropdown, Menu } from "antd";
import { SearchOutlined, EyeOutlined, DeleteOutlined, MoreOutlined, RedoOutlined } from "@ant-design/icons";
import { formatDate, formatPrice } from "../../../utils/format";
import styles from "./BookingList.module.css";

import BookingDetailModal from "../../component/bookingDetailModal/BookingDetailModal";

const data = [
  {
    id: 1,
    bookingCode: "BK1001",
    request: [
      { id: 1, roomName: "Phòng Deluxe", people: 3, checkIn: "2023-09-01", checkOut: "2023-09-03", price: 1500000, status: "CHECKOUT" },
      { id: 2, roomName: "Phòng Suite", people: 2, checkIn: "2023-09-01", checkOut: "2023-09-02", price: 2000000, status: "CONFIRMED" },
      { id: 3, roomName: "Phòng Standard", people: 1, checkIn: "2023-09-02", checkOut: "2023-09-03", price: 1000000, status: "CONFIRMED" },
    ],
    price: 2500000,
    status: "CONFIRMED",
    bookingDate: "2023-08-20",
  },
  {
    id: 2,
    bookingCode: "BK1002",
    request: [
      { id: 4, roomName: "Phòng Standard", people: 2, checkIn: "2023-10-05", checkOut: "2023-10-07", price: 1200000, status: "PENDING" },
      { id: 5, roomName: "Phòng Deluxe", people: 1, checkIn: "2023-10-05", checkOut: "2023-10-06", price: 1500000, status: "PENDING" },
    ],
    price: 2700000,
    status: "PENDING",
    bookingDate: "2023-09-15",
  },
  {
    id: 3,
    bookingCode: "BK1003",
    request: [
      { id: 6, roomName: "Phòng Suite", people: 4, checkIn: "2023-11-10", checkOut: "2023-11-12", price: 3000000, status: "CANCELED" },
    ],
    price: 3000000,
    status: "CANCELED",
    bookingDate: "2023-10-01",
  },
]

const BookingList = () => {
  const [search, setSearch] = useState("");

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleView = (code) => {
    const booking = data.find((b) => b.bookingCode === code);
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const getBookingStatusTag = (status) => {
    const colorMap = {
      CANCELED: "red",
      CONFIRMED: "green",
      PENDING: "orange",
      COMPLETED: "blue",
    };
    return <Tag color={colorMap[status] || "gray"}>{status}</Tag>;
  };

  // 🔍 Lọc dữ liệu theo mã đơn
  const filteredData = data.filter((b) =>
    b.bookingCode.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "bookingCode",
      key: "bookingCode",
      sorter: (a, b) => a.bookingCode.localeCompare(b.bookingCode),
      render: (text) => <span className={styles.codeCell}>{text}</span>,
    },
    {
      title: "Tên phòng đặt",
      key: "roomNames",
      render: (_, record) => <div className={styles.roomCell}> {record.request.map(r => r.roomName).join(", ")}</div>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => <div className={styles.priceCell}>{formatPrice(price)}</div>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "PENDING", value: "PENDING" },
        { text: "CONFIRMED", value: "CONFIRMED" },
        { text: "CANCELED", value: "CANCELED" },
        { text: "COMPLETED", value: "COMPLETED" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (_, record) => getBookingStatusTag(record.status),
    },
    {
      title: "Ngày đặt",
      dataIndex: "bookingDate",
      key: "bookingDate",
      sorter: (a, b) => new Date(a.bookingDate) - new Date(b.bookingDate),
      defaultSortOrder: "descend",
      render: (date) => <div className={styles.dateCell}>{formatDate(date)}</div>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item
              key="view"
              icon={<EyeOutlined />}
              onClick={() => handleView(record.bookingCode)}
            >
              Xem
            </Menu.Item>

            {!["COMPLETED", "CANCELED"].includes(record.status) && (
              <Menu.Item
                key="delete"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record)}
                danger
              >
                Hủy đơn
              </Menu.Item>
            )}
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
      align: "center",
    },
  ];

  return (
    <div >
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
            style={{ width: 250, marginLeft: 8 }}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 8 }}
        scroll={{ y: 400 }}
        style={{ tableLayout: "fixed" }}
      />

      <BookingDetailModal
        visible={isModalOpen}
        onClose={handleCloseModal}
        booking={selectedBooking}
      />
    </div>
  );
};

export default BookingList;
