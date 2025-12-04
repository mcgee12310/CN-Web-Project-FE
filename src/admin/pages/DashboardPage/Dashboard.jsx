import React, { useState } from 'react';
import styles from './Dashboard.module.css';
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, Tag } from "antd";
import { formatDate, formatPrice } from '../../../utils/format';

const dashboardData = {
  stats: {
    totalRooms: 120,
    totalUsers: 540,
    monthBookings: 58,
    monthRevenue: 125000000,
  },

  chart: {
    bar: [
      { name: 'Jan', bookings: 65, amount: 45.5 },
      { name: 'Feb', bookings: 59, amount: 48 },
      { name: 'Mar', bookings: 80, amount: 55 }
    ],
    pie: [
      { name: 'SILVER', value: 30, color: '#c0c0c0' },
      { name: 'GOLD', value: 45, color: '#f1c40f' },
      { name: 'DIAMOND', value: 25, color: '#00bfff' }
    ]
  },

  latestBookings: [
    { id: 1, code: "A123", user: "Nguyễn Văn A", room: "P101", status: "PENDING", createdAt: "2025-11-20" },
    { id: 2, code: "B552", user: "Trần Thị B", room: "P205", status: "CONFIRMED", createdAt: "2025-11-21" },
    { id: 3, code: "C911", user: "Hoàng Văn C", room: "P302", status: "PENDING", createdAt: "2025-11-21" },
    { id: 4, code: "D782", user: "Lê Thị D", room: "P110", status: "CANCELED", createdAt: "2025-11-22" },
  ],

  latestUsers: [
    { id: 1, name: "Lê Hữu T", email: "t@gmail.com", phone: "0901111", createdAt: "2025-11-22" },
    { id: 2, name: "Phạm T.H", email: "ph@gmail.com", phone: "0902222", createdAt: "2025-11-21" },
    { id: 3, name: "Đặng Bình", email: "binh@gmail.com", phone: "0903333", createdAt: "2025-11-20" },
    { id: 4, name: "Vũ Mai", email: "mai@gmail.com", phone: "0904444", createdAt: "2025-11-20" },
  ],
};


const Dashboard = () => {
  const navigate = useNavigate();
  const { stats, chart, latestBookings, latestUsers } = dashboardData;
  const barData = chart.bar;
  const pieData = chart.pie;

  const rankColors = {
    SILVER: "#c0c0c0",
    GOLD: "#f1c40f",
    DIAMOND: "#00bfff",
    DEFAULT: "#cccccc"
  };

  const bookingColumns = [
    { title: "Mã đơn", dataIndex: "code", key: "code", render: (text) => <span className={styles.codeCell}>{text}</span>, },
    { title: "Khách hàng", dataIndex: "user", key: "user" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "PENDING"
            ? "orange"
            : status === "CONFIRMED"
              ? "green"
              : "red";

        return <Tag color={color}>{status}</Tag>;
      },
    },
    { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt", render: (date) => <div className={styles.dateCell}>{formatDate(date)}</div>, },
  ];

  const userColumns = [
    {
      title: "Tên", dataIndex: "name", key: "name", render: (text, record) => (
        <div className={styles.codeCell}>
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Email", dataIndex: "email", key: "email", render: (text, record) => (
        <div className={styles.emailCell}>
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Số điện thoại", dataIndex: "phone", key: "phone", render: (text, record) => (
        <div className={styles.phoneCell}>
          <span>{text}</span>
        </div>
      ),
    },
    { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt", render: (date) => <div className={styles.dateCell}>{formatDate(date)}</div>, },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Dashboard</h2>

      <div className={styles.mainContent}>
        <div className={styles.statsRow}>
          <div className={styles.statCard} style={{ borderLeftColor: "#f59e0b" }}>
            <span className={styles.statLabel}>Tổng số phòng</span>
            <span className={styles.statValue}>{stats.totalRooms}</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Tổng số user</span>
            <span className={styles.statValue}>{stats.totalUsers}</span>
          </div>

          <div className={styles.statCard} style={{ borderLeftColor: "#ec4899" }}>
            <span className={styles.statLabel}>Đơn tháng này</span>
            <span className={styles.statValue}>{stats.monthBookings}</span>
          </div>

          <div className={styles.statCard} style={{ borderLeftColor: "#14b8a6" }}>
            <span className={styles.statLabel}>Doanh thu tháng</span>
            <span className={styles.statValue}>{formatPrice(stats.monthRevenue)}</span>
          </div>
        </div>

        <div className={styles.chartsSection}>
          {/* Bar Chart */}
          <div className={styles.chartCard}>
            <h3>Thống kê doanh thu</h3>
            <div className={styles.chartLegend}>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ backgroundColor: '#6366f1' }}></div>
                <span className={styles.legendLabel}>Số đơn</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ backgroundColor: '#ec4899' }}></div>
                <span className={styles.legendLabel}>Doanh thu (triệu đồng)</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="bookings" name="Số đơn" radius={[8, 8, 0, 0]}>
                  {chart.bar.map((d, i) => (
                    <Cell key={i} fill="#6366f1" />
                  ))}
                </Bar>

                <Bar dataKey="amount" name="Doanh thu" radius={[8, 8, 0, 0]}>
                  {chart.bar.map((d, i) => (
                    <Cell key={i} fill="#ec4899" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className={styles.chartCard}>
            <h3>Thống kê khách hàng</h3>
            <div className={styles.chartLegend}>
              {pieData.map((item, index) => (
                <div key={index} className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ backgroundColor: item.color }}></div>
                  <span className={styles.legendLabel}>{item.name}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={rankColors[entry.name] || rankColors.DEFAULT} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.tablesSection}>
          <div className={styles.tableCard}>
            <div className={styles.tableTitle}>
              <h3>Đơn mới nhất</h3>
              <a
                onClick={() => navigate("/admin/bookings")}
              >
                Xem danh sách →
              </a>
            </div>

            <Table
              columns={bookingColumns}
              dataSource={latestBookings}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableTitle}>
              <h3>Khách hàng mới nhất</h3>
              <a
                onClick={() => navigate("/admin/users")}
              >
                Xem danh sách →
              </a>
            </div>
            <Table
              columns={userColumns}
              dataSource={latestUsers}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
