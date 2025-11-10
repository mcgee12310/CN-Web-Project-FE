import React, { useState } from "react";
import { Table, Input, Select, Button, Dropdown, Menu } from "antd";
import { SearchOutlined, EyeOutlined, DeleteOutlined, MoreOutlined, RedoOutlined } from "@ant-design/icons";
import styles from "./UserList.module.css";
import { useNavigate } from "react-router-dom";



const generateUsers = () => {
  const users = [];
  for (let i = 1; i <= 50; i++) {
    users.push({
      key: i,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      phone: `+84 9${Math.floor(10000000 + Math.random() * 90000000)}`,
      dob: `15/0${(i % 9) + 1}/199${i % 10}`,
      status: i % 3 === 0 ? true : false,
      role: i % 2 === 0 ? "ADMIN" : "USER",
      created: `2023-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    });
  }
  return users;
};

const handleDelete = (record) => {
  alert(`Xóa user: ${record.name}`);
};

const handleRestore = (record) => {
  alert(`Khôi phục user: ${record.name}`);
}

const usersData = generateUsers();

const UserList = () => {
  const navigate = useNavigate();
  const handleView = (record) => {
    navigate(`/admin/users/${record.key}`); // hoặc record.id
  };

  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredData = usersData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ? true : item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "name",
      render: (text, record) => (
        <div className={styles.nameCell}>
          <span>{text}</span>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => (
        <div className={styles.emailCell}>
          <span>{text}</span>
        </div>
      ),
      sorter: (a, b) => a.email.localeCompare(b.email),
      width: 200,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (text, record) => (
        <div className={styles.phoneCell}>
          <span>{text}</span>
        </div>
      ),
      sorter: (a, b) => a.phone.localeCompare(b.phone),
      width: 150,
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      render: (text, record) => (
        <div className={styles.dobCell}>
          <span>{text}</span>
        </div>
      ),
      sorter: (a, b) => a.dob.localeCompare(b.dob),
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      filters: [
        { text: "Hoạt động", value: true },
        { text: "Ngừng", value: false },
      ],
      onFilter: (value, record) => record.status === value,
      render: status => (
        <span className={status === true ? styles.active : styles.inactive}>
          {status === true ? "Hoạt động" : "Ngừng"}
        </span>
      ),
      width: 120,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      filters: [
        { text: "Quản trị viên", value: "ADMIN" },
        { text: "Người dùng", value: "USER" },
      ],
      onFilter: (value, record) => record.role === value,
      render: role => (
        <span className={role === "ADMIN" ? styles.roleAdmin : styles.roleUser}>
          {role === "ADMIN" ? "Quản trị viên" : "Người dùng"}
        </span>
      ),
      width: 120,
    },
    // {
    //   title: "Ngày tạo",
    //   dataIndex: "created",
    //   width: 150,
    // },
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

            {record.status ? (
              <Menu.Item
                key="delete"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record)}
                danger
              >
                Xóa
              </Menu.Item>
            ) : (
              <Menu.Item
                key="restore"
                icon={<RedoOutlined />}
                onClick={() => handleRestore(record)}
              >
                Khôi phục
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
      width: 80,
      align: "center",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Danh sách người dùng</h2>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <SearchOutlined />
          <Input
            placeholder="Tìm kiếm người dùng..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250, marginLeft: 8 }}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10 }}
        scroll={{ y: 400 }}  // <-- chiều cao cố định, scroll rows
      />
    </div>
  );
};

export default UserList;
