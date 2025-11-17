import React, { useState } from "react";
import { Table, Input, Tag, Button, Menu, Dropdown } from "antd";
import { SearchOutlined, EyeOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import styles from "./BookingList.module.css";

const generateMockBookings = (count = 8) => {
  const statuses = ["PENDING", "CONFIRMED", "CANCELED"];
  const names = ["Nguyễn Văn A", "Trần Thị B", "Lê Minh C", "Phạm Hoàng D", "Võ Thị E"];

  return Array.from({ length: count }, (_, i) => {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomRooms = Math.floor(Math.random() * 3) + 1; // 1–3 phòng
    const randomPrice = randomRooms * (Math.floor(Math.random() * 800000) + 500000); // 500k–1.3M/phòng
    const randomDate = new Date(Date.now());

    return {
      id: i + 1,
      bookingCode: `BK${1000 + i}`,
      userName: randomName,
      totalRoom: randomRooms,
      totalPrice: randomPrice,
      status: randomStatus,
      date: randomDate,
    };
  });
};

const BookingList = () => {
  const data = generateMockBookings();
  const [search, setSearch] = useState("");

  const handleView = (code) => {
    alert(`Xem chi tiết đơn: ${code}`);
  };

  const getBookingStatusTag = (status) => {
    switch (status) {
      case "CANCELED":
        return <Tag color="red">{status}</Tag>;
      case "CONFIRMED":
        return <Tag color="green">{status}</Tag>;
      case "PENDING":
        return <Tag color="orange">{status}</Tag>;
      case "COMPLETED":
        return <Tag color="blue">{status}</Tag>;
      default:
        return <Tag color="gray">{status}</Tag>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatPrice = (price) => {
  if (!price) return "0 ₫";
  return price.toLocaleString("vi-VN"); // chỉ hiện số và dấu phẩy
};

  // 🔍 lọc booking theo code
  const filteredData = data.filter((b) =>
    b.bookingCode.toLowerCase().includes(search.toLowerCase())
  );

  // 🧩 cột bảng
  const columns = [
    {
      title: "Code",
      dataIndex: "bookingCode",
      key: "code",
      sorter: (a, b) => a.bookingCode.localeCompare(b.bookingCode),
      render: (text) => <span className={styles.codeCell}>{text}</span>,
    },
    {
      title: "Tên khách đặt",
      key: "userName",
      sorter: (a, b) => a.userName.localeCompare(b.userName),
      render: (_, record) => <div className={styles.nameCell}>{record.userName}</div>,
    },
    {
      title: "Total room",
      key: "totalRoom",
      sorter: (a, b) => a.totalRoom - b.totalRoom,
      render: (_, record) => (
        <div className={styles.totalRoomCell}>{record.requests?.length || 0}</div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "price",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      render: (price) => <div className={styles.priceCell}>{formatPrice(price)}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: 'PENDING', value: 'PENDING' },
        { text: 'CONFIRMED', value: 'CONFIRMED' },
        { text: 'CANCELED', value: 'CANCELED' },
        { text: 'COMPLETED', value: 'COMPLETED' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (_, record) => getBookingStatusTag(record.status),
    },
    {
      title: "Ngày đặt",
      dataIndex: "bookingDate",
      key: "date",
      defaultSortOrder: 'descend',
      sorter: (a, b) => new Date(a.bookingDate) - new Date(b.bookingDate),
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
              onClick={() => handleView(record)}
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
      width: 80,
      align: "center",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Danh sách đơn đặt phòng</h2>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <SearchOutlined />
          <Input
            placeholder="Tìm kiếm theo mã đơn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 250, marginLeft: 8 }}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ y: 400 }}
      />
    </div>
  );
};

export default BookingList;
