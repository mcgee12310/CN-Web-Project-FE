import React, { useState } from "react";
import { Table, Input, Tag, Button, Dropdown, Menu } from "antd";
import { SearchOutlined, EyeOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import styles from "./UserDetail.module.css";

const user = {
  "id": 1,
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "phone": "0123456789",
  "birthDate": "2025-11-02T07:10:17.429Z",
  "rank": "DIAMOND",
  "status": true,
  "role": "USER",
  "isVerified": true,
  "createdAt": "2025-11-02T07:10:17.429Z",
  "updatedAt": "2025-11-02T07:10:17.429Z",
  "bookings": [
    {
      id: 0,
      bookingCode: "string",
      "bookingDate": "2025-11-15T07:56:54.831Z",
      "status": "PENDING",
      "declineReason": "string",
      "requests": [
        {
          "id": 0,
          "roomId": 0,
          "roomNumber": "string",
          "checkIn": "2025-11-02T07:56:54.831Z",
          "checkOut": "2025-11-02T07:56:54.831Z",
          "numberOfGuests": 0,
          "status": "PENDING",
          "note": "string",
        },
        {
          "id": 1,
          "roomId": 0,
          "roomNumber": "string",
          "checkIn": "2025-11-02T07:56:54.831Z",
          "checkOut": "2025-11-02T07:56:54.831Z",
          "numberOfGuests": 0,
          "status": "PENDING",
          "note": "string",
        }
      ],
      "createdAt": "2025-11-02T07:56:54.831Z",
      "updatedAt": "2025-11-02T07:56:54.831Z"
    },
    {
      id: 1,
      bookingCode: "string",
      "bookingDate": "2025-11-01T07:56:54.831Z",
      "status": "CONFIRMED",
      "declineReason": "string",
      "requests": [],
      "createdAt": "2025-11-02T07:56:54.831Z",
      "updatedAt": "2025-11-02T07:56:54.831Z"
    },
    {
      id: 2,
      bookingCode: "string",
      "bookingDate": "2025-11-02T07:56:54.831Z",
      "status": "COMPLETED",
      "declineReason": "string",
      "requests": [],
      "createdAt": "2025-11-02T07:56:54.831Z",
      "updatedAt": "2025-11-02T07:56:54.831Z"
    },
    {
      id: 2,
      bookingCode: "a",
      requests: [1, 2, 3]
    },
    {
      id: 2,
      bookingCode: "b",
    },
    {
      id: 2,
      bookingCode: "c",
    },
    {
      id: 2,
      bookingCode: "d",
    },
    {
      id: 2,
      bookingCode: "e",
    },
    {
      id: 2,
      bookingCode: "f",
    },
  ]
}

const handleView = (record) => {
  alert(`Xem chi tiết: ${record}`);
};

const UserDetail = () => {
  const [search, setSearch] = useState("");

  const getAvatarUrl = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

  const getRankClass = (rank) => {
    switch (rank) {
      case "SILVER":
        return styles.silver;
      case "GOLD":
        return styles.gold;
      case "DIAMOND":
        return styles.diamond;
      default:
        return "";
    }
  };

  const getRoleClass = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return styles.roleAdmin;
      default:
        return styles.roleUser;
    }
  };

  const getUserStatusClass = (status) => {
    if (status) {
      return styles.active;
    } else {
      return styles.inactive;
    }
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
        return <Tag color="red">{status}</Tag>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN"); // ví dụ: "2/11/2025"
  };

  // lọc booking theo code
  const filtered = user.bookings.filter((b) =>
    b.bookingCode.toString().includes(search)
  );

  // cột của bảng booking
  const columns = [
    {
      title: "Mã đặt",
      dataIndex: "bookingCode",
      key: "code",
      sorter: (a, b) => a.bookingCode.localeCompare(b.bookingCode),
      render: (text) => <span className={styles.codeCell}>{text}</span>,
    },
    {
      title: "Tên phòng",
      key: "rooms",
      render: (_, record) => {
        if (!record.requests || record.requests.length === 0) {
          return <span>—</span>;
        }
        return (
          <div className={styles.roomList}>
            {record.requests.map((r, i) => (
              <div key={i} className={styles.roomItem}>
                {r.roomNumber}
              </div>
            ))}
          </div>
        );
      }
    },
    {
      title: "Total Price",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "payment_method",
      key: "payment_method",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: 'PENDING', value: 'PENDING' },
        { text: 'CONFIRMED', value: 'CONFIRMED' },
        { text: 'CANCELED', value: 'CANCELED' },
        { text: 'COMPLETED', value: 'COMPLETED' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (_, record) => getBookingStatusTag(record.status)
    },
    {
      title: "Ngày tạo",
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
      align: "center",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Chi tiết người dùng</h2>
      </div>

      <div className={styles.content}>
        {/* LEFT: USER INFO */}
        <div className={styles.userInfo}>
          <div className={styles.avatarSection}>
            <img src={getAvatarUrl(user.name)} alt="avatar" className={styles.avatar} />
            <div>
              <div className={`${styles.role} ${getRoleClass(user.role)}`}>{user.role}</div>
              <div className={styles.name}>{user.name}</div>
            </div>
          </div>

          <div className={styles.infoItem}>
            <span>Email</span>
            <span>{user.email}</span>
          </div>
          <div className={styles.infoItem}>
            <span>Số điện thoại</span>
            <span>{user.phone}</span>
          </div>
          <div className={styles.infoItem}>
            <span>Ngày sinh</span>
            <span>{formatDate(user.birthDate)}</span>
          </div>
          <div className={styles.infoItem}>
            <span>Hạng</span>
            <span className={`${styles.badge} ${getRankClass(user.rank)}`}>
              {user.rank}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span>Trạng thái</span>
            <span className={`${getUserStatusClass(user.status)}`}>{user.status ? "Hoạt động" : "Ngừng hoạt động"}</span>
          </div>
          <div className={styles.infoItem}>
            <span>Ngày tạo tài khoản</span>
            <span>{formatDate(user.createdAt)}</span>
          </div>
        </div>

        {/* RIGHT: BOOKING LIST */}
        <div className={styles.bookingSection}>
          <div className={styles.bookingHeader}>
            <div className={styles.bookingTitle}>
              Lịch sử đặt phòng ({filtered.length})
            </div>
            <div>
              <SearchOutlined />
              <Input
                placeholder="Search booking code"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: 220 }}
              />
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={filtered}
            rowKey="code"
            pagination={{ pageSize: 5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
