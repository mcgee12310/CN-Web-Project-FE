import React, { useState } from 'react';
import styles from './Dashboard.module.css';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const barData = [
    { name: 'Jan', label1: 65, label2: 45 },
    { name: 'Feb', label1: 59, label2: 48 },
    { name: 'Mar', label1: 80, label2: 55 }
  ];

  const pieData = [
    { name: 'Label 1', value: 30, color: '#6366f1' },
    { name: 'Label 2', value: 45, color: '#ec4899' },
    { name: 'Label 3', value: 25, color: '#14b8a6' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.chartsSection}>
          <div className={styles.chartsGrid}>
            {/* Bar Chart */}
            <div className={styles.chartCard}>
              <div className={styles.chartLegend}>
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ backgroundColor: '#6366f1' }}></div>
                  <span className={styles.legendLabel}>Label 1</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ backgroundColor: '#ec4899' }}></div>
                  <span className={styles.legendLabel}>Label 2</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="label1" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="label2" fill="#ec4899" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className={styles.chartCard}>
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
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
