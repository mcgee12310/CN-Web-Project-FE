import React, { useState } from "react";
import { Table, Input, Tag, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./UserDetail.module.css";

const user = {
  "id": 1,
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "phone": "0123456789",
  "birthDate": "2025-11-02T07:10:17.429Z",
  "status": true,
  "role": "USER",
  "isVerified": true,
  "createdAt": "2025-11-02T07:10:17.429Z",
  "updatedAt": "2025-11-02T07:10:17.429Z",
  "bookings": [
    {
      id: 0,
      bookingCode: "string",
      "bookingDate": "2025-11-02T07:56:54.831Z",
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
          "guests": [
            {
              "id": 0,
              "fullName": "string",
              "identityType": "CMND",
              "identityNumber": "string",
              "identityIssuedDate": "2025-11-02",
              "identityIssuedPlace": "string"
            }
          ]
        }
      ],
      "createdAt": "2025-11-02T07:56:54.831Z",
      "updatedAt": "2025-11-02T07:56:54.831Z"
    },
    {
      id: 1,
      bookingCode: "string",
      "bookingDate": "2025-11-02T07:56:54.831Z",
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
      bookingCode: "string",
    },
    {
      id: 2,
      bookingCode: "string",
    },
    {
      id: 2,
      bookingCode: "string",
    },
    {
      id: 2,
      bookingCode: "string",
    },
    {
      id: 2,
      bookingCode: "string",
    },
    {
      id: 2,
      bookingCode: "string",
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
      return styles.statusActive;
    } else {
      return styles.statusInactive;
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
      title: "Code",
      dataIndex: "bookingCode",
      key: "code",
      render: (text) => <span className={styles.codeCell}>{text}</span>,
    },
    {
      title: "Total room",
      key: "rooms",
      render: (_, record) => <div className={styles.totalRoomCell}>{record.requests?.length || 0}</div>,
    },
    {
      title: "Total Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => getBookingStatusTag(record.status)
    },
    {
      title: "Create at",
      dataIndex: "bookingDate",
      key: "date",
      render: (date) => <div className={styles.dateCell}>{formatDate(date)}</div>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="text"
          icon={<SearchOutlined />}
          onClick={() => handleView(record.bookingCode)}
        />
      ),
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
            <span>Phone</span>
            <span>{user.phone}</span>
          </div>
          <div className={styles.infoItem}>
            <span>Birthday</span>
            <span>{formatDate(user.birthDate)}</span>
          </div>
          <div className={styles.infoItem}>
            <span>Status</span>
            <span>{user.status ? "Hoạt động" : "Ngừng hoạt động"}</span>
          </div>
          <div className={styles.infoItem}>
            <span>Create at</span>
            <span>{formatDate(user.createdAt)}</span>
          </div>
        </div>

        {/* RIGHT: BOOKING LIST */}
        <div className={styles.bookingSection}>
          <div className={styles.bookingHeader}>
            <div className={styles.bookingTitle}>
              Booking List ({filtered.length})
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
