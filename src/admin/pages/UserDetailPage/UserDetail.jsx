import React, { useState, useEffect, } from "react";
import { Table, Input, Tag, Button, Modal } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import styles from "./UserDetail.module.css";
import { formatDate } from "../../../utils/format";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import userService from "../../../services/admin/user";

// seed bookings
const bookingsSeed = [
  {
    id: 0,
    bookingCode: "string",
    bookingDate: "2025-11-15T07:56:54.831Z",
    status: "PENDING",
    declineReason: "string",
    requests: [
      { id: 0, roomNumber: "1" },
      { id: 1, roomNumber: "2" },
    ],
    createdAt: "2025-11-02T07:56:54.831Z",
    updatedAt: "2025-11-02T07:56:54.831Z"
  },
  {
    id: 1,
    bookingCode: "string",
    bookingDate: "2025-11-01T07:56:54.831Z",
    status: "CONFIRMED",
    requests: [],
    createdAt: "2025-11-02T07:56:54.831Z",
    updatedAt: "2025-11-02T07:56:54.831Z"
  },
  // ... các booking khác
];

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState(bookingsSeed);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalAction, setModalAction] = useState(""); // "delete" | "restore"

  // fetch user info từ API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        const response = await userService.getUserDetail(id);

        // Nếu API trả về: { data: [...] }
        const data = response.data;

        setUser(data);
        console.log("User:", data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Đang tải...</div>;

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
      case "SILVER": return styles.silver;
      case "GOLD": return styles.gold;
      case "DIAMOND": return styles.diamond;
      default: return "";
    }
  };

  const getRoleClass = (role) => role === "ADMIN" ? styles.roleAdmin : styles.roleUser;
  const getUserStatusClass = (status) => status ? styles.active : styles.inactive;
  const getBookingStatusTag = (status) => {
    switch (status) {
      case "CANCELED": return <Tag color="red">{status}</Tag>;
      case "CONFIRMED": return <Tag color="green">{status}</Tag>;
      case "PENDING": return <Tag color="orange">{status}</Tag>;
      case "COMPLETED": return <Tag color="blue">{status}</Tag>;
      default: return <Tag color="red">{status}</Tag>;
    }
  };

  const filtered = bookings.filter(b => b.bookingCode?.toString().includes(search));
  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "bookingCode",
      key: "code",
      sorter: (a, b) => a.bookingCode.localeCompare(b.bookingCode),
      render: text => <span className={styles.codeCell}>{text}</span>
    },
    {
      title: "Tên phòng",
      key: "rooms",
      render: (_, record) => {
        if (!record.requests || record.requests.length === 0) return <span>—</span>;
        return <div className={styles.roomList}>
          {record.requests.map((r, i) => <div key={i} className={styles.roomItem}>{r.roomNumber}</div>)}
        </div>;
      }
    },
    {
      title: "Tổng giá trị",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "payment_method",
      key: "payment_method",
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
      render: date => <div className={styles.dateCell}>{formatDate(date)}</div>
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
            <img src={getAvatarUrl(user.name)} alt="avatar" className={styles.avatar} />
            <div>
              <div className={`${styles.role} ${getRoleClass(user.role)}`}>{user.role}</div>
              <div className={styles.name}>{user.name}</div>
            </div>
          </div>
          <div className={styles.infoItem}><span>Email</span><span>{user.email}</span></div>
          <div className={styles.infoItem}><span>Số điện thoại</span><span>{user.phone}</span></div>
          <div className={styles.infoItem}><span>Ngày sinh</span><span>{user.birthDate ? formatDate(user.birthDate) : "—"}</span></div>
          <div className={styles.infoItem}><span>Hạng</span><span className={`${styles.badge} ${getRankClass(user.rank)}`}>{user.rank || "—"}</span></div>
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
            pagination={{ pageSize: 10 }}
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
