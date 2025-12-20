import React, { useState, useEffect } from "react";
import { Table, Input, Button, Dropdown, Menu } from "antd";
import { SearchOutlined, EyeOutlined, DeleteOutlined, MoreOutlined, RedoOutlined } from "@ant-design/icons";
import styles from "./UserList.module.css";
import { useNavigate } from "react-router-dom";
import userService from "../../../services/admin/user"; // <-- API service
import { toast } from "react-toastify";
import { usePageTitle } from '../../../utils/usePageTitle';

const UserList = () => {
  usePageTitle('Danh sách người dùng');
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getAllUsers();
      const data = res.data.content.map((u) => ({
        key: u.id,
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        customerTier: u.customerTier,
        // Kiểm tra isVerified trước, nếu chưa verify thì status = "notverified"
        // Nếu đã verify rồi thì lấy status gốc
        status: u.isVerified === false ? "notverified" : u.status,
        role: u.role,
        created: new Date(u.createdAt).toLocaleDateString("vi-VN"),
      }));
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error("Lấy danh sách người dùng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleView = (record) => navigate(`/admin/users/${record.id}`);

  const filteredData = users.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.email.toLowerCase().includes(searchText.toLowerCase())
  );
  const getRankClass = (rank) => {
    switch (rank) {
      case "SILVER": return styles.silver;
      case "GOLD": return styles.gold;
      case "DIAMOND": return styles.diamond;
      default: return "";
    }
  };
  const columns = [
  {
    title: "Tên người dùng",
    dataIndex: "name",
    render: (text) => (
      <div className={styles.nameCell}>
        <span>{text}</span>
      </div>
    ),
    sorter: (a, b) => a.name.localeCompare(b.name),
    responsive: ["xs", "sm", "md", "lg"],
  },
  {
    title: "Email",
    dataIndex: "email",
    render: (text) => (
      <div className={styles.emailCell}>
        <span>{text}</span>
      </div>
    ),
    sorter: (a, b) => a.email.localeCompare(b.email),
    responsive: ["sm", "md", "lg"],
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    render: (text) => (
      <div className={styles.phoneCell}>
        <span>{text}</span>
      </div>
    ),
    responsive: ["md", "lg"],
  },
  {
    title: "Hạng",
    dataIndex: "customerTier",
    render: (text) => (
      <div className={styles.badge}>
        <span>{text ? text : "Vô hạng"}</span>
      </div>
    ),
    responsive: ["lg"],
  },
  {
    title: "Vai trò",
    dataIndex: "role",
    filters: [
      { text: "Quản trị viên", value: "ADMIN" },
      { text: "Người dùng", value: "USER" },
    ],
    onFilter: (value, record) => record.role === value,
    render: (role) => (
      <span className={role === "ADMIN" ? styles.roleAdmin : styles.roleUser}>
        {role === "ADMIN" ? "Quản trị viên" : "Người dùng"}
      </span>
    ),
    responsive: ["md", "lg"],
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    filters: [
      { text: "Hoạt động", value: true },
      { text: "Dừng", value: false },
      { text: "Chưa xác thực", value: "notverified" },
    ],
    onFilter: (value, record) => record.status === value,
    render: (status) => {
      if (status === "notverified") {
        return <span className={styles.notverified}>Chưa xác thực</span>;
      }
      return (
        <span className={status ? styles.active : styles.inactive}>
          {status ? "Hoạt động" : "Dừng"}
        </span>
      );
    },
    responsive: ["xs", "sm", "md", "lg"],
  },
  {
    title: "Hành động",
    key: "action",
    align: "center",
    render: (_, record) => (
      <Button
        icon={<EyeOutlined />}
        onClick={() => handleView(record)}
      />
    ),
    responsive: ["xs", "sm", "md", "lg"],
  },
];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Danh sách người dùng</h1>
          <p className={styles.subtitle}>Quản lý toàn bộ người dùng trong hệ thống</p>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <SearchOutlined />
            <Input
              placeholder="Tìm kiếm người dùng..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250, height: 40, marginLeft: 8 }}
            />
          </div>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <Table
  columns={columns}
  dataSource={filteredData}
  loading={loading}
  pagination={{
    showSizeChanger: true,
    showTotal: (total) => `Tổng ${total} người dùng`,
  }}
  scroll={{ x: "max-content" }}
/>
      </div>

    </div>
  );
};
export default UserList;
