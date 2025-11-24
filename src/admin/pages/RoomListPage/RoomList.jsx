import React, { useEffect, useState } from "react";
import { Table, Input, Button } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import styles from "./RoomList.module.css";
import AddRoomModal from "../../components/addRoomModal/AddRoomModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import roomService from "../../../services/admin/room"; // <-- tạo file này

const RoomList = () => {
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
      sorter: (a, b) => a.roomTypeName.localeCompare(b.roomTypeName),
      render: (text) => <span className={styles.type}>{text}</span>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      render: (text) => <span className={styles.desc}>{text}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      filters: [
        { text: "Khả dụng", value: "AVAILABLE" },
        { text: "Đã đặt", value: "BOOKED" },
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
        <h2>Danh sách phòng</h2>
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
        <button
          className={styles.addBtn}
          onClick={() => setOpenModal(true)}
        >
          Thêm phòng
        </button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ y: 500 }}
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
