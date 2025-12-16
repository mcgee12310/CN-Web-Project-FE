import React, { useEffect, useState } from "react";
import { Table, Input, Tag, Button, Menu, Dropdown, Modal } from "antd";
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
import { usePageTitle } from '../../../utils/usePageTitle';
import bookingService from "../../../services/admin/booking";

const BookingList = () => {
  usePageTitle('Danh sách đơn');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const navigate = useNavigate();

  // 📡 fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getAllBookings();

      // 👉 map dữ liệu API → table
      const mappedData = res.data.map((b) => ({
        id: b.id,
        bookingCode: b.bookingCode,
        roomType: b.roomType,
        userName: b.user?.name || b.userName,
        totalRoom: b.totalRoom,
        totalPrice: b.price,
        status: b.status,
        bookingDate: b.bookingDate,
      }));

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
      toast.success(`Hủy đơn ${bookingToCancel.bookingCode} thành công`);
      closeCancelModal();
      fetchBookings();
    } catch (error) {
      console.error(error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Hủy đơn thất bại";
      toast.error(errorMessage);
      closeCancelModal();
    }
  };

  // 🔍 search theo mã đơn
  const filteredData = data.filter((b) =>
    b.bookingCode?.toLowerCase().includes(search.toLowerCase())
  );

  // 🧩 columns (GIỮ NGUYÊN STYLE)
  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "bookingCode",
      key: "code",
      sorter: (a, b) => a.bookingCode.localeCompare(b.bookingCode),
      render: (text) => <span className={styles.codeCell}>{text}</span>,
      width: '15%',
    },
    {
      title: "Tên phòng",
      dataIndex: "roomType",
      key: "roomType",
      sorter: (a, b) => a.roomType.localeCompare(b.roomType),
      render: (_, record) => (
        <div className={styles.nameCell}>{record.roomType}</div>
      ),
      width: '20%',
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => (
        <div className={styles.priceCell}>{formatPrice(price)}</div>
      ),
      width: '20%',
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Chờ thanh toán", value: "PAYMENT_PENDING" },
        { text: "Đã thanh toán", value: "PAYMENT_COMPLETED" },
        { text: "Đã hủy", value: "CANCELLED" },
        { text: "Hoàn thành", value: "COMPLETED" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (_, record) => formatStatus(record.status),
      width: '15%',
    },
    {
      title: "Ngày đặt",
      dataIndex: "bookingDate",
      key: "date",
      defaultSortOrder: "descend",
      sorter: (a, b) => new Date(a.bookingDate) - new Date(b.bookingDate),
      render: (date) => (
        <div className={styles.dateCell}>{formatDate(date)}</div>
      ),
      width: '20%',
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

            {!["COMPLETED", "CANCELLED"].includes(record.status) && (
              <Menu.Item
                key="delete"
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
      align: "center",
    },
  ];

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Danh sách đơn đặt phòng</h1>
            <p className={styles.subtitle}>Quản lý danh sách đơn đặt phòng hiện tại</p>
          </div>

          <div className={styles.controls}>
            <div className={styles.searchBox}>
              <SearchOutlined />
              <Input
                placeholder="Tìm kiếm theo mã đơn..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: 250, height: 40, marginLeft: 8 }}
              />
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} đơn`
          }}
          scroll={{ y: 800 }}
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
        <p>Bạn có chắc chắn muốn hủy đơn <strong>{bookingToCancel?.bookingCode}</strong> không?</p>
      </Modal>
    </>

  );
};

export default BookingList;
