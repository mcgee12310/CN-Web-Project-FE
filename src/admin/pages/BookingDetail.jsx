import React, { useState } from "react";
import { Table, Tag, Input, Button, Select, Card, Row, Col } from "antd";
import {
  EditOutlined,
  SaveOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import styles from "./BookingDetail.module.css";

const { Option } = Select;

const BookingDetail = () => {
  // ======= Mock Data =======
  const [status, setStatus] = useState("Pending");
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState("");

  const booking = {
    id: 1139,
    createdAt: "2025-07-21T00:00:00Z",
    customer: {
      name: "John",
      email: "example@gmail.com",
      phone: "0111111111",
    },
    requests: [
      {
        id: 4,
        roomNumber: "P504",
        people: 1,
        roomType: "Garden Superior",
        price: 38007054.67,
        status: "Check in",
        checkIn: "2025-07-03T00:00:00Z",
        checkOut: "2025-07-07T00:00:00Z",
        note: "",
        createdAt: "2025-07-21T00:00:00Z",
      },
      {
        id: 5,
        roomNumber: "A101",
        people: 2,
        roomType: "Deluxe Room",
        price: 22000000,
        status: "Check out",
        checkIn: "2025-07-05T00:00:00Z",
        checkOut: "2025-07-09T00:00:00Z",
        note: "",
        createdAt: "2025-07-21T00:00:00Z",
      },
    ],
  };

  // ======= Format Helper =======
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("vi-VN");
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

  const getStatusTag = (status) => {
    switch (status) {
      case "Check in":
        return <Tag color="green">Check in</Tag>;
      case "Check out":
        return <Tag color="blue">Check out</Tag>;
      case "Pending":
        return <Tag color="gold">Pending</Tag>;
      case "Confirm":
        return <Tag color="cyan">Confirm</Tag>;
      case "Completed":
        return <Tag color="purple">Completed</Tag>;
      case "Cancel":
        return <Tag color="red">Cancel</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  // ======= Table Config =======
  const filtered = booking.requests.filter((r) =>
    r.roomNumber.toLowerCase().includes(search.toLowerCase())
  );

  const totalPrice = filtered.reduce((sum, r) => sum + r.price, 0);

  const columns = [
    { title: "ID request", dataIndex: "id", key: "id" },
    { title: "Room Number", dataIndex: "roomNumber", key: "roomNumber" },
    { title: "Total people", dataIndex: "people", key: "people" },
    { title: "Type of room", dataIndex: "roomType", key: "roomType" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (p) => formatCurrency(p),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => getStatusTag(s),
    },
    {
      title: "Check in",
      dataIndex: "checkIn",
      key: "checkIn",
      render: (d) => formatDate(d),
    },
    {
      title: "Check out",
      dataIndex: "checkOut",
      key: "checkOut",
      render: (d) => formatDate(d),
    },
    { title: "Note", dataIndex: "note", key: "note" },
    {
      title: "Create at",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d) => formatDate(d),
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <>
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </>
      ),
    },
  ];

  // ======= Render =======
  return (
    <div style={{ padding: "24px" }}>
      <h2>Booking Detail #{booking.id}</h2>

      {/* ==== Thông tin Booking + User ==== */}
      <Row gutter={24} style={{ marginBottom: 32 }}>
        {/* Bên trái: Booking Info */}
        <Col xs={24} md={12}>
          <Card title="Booking Information" bordered={true}>
            <p>
              <strong>Total Room:</strong> {booking.requests.length}
            </p>
            <p>
              <strong>Total Price:</strong> {formatCurrency(totalPrice)}
            </p>
            <p>
              <strong>Booking Date:</strong> {formatDate(booking.createdAt)}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {editMode ? (
                <>
                  <Select
                    value={status}
                    onChange={setStatus}
                    style={{ width: 150, marginRight: 8 }}
                  >
                    <Option value="Cancel">Cancel</Option>
                    <Option value="Completed">Completed</Option>
                    <Option value="Confirm">Confirm</Option>
                    <Option value="Pending">Pending</Option>
                    <Option value="Draft">Draft</Option>
                  </Select>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => setEditMode(false)}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <>
                  {getStatusTag(status)}
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => setEditMode(true)}
                  />
                </>
              )}
            </p>
          </Card>
        </Col>

        {/* Bên phải: Customer Info */}
        <Col xs={24} md={12}>
          <Card title="Customer Information" extra={<a href="#">View Detail</a>}>
            <p>
              <strong>Name:</strong> {booking.customer.name}
            </p>
            <p>
              <strong>Email:</strong> {booking.customer.email}
            </p>
            <p>
              <strong>Phone:</strong> {booking.customer.phone}
            </p>
          </Card>
        </Col>
      </Row>

      {/* ==== Danh sách Request ==== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>List of Requests</h3>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by room"
          style={{ width: 220 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        pagination={false}
        style={{ marginTop: 20 }}
        footer={() => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 600,
            }}
          >
            <span>Total Price</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
        )}
      />
    </div>
  );
};

export default BookingDetail;
