import React, { useState } from "react";
import styles from "./filterSidebar.module.css";
import { IoChevronForward } from "react-icons/io5";

function FilterSidebar() {
  const [roomTypes, setRoomTypes] = useState({
    hotel: true,
    guesthouse: true,
    house: false,
    apartment: true,
  });

  const [prices, setPrices] = useState({
    below50: true,
    from50to99: true,
    from100to200: false,
    above200: false,
  });

  const handleRoomTypeChange = (type) => {
    setRoomTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handlePriceChange = (price) => {
    setPrices((prev) => ({
      ...prev,
      [price]: !prev[price],
    }));
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Room type</h3>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={roomTypes.hotel}
              onChange={() => handleRoomTypeChange("hotel")}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>Hotel</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={roomTypes.guesthouse}
              onChange={() => handleRoomTypeChange("guesthouse")}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>Guesthouse</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={roomTypes.house}
              onChange={() => handleRoomTypeChange("house")}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>House</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={roomTypes.apartment}
              onChange={() => handleRoomTypeChange("apartment")}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>Apartment</span>
          </label>
        </div>
      </div>

      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Price</h3>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={prices.below50}
              onChange={() => handlePriceChange("below50")}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>Below $50</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={prices.from50to99}
              onChange={() => handlePriceChange("from50to99")}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>From $50 to $99</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={prices.from100to200}
              onChange={() => handlePriceChange("from100to200")}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>From $100 to $200</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={prices.above200}
              onChange={() => handlePriceChange("above200")}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>Above $200</span>
          </label>
        </div>
      </div>

      <div className={styles.filterSection}>
        <button className={styles.filterButton}>
          <span>Reviews</span>
          <IoChevronForward className={styles.arrowIcon} />
        </button>
      </div>

      <div className={styles.filterSection}>
        <button className={styles.filterButton}>
          <span>Amenities</span>
          <IoChevronForward className={styles.arrowIcon} />
        </button>
      </div>
    </div>
  );
}

export default FilterSidebar;

