import React, { useState, useEffect } from "react";
import styles from "./RoomAmenities.module.css";

function RoomAmenities({ roomTypeId, amenities, allAmenities = [], onChange }) {

  const safeAmenities = Array.isArray(amenities) ? amenities : [];

  const [selected, setSelected] = useState(
    safeAmenities.map((a) => (typeof a === "string" ? a : a.name))
  );

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setSelected(
      safeAmenities.map((a) => (typeof a === "string" ? a : a.name))
    );
    setIsDirty(false);
  }, [amenities]);

  const handleToggle = (amenityName) => {
    let updated;

    if (selected.includes(amenityName)) {
      updated = selected.filter((a) => a !== amenityName);
    } else {
      updated = [...selected, amenityName];
    }

    setSelected(updated);
    setIsDirty(true);
  };

  const handleSubmit = () => {
    const normalized = selected.map((name) => ({ name }));

    const payload = {
      id: roomTypeId,
      amenities: normalized,
    };

    console.log("Submitting amenities:", payload);

    if (onChange) onChange(payload);

    setIsDirty(false);
  };

  const handleCancel = () => {
    setSelected(
      safeAmenities.map((a) => (typeof a === "string" ? a : a.name))
    );
    setIsDirty(false);
  };

  return (
    <section className={styles.amenities}>
      <h2 className={styles.title}>Tiện nghi</h2>

      <div className={styles.grid}>
        {allAmenities.map((am) => (
          <label key={am.id} className={styles.amenityItem}>
            <input
              type="checkbox"
              checked={selected.includes(am.name)}
              onChange={() => handleToggle(am.name)}
            />
            {am.name}
          </label>
        ))}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.saveBtn}
          disabled={!isDirty}
          onClick={handleSubmit}
        >
          Lưu
        </button>

        <button className={styles.cancelBtn} onCancel={handleCancel}>
          Hủy
        </button>
      </div>
    </section>
  );
}

export default RoomAmenities;
