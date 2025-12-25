import React, { useEffect, useState } from "react";
import { Table, Input, Button } from "antd";
import { SearchOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "./RoomList.module.css";
import AddRoomModal from "../../components/addRoomModal/AddRoomModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import roomService from "../../../services/admin/room";
import { usePageTitle } from '../../../utils/usePageTitle';

const RoomList = () => {
  usePageTitle('Danh sách phòng');
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await roomService.getAllRooms();
      const data = res.data.map((r) => ({
        key: r.id,
        id: r.id,
        roomNumber: r.roomNumber,
        roomTypeName: r.roomTypeName,
        description: r.description,
        status: r.status,
      }));
      setRooms(data);
    } catch (error) {
      console.error(error);
      toast.error("Lấy danh sách phòng thất bại!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRooms();
  }, []);
  const handleView = (record) => {
    navigate(`/admin/rooms/${record.id}`);
  };
  const filteredData = rooms.filter((room) =>
    room.roomNumber.toLowerCase().includes(searchText.toLowerCase()) ||
    room.roomTypeName.toLowerCase().includes(searchText.toLowerCase())
  );
  const columns = [
    {
      title: "Tên phòng",
      dataIndex: "roomNumber",
      width: '15%',
      sorter: (a, b) => a.roomNumber.localeCompare(b.roomNumber),
      render: (text) => (
        <div className={styles.nameCell}>
          <strong>{text}</strong>
        </div>
      ),
    },
    {
      title: "Loại phòng",
      dataIndex: "roomTypeName",
      width: '20%',
      sorter: (a, b) => a.roomTypeName.localeCompare(b.roomTypeName),
      render: (text) => <span className={styles.type}>{text}</span>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      render: (text) => <span className={styles.desc}>{text}</span>,
      width: '40%',
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: '15%',
      filters: [
        { text: "Khả dụng", value: "AVAILABLE" },
        { text: "Bảo trì", value: "MAINTENANCE" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <span
          className={
            status === "AVAILABLE"
              ? styles.available
              : status === "BOOKED"
                ? styles.booked
                : styles.maintenance
          }
        >
          {status === "AVAILABLE"
            ? "Khả dụng"
            : status === "BOOKED"
              ? "Đã đặt"
              : "Bảo trì"}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
            fixed: 'right',

      width: 100,
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => handleView(record)}
        />
      ),
    },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Danh sách phòng</h1>
          <p className={styles.subtitle}>Quản lý tất cả phòng hiện có</p>
        </div>

        <div className={styles.controls}>
        <div className={styles.searchBox}>
          <SearchOutlined />
          <Input
            placeholder="Tìm phòng hoặc loại phòng..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300, marginLeft: 8 }}
          />
        </div>
        <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setOpenModal(true)}
          >
            Thêm loại phòng
          </Button>
      </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} phòng`
        }}
        // scroll={{ y: 800 }}
      />

      <AddRoomModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={fetchRooms}
      />
    </div>
  );
};
export default RoomList;
