import React, { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import styles from "./RoomReviews.module.css";
import roomService from "../../../../services/user/room";
import { Empty } from "antd";

function RoomReviews({ roomTypeId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await roomService.getRoomReviews(roomTypeId);
        setReviews(data || []);
      } catch (error) {
        console.error("Lỗi tải reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (roomTypeId) fetchReviews();
  }, [roomTypeId]);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) return null;

  return (
    <section className={styles.reviews}>
      <h2 className={styles.title}>Đánh giá</h2>

      {reviews.length === 0 ? (
        <Empty
          description="Không tìm thấy đánh giá nào"
          className={styles.empty}
        />
      ) : (
        <div className={styles.reviewsList}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewerInfo}>
                  <div className={styles.avatar}>
                    {review.userName?.charAt(0)}
                  </div>
                  <div>
                    <div className={styles.reviewerName}>{review.userName}</div>
                    <div className={styles.reviewDate}>
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>
                <div className={styles.reviewStars}>
                  {renderStars(review.rating)}
                </div>
              </div>

              <p className={styles.reviewComment}>{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default RoomReviews;
