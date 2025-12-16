import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table } from "antd";
import { formatDate, formatPrice, formatStatus } from '../../../utils/format';
import { usePageTitle } from '../../../utils/usePageTitle';
import dashboardService from '../../../services/admin/dashboard'; // giả sử bạn tạo service gọi API

const Dashboard = () => {
  usePageTitle('Tổng quan');
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getDashboard(); // gọi API
        setData(res.data);
      } catch (err) {
        console.error("Fetch dashboard failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Không có dữ liệu</div>;

  const { totalRooms, totalUsers, ordersThisMonth, revenueThisMonth, revenueStats, customerTierStats, latestBookings, latestCustomers } = data;

  // Pie chart cho khách hàng theo hạng
  const rankColors = {
    BRONZE: "#cd7f32",
    SILVER: "#c0c0c0",
    GOLD: "#f1c40f",
    DIAMOND: "#00bfff",
    DEFAULT: "#cccccc"
  };

  const pieData = customerTierStats.map(t => ({ name: t.tier, value: t.count }));

  const barData = revenueStats.map(r => ({
    name: r.month,
    bookings: r.orderCount,
    revenue: r.revenue / 1000000, // hiển thị triệu đồng
  }));

  const bookingColumns = [
    { title: "Mã đơn", dataIndex: "code", key: "code", render: (text) => <span className={styles.codeCell}>{text}</span>, },
    { title: "Khách hàng", dataIndex: "customerName", key: "user" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => formatStatus(record.status),
    },
    { title: "Ngày tạo", dataIndex: "createdDate", key: "createdDate", render: (date) => <div className={styles.dateCell}>{formatDate(date)}</div>, },
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
    { title: "Ngày tạo", dataIndex: "createdDate", key: "createdDate", render: (date) => <div className={styles.dateCell}>{formatDate(date)}</div>, },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Trang tổng quan</h1>
          <p className={styles.subtitle}>Theo dõi và quản lí các thông tin chung của hệ thống</p>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.statsRow}>
          <div className={styles.statCard} style={{ borderLeftColor: "#f59e0b" }}>
            <span className={styles.statLabel}>Tổng số phòng</span>
            <span className={styles.statValue}>{totalRooms}</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Tổng số người dùng</span>
            <span className={styles.statValue}>{totalUsers}</span>
          </div>

          <div className={styles.statCard} style={{ borderLeftColor: "#ec4899" }}>
            <span className={styles.statLabel}>Đơn tháng này</span>
            <span className={styles.statValue}>{ordersThisMonth}</span>
          </div>

          <div className={styles.statCard} style={{ borderLeftColor: "#14b8a6" }}>
            <span className={styles.statLabel}>Doanh thu tháng</span>
            <span className={styles.statValue}>{formatPrice(revenueThisMonth)}</span>
          </div>
        </div>

        <div className={styles.chartsSection}>
          <div className={styles.chartCard}>
            <h3>Thống kê doanh thu</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="bookings" name="Số đơn" fill="#6366f1" radius={[8, 8, 0, 0]} />
                <Bar dataKey="revenue" name="Doanh thu (triệu)" fill="#ec4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartCard}>
            <h3>Thống kê khách hàng</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={rankColors[entry.name] || rankColors.DEFAULT} />
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
              dataSource={data.latestCustomers}
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
