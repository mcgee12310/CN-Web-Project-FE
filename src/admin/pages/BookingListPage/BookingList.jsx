import React, { useEffect, useState } from "react";
import { Table, Input, Button, Menu, Dropdown, Modal } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import styles from "./BookingList.module.css";
import { useNavigate } from "react-router-dom";
import { formatPrice, formatDate, formatStatus } from "../../../utils/format";
import { toast } from "react-toastify";
import { usePageTitle } from "../../../utils/usePageTitle";
import bookingService from "../../../services/admin/booking";

const BookingList = () => {
  usePageTitle("Danh sách đơn");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const navigate = useNavigate();

  /* ================= FETCH ================= */
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getAllBookings();

      const mappedData = res.data
        .map((b) => ({
          id: b.id,
          bookingCode: b.bookingCode,
          roomType: b.roomType,
          userName: b.user?.name || b.userName,
          totalRoom: b.totalRoom,
          totalPrice: b.price,
          status: b.status,
          bookingDate: b.bookingDate,
        }))
        // ⭐ MẶC ĐỊNH: ĐƠN MỚI NHẤT TRƯỚC
        .sort(
          (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)
        );

      setData(mappedData);
    } catch (err) {
      console.error("Fetch bookings failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  /* ================= ACTION ================= */
  const handleView = (record) => {
    navigate(`/admin/bookings/${record.id}`);
  };

  const openCancelModal = (record) => {
    setBookingToCancel(record);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setBookingToCancel(null);
    setShowCancelModal(false);
  };

  const confirmCancel = async () => {
    if (!bookingToCancel) return;

    try {
      await bookingService.cancelBooking(bookingToCancel.id);
      toast.success(
        `Hủy đơn ${bookingToCancel.bookingCode} thành công`
      );
      closeCancelModal();
      fetchBookings();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Hủy đơn thất bại"
      );
      closeCancelModal();
    }
  };

  /* ================= SEARCH ================= */
  const filteredData = data.filter((b) =>
    b.bookingCode
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ================= COLUMNS ================= */
  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "bookingCode",
      key: "bookingCode",
      width: 100,
      sorter: (a, b) =>
        a.bookingCode.localeCompare(b.bookingCode),
      render: (text) => (
        <span className={styles.codeCell}>{text}</span>
      ),
    },
    {
      title: "Tên phòng",
      dataIndex: "roomType",
      key: "roomType",
      width: 220,
      sorter: (a, b) =>
        a.roomType.localeCompare(b.roomType),
      render: (text) => (
        <div className={styles.nameCell}>{text}</div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 120,
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      render: (price) => (
        <div className={styles.priceCell}>
          {formatPrice(price)}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 160,
      filters: [
        { text: "Chờ thanh toán", value: "PAYMENT_PENDING" },
        { text: "Đã thanh toán", value: "PAYMENT_COMPLETED" },
        { text: "Đã hủy", value: "CANCELLED" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (_, record) =>
        formatStatus(record.status),
    },
    {
      title: "Ngày đặt",
      dataIndex: "bookingDate",
      key: "bookingDate",
      width: 100,
      sorter: (a, b) =>
        new Date(a.bookingDate) -
        new Date(b.bookingDate),
      defaultSortOrder: "descend",
      render: (date) => (
        <div className={styles.dateCell}>
          {formatDate(date)}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      align: "center",
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

            {!["COMPLETED", "CANCELLED"].includes(
              record.status
            ) && (
              <Menu.Item
                key="cancel"
                icon={<DeleteOutlined />}
                onClick={() => openCancelModal(record)}
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
    },
  ];

  /* ================= RENDER ================= */
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              Danh sách đơn đặt phòng
            </h1>
            <p className={styles.subtitle}>
              Quản lý danh sách đơn đặt phòng hiện tại
            </p>
          </div>

          <div className={styles.controls}>
            <div className={styles.searchBox}>
              <SearchOutlined />
              <Input
                placeholder="Tìm theo mã đơn..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                style={{
                  width: 240,
                  height: 40,
                  marginLeft: 8,
                }}
              />
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          // scroll={{ x: 1100 }}   // ⭐ chống tràn container
          pagination={{
            showSizeChanger: true,
            showTotal: (total) =>
              `Tổng ${total} đơn`,
          }}
        />
      </div>

      <Modal
        title="Xác nhận hủy đơn"
        open={showCancelModal}
        onOk={confirmCancel}
        onCancel={closeCancelModal}
        okText="Hủy đơn"
        cancelText="Đóng"
        okButtonProps={{ danger: true }}
      >
        <p>
          Bạn có chắc chắn muốn hủy đơn{" "}
          <strong>
            {bookingToCancel?.bookingCode}
          </strong>{" "}
          không?
        </p>
      </Modal>
    </>
  );
};

export default BookingList;
