import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { IoPricetag } from "react-icons/io5";
import styles from "./RoomInfo.module.css";

function RoomInfo({ roomData }) {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className={styles.star} />);
      else if (rating >= i - 0.5)
        stars.push(<FaStarHalfAlt key={i} className={styles.star} />);
      else stars.push(<FaRegStar key={i} className={styles.star} />);
    }
    return stars;
  };

  const hasPrice = Boolean(roomData.price);
  const hasCurrency = Boolean(roomData.currency);
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " VNĐ";
  };

  return (
    <section className={styles.roomInfo}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>{roomData.name}</h1>
          <div className={styles.priceWrapper}>
            {hasPrice ? (
              <>
                <IoPricetag className={styles.priceIcon} />
                <span className={styles.priceAmount}>
                  {formatPrice(roomData.price)}
                </span>
              </>
            ) : (
              <span className={styles.pricePending}>Giá đang cập nhật</span>
            )}
          </div>
        </div>
        {/* <div className={styles.rating}>
          <span className={styles.stars}>{renderStars(roomData.rating)}</span>
          <span className={styles.ratingValue}>
            {roomData.rating} ({roomData.reviewCount} đánh giá)
          </span>
        </div> */}
      </div>

      <p className={styles.roomClass}>{roomData.roomClass}</p>

      <div className={styles.divider}></div>

      <div className={styles.description}>
        <h2 className={styles.sectionTitle}>Mô tả</h2>
        <p className={styles.descriptionText}>{roomData.description}</p>
      </div>
    </section>
  );
}

export default RoomInfo;
