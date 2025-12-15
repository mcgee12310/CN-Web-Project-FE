import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./card1.module.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { motion, useInView } from "framer-motion";
import roomService from "../../../../services/user/room";

function Card1() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2 });
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    const data = await roomService.getAllRoomType();
    // console.log("Data", data);
    setRooms(data.sort((a, b) => b.price - a.price).slice(0, 3));
  };
  useEffect(() => {
    fetchRooms();
  }, []);

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
            key={room.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div
              className={styles.roomCard}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/room/${room.id}`)}
            >
              <div className={styles.roomImageWrapper}>
                <img
                  src={room.primaryImageUrl || "/background.jpg"}
                  alt={room.name}
                  className={styles.roomImage}
                />
              </div>

              <div className={styles.roomInfo}>
                <h3>{room.name}</h3>
                <p>{room.description}</p>
              </div>

              <div className={styles.roomFooter}>
                <div className={styles.roomPrice}>
                  {room.price.toLocaleString("vi-VN")} VNĐ / đêm
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Card1;
