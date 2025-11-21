import React, { useEffect, useState } from "react";
import styles from "./filterSidebar.module.css";

function FilterSidebar({ rooms, onFilterChange }) {
  const [selectedTypes, setSelectedTypes] = useState({});

  // chỉ chạy 1 lần khi mount, KHÔNG chạy khi ExploreRoom re-render
  useEffect(() => {
    const initial = {};
    rooms.forEach((room) => {
      initial[room.name] = false;
    });
    setSelectedTypes(initial);
  }, []); // 👈 EMPTY ARRAY — CHỈ CHẠY 1 LẦN

  const toggleType = (name) => {
    setSelectedTypes((prev) => {
      const updated = {
        ...prev,
        [name]: !prev[name],
      };

      onFilterChange(updated);
      return updated;
    });
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Loại phòng</h3>

        <div className={styles.checkboxGroup}>
          {rooms.map((room) => (
            <label key={room.id} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={selectedTypes[room.name] || false}
                onChange={() => toggleType(room.name)}
              />
              <span className={styles.checkboxText}>{room.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterSidebar;
