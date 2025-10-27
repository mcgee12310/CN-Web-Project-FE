import React from "react";
import styles from "./card1.module.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

function Card1() {
  const rooms = [
    {
      id: 1,
      name: "Phòng Deluxe",
      desc: "Phòng rộng rãi với view thành phố",
      price: "1,500,000 VNĐ/đêm",
      image: "/background.jpg",
      review: 4,
    },
    {
      id: 2,
      name: "Phòng Suite",
      desc: "Phòng cao cấp với đầy đủ tiện nghi",
      price: "2,500,000 VNĐ/đêm",
      image: "/background.jpg",
      review: 4.5,
    },
    {
      id: 3,
      name: "Phòng Family",
      desc: "Phòng gia đình với 2 giường đôi",
      price: "2,000,000 VNĐ/đêm",
      image: "/background.jpg",
      review: 5,
    },
  ];

  // Hàm tạo icon sao theo số review
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

  return (
    <div className={styles.container}>
      <h2>Phòng nổi bật</h2>
      <div className={styles.roomsGrid}>
        {rooms.map((room) => (
          <div key={room.id} className={styles.roomCard}>
            <div className={styles.roomImageWrapper}>
              <img
                src={room.image}
                alt={room.name}
                className={styles.roomImage}
              />
            </div>
            <div className={styles.roomInfo}>
              <h3>{room.name}</h3>
              <p>{room.desc}</p>
            </div>
            <div className={styles.roomFooter}>
              <div className={styles.review}>
                <span className={styles.stars}>{renderStars(room.review)}</span>
                <span className={styles.ratingValue}>{room.review}</span>
              </div>
              <div className={styles.roomPrice}>{room.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Card1;
