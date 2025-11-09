import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import styles from "./RoomReviews.module.css";

function RoomReviews({ rating, reviewCount }) {
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

  const reviews = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      rating: 5,
      date: "15 tháng 3, 2024",
      comment:
        "Phòng rất đẹp và sạch sẽ. Nhân viên phục vụ nhiệt tình. Sẽ quay lại lần sau!",
    },
    {
      id: 2,
      name: "Trần Thị B",
      rating: 4,
      date: "10 tháng 3, 2024",
      comment:
        "Phòng rộng rãi, view đẹp. Chỉ có điều wifi hơi chậm một chút nhưng không ảnh hưởng nhiều.",
    },
    {
      id: 3,
      name: "Lê Văn C",
      rating: 5,
      date: "5 tháng 3, 2024",
      comment:
        "Tuyệt vời! Phòng đúng như mô tả, rất thích hợp cho gia đình có trẻ em.",
    },
  ];

  return (
    <section className={styles.reviews}>
      <div className={styles.header}>
        <h2 className={styles.title}>Đánh giá</h2>
        <div className={styles.ratingSummary}>
          <div className={styles.ratingNumber}>{rating}</div>
          <div className={styles.ratingDetails}>
            <div className={styles.stars}>{renderStars(rating)}</div>
            <div className={styles.reviewCount}>{reviewCount} đánh giá</div>
          </div>
        </div>
      </div>

      <div className={styles.reviewsList}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewerInfo}>
                <div className={styles.avatar}>{review.name.charAt(0)}</div>
                <div>
                  <div className={styles.reviewerName}>{review.name}</div>
                  <div className={styles.reviewDate}>{review.date}</div>
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
    </section>
  );
}

export default RoomReviews;
