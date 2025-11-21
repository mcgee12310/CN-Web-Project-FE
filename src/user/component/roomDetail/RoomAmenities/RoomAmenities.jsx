import React from "react";
import styles from "./RoomAmenities.module.css";

function RoomAmenities({ amenities }) {
  return (
    <section className={styles.amenities}>
      <h2 className={styles.title}>Tiện nghi</h2>
      <div className={styles.grid}>
        {amenities.map((amenity, index) => (
          <div key={index} className={styles.amenityItem}>
            <span className={styles.amenityText}>{amenity}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RoomAmenities;
