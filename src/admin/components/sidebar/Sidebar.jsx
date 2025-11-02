import React from 'react';
import styles from './Sidebar.module.css';
import { NavLink } from 'react-router-dom';
import { Hotel, LayoutDashboard, Users, DollarSign, Bed, Home, Star } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'booking', label: 'Booking', icon: DollarSign, path: '/admin/booking' },
    { id: 'rooms', label: 'Rooms', icon: Bed, path: '/admin/rooms' },
    { id: 'room-types', label: 'Room Types', icon: Home, path: '/admin/room-types' },
    { id: 'review', label: 'Review', icon: Star, path: '/admin/review' }
  ];

  return (
    <div className={styles.sidebar}>
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
