import React from "react";
import {
  IoWifi,
  IoSnow,
  IoRestaurant,
  IoCar,
  IoLockClosed,
  IoShirt,
  IoWater, // Hair dryer
} from "react-icons/io5";
import styles from "./RoomAmenities.module.css";

function RoomAmenities({ amenities }) {
  const amenityIcons = {
    Kitchen: IoRestaurant,
    Wifi: IoWifi,
    "Air conditioning": IoSnow,
    Refrigerator: IoSnow,
    "Hair dryer": IoWater,
    Iron: IoShirt,
    Safe: IoLockClosed,
  };

  const getIcon = (amenity) => {
    const IconComponent = amenityIcons[amenity] || IoCar;
    return <IconComponent className={styles.icon} />;
  };

  return (
    <section className={styles.amenities}>
      <h2 className={styles.title}>Tiện nghi</h2>
      <div className={styles.grid}>
        {amenities.map((amenity, index) => (
          <div key={index} className={styles.amenityItem}>
            {getIcon(amenity)}
            <span className={styles.amenityText}>{amenity}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RoomAmenities;
