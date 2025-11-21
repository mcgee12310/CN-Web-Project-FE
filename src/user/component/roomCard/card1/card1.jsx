import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./card1.module.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { motion, useInView } from "framer-motion";

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
  const navigate = useNavigate();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2 });

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
        {rooms.map((room, i) => (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 1, delay: i * 0.5 }}
            viewport={{ amount: 0.2 }}
          >
            <motion.div
              className={styles.roomCard}
              whileHover={{
                y: -5,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              onClick={() => navigate(`/room/${room.id}`)}
            >
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
                  <span className={styles.stars}>
                    {renderStars(room.review)}
                  </span>
                  <span className={styles.ratingValue}>{room.review}</span>
                </div>
                <div className={styles.roomPrice}>{room.price}</div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Card1;
