import React, { useState, useEffect, } from "react";
import { Table, Input, Tag, Button, Modal } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import styles from "./UserDetail.module.css";
import { formatDate, formatPrice, formatStatus } from "../../../utils/format";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import userService from "../../../services/admin/user";

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalAction, setModalAction] = useState(""); // "delete" | "restore"
  // fetch user info từ API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserLoading(true);
        const response = await userService.getUserDetail(id);
        setUser(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy user", error);
        toast.error("Không tải được thông tin người dùng");
      } finally {
        setUserLoading(false);
      }
    };

    const fetchUserBooking = async () => {
      try {
        setBookingLoading(true);
        const response = await userService.getUserBooking(id);
        setBookings(response.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy booking", error);
        toast.error("Không tải được lịch sử đặt phòng");
      } finally {
        setBookingLoading(false);
      }
    };

    fetchUserData();
    fetchUserBooking();
  }, [id]);

  if (userLoading) {
    return <div className={styles.loading}>Đang tải dữ liệu...</div>;
  }

  if (!user) {
    return <div className={styles.loading}>Không tìm thấy người dùng.</div>;
  }

  const handleView = (record) => {
    navigate(`/admin/bookings/${record.id}`);
  };
  const handleDelete = () => {
    setModalAction("delete");
    setModalVisible(true);
  };
  const handleRestore = () => {
    setModalAction("restore");
    setModalVisible(true);
  };
  const handleModalOk = async () => {
    try {
      setModalLoading(true);
      const newStatus = modalAction === "delete" ? false : true;
      // Gọi API update user
      if (modalAction === "delete") {
        await userService.deleteUser(user.id);
      } else {
        await userService.resoreUser(user.id);
      }
      // Cập nhật state
      setUser(prev => ({ ...prev, status: newStatus }));
      toast.success(
        modalAction === "delete"
          ? "Người dùng đã bị vô hiệu hóa."
          : "Người dùng đã được khôi phục."
      );
    } catch (error) {
      console.error(error);
      toast.error(
        modalAction === "delete"
          ? "Vô hiệu hóa thất bại."
          : "Khôi phục thất bại."
      );
    } finally {
      setModalLoading(false);
      setModalVisible(false);
    }
  };
  const getAvatarUrl = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

  const getRankClass = (rank) => {
    switch (rank) {
      case "BRONZE": return styles.silver;
      case "SILVER": return styles.silver;
      case "GOLD": return styles.gold;
      case "DIAMOND": return styles.diamond;
      default: return "";
    }
  };

  const getRoleClass = (role) => role === "ADMIN" ? styles.roleAdmin : styles.roleUser;
  const getUserStatusClass = (status) => status ? styles.active : styles.inactive;

  const filtered = bookings.filter(
    b => b.bookingCode?.toString().includes(search)
  );

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "bookingCode",
      key: "code",
      sorter: (a, b) => a.bookingCode.localeCompare(b.bookingCode),
      render: text => <span className={styles.codeCell}>{text}</span>,
      width: '10%',
    },
    {
      title: "Tên phòng",
      dataIndex: "roomType",
      key: "roomType",
      sorter: (a, b) => a.roomType.localeCompare(b.roomType),
      render: text => <span className={styles.roomCell}>{text}</span>,
      width: '20%',
    },
    {
      title: "Tổng giá trị",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (_, record) => formatPrice(record.price),
      width: '20%',
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
      render: (_, record) => formatStatus(record.status),
      width: '20%',
    },
    {
      title: "Ngày tạo",
      dataIndex: "bookingDate",
      key: "date",
      sorter: (a, b) => new Date(a.bookingDate) - new Date(b.bookingDate),
      render: date => <div className={styles.dateCell}>{formatDate(date)}</div>,
      width: '20%',
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
      ),
      align: "center",
    },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.header}><h2>Chi tiết người dùng</h2></div>
      <div className={styles.content}>
        <div className={styles.userInfo}>
          <div className={styles.avatarSection}>
            <img
              src={getAvatarUrl(user.name || "User")}
              alt="avatar"
              className={styles.avatar}
            />
            <div>
              <div className={`${styles.role} ${getRoleClass(user.role)}`}>{user.role}</div>
              <div className={styles.name}>{user.name}</div>
            </div>
          </div>
          <div className={styles.infoItem}><span>Email</span><span>{user.email}</span></div>
          <div className={styles.infoItem}><span>Số điện thoại</span><span>{user.phone}</span></div>
          <div className={styles.infoItem}><span>Ngày sinh</span><span>{user.birthDate ? formatDate(user.birthDate) : "—"}</span></div>
          <div className={styles.infoItem}><span>Tổng số đơn</span><span>{user.totalBookings ? user.totalBookings : "-"}</span></div>
          <div className={styles.infoItem}><span>Tổng chi tiêu</span><span>{user.totalSpent ? formatPrice(user.totalSpent) : "-"}</span></div>
          <div className={styles.infoItem}><span>Hạng</span><span className={`${styles.badge}`}>{user.customerTier || "Vô hạng"}</span></div>
          <div className={styles.infoItem}><span>Trạng thái</span><span className={getUserStatusClass(user.status)}>{user.status ? "Hoạt động" : "Ngừng hoạt động"}</span></div>
          <div className={styles.infoItem}><span>Ngày tạo tài khoản</span><span>{formatDate(user.createdAt)}</span></div>
          <div className={styles.buttonContainer}>
            {user.status ? (
              <button className={styles.deleteBtn} onClick={handleDelete}>
                Vô hiệu hóa người dùng
              </button>
            ) : (
              <button className={styles.restoreBtn} onClick={handleRestore}>
                Khôi phục người dùng
              </button>
            )}
          </div>
        </div>
        <div className={styles.bookingSection}>
          <div className={styles.bookingHeader}>
            <div className={styles.bookingTitle}>Lịch sử đặt phòng ({filtered.length})</div>
            <div>
              <SearchOutlined />
              <Input
                placeholder="Tìm kiếm mã đơn..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: 240, marginLeft: 8 }}
              />
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={filtered}
            rowKey="code"
            loading={bookingLoading}
            pagination={{
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} đơn`
            }}
          />
        </div>
      </div>
      <Modal
        title={modalAction === "delete" ? "Vô hiệu hóa người dùng" : "Khôi phục người dùng"}
        open={modalVisible}
        onOk={handleModalOk}
        confirmLoading={modalLoading}
        onCancel={() => setModalVisible(false)}
        okText={modalAction === "delete" ? "Vô hiệu hóa" : "Khôi phục"}
        cancelText="Hủy"
      >
        <p>
          {modalAction === "delete"
            ? `Bạn có chắc muốn vô hiệu hóa người dùng: ${user.name}?`
            : `Bạn có chắc muốn khôi phục người dùng: ${user.name}?`}
        </p>
      </Modal>
    </div>
  );
};

export default UserDetail;
