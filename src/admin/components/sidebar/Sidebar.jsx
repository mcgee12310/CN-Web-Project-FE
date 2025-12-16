import React from 'react';
import styles from './Sidebar.module.css';
import { NavLink, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import { 
  LayoutDashboard, Users, DollarSign, Bed, Home, BarChartBigIcon,
  LogOut // Thêm icon LogOut
} from 'lucide-react'; 

const Sidebar = () => {
  const navigate = useNavigate(); // Sử dụng hook navigate để chuyển hướng

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'users', label: 'Người dùng', icon: Users, path: '/admin/users' },
    { id: 'bookings', label: 'Đơn đặt phòng', icon: DollarSign, path: '/admin/bookings' },
    { id: 'room-types', label: 'Loại phòng', icon: Home, path: '/admin/room-types' },
    { id: 'rooms', label: 'Phòng', icon: Bed, path: '/admin/rooms' },
    { id: 'tiers', label: 'Hạng', icon: BarChartBigIcon, path: '/admin/tiers' },
    // { id: 'review', label: 'Đánh giá', icon: Star, path: '/admin/reviews' },
  ];

  const handleLogout = () => {
    // 1. Xóa token hoặc thông tin xác thực (ví dụ: từ localStorage)
    localStorage.removeItem('user'); 
    console.log('Đã đăng xuất.');

    // 2. Chuyển hướng người dùng đến trang đăng nhập
    navigate('/login'); 
  };

  return (
    <div className={styles.sidebar}>
      {/* Menu chính */}
      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `${styles.menuButton} ${isActive ? styles.menuButtonActive : styles.menuButtonInactive}`
              }
            >
              <Icon className={styles.icon} />
              <span style={{ fontWeight: 500 }}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
