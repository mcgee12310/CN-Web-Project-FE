import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Empty } from "antd";
import styles from "./RoomReviews.module.css";
import reviewService from "../../../../services/admin/review";
import { formatDate } from "../../../../utils/format";

// Số lượng review hiển thị ban đầu
const INITIAL_DISPLAY_COUNT = 5;

// Hàm tính điểm trung bình (làm tròn đến 1 chữ số thập phân)
const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  const average = total / reviews.length;
  return Math.round(average * 10) / 10; 
};

function RoomReviews() { 
  const { id } = useParams(); 
  const roomTypeId = id; 
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);

  // Fetch reviews từ API
  useEffect(() => {
    const fetchReviews = async () => {
      if (!roomTypeId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await reviewService.getRoomTypeReviews(roomTypeId);
        
        const rawReviews = response.data || [];

        // Chuyển đổi dữ liệu từ API
        const formattedReviews = rawReviews.map((review) => ({
          id: review.id,
          name: review.userName || "Khách hàng", 
          rating: review.rating,
          date: formatDate(review.createdAt), 
          comment: review.comment,
        }));

        setReviews(formattedReviews);
        setAverageRating(calculateAverageRating(rawReviews)); 
        setError(null);

      } catch (err) {
        console.error("Lỗi khi tải đánh giá:", err);
        setError("Không thể tải đánh giá. Vui lòng thử lại.");
        setReviews([]);
        setAverageRating(0);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [roomTypeId]);

  // Tính toán reviews cần hiển thị
  const reviewsToShow = useMemo(() => {
    return reviews.slice(0, displayCount);
  }, [reviews, displayCount]);

  // Xử lý khi nhấn nút "Xem tất cả"
  const handleShowAll = () => {
    setDisplayCount(reviews.length);
  };

  // Xử lý khi nhấn nút "Thu gọn"
  const handleCollapse = () => {
    setDisplayCount(INITIAL_DISPLAY_COUNT);
  };

  const renderStars = (starRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (starRating >= i) stars.push(<FaStar key={i} className={styles.star} />);
      else if (starRating >= i - 0.5)
        stars.push(<FaStarHalfAlt key={i} className={styles.star} />);
      else stars.push(<FaRegStar key={i} className={styles.star} />);
    }
    return stars;
  };

  // Xử lý trạng thái Loading
  if (loading) {
    return (
      <section className={styles.reviews}>
        <h2 className={styles.title}>Đánh giá</h2>
        <div>Đang tải đánh giá...</div>
      </section>
    );
  }

  // Xử lý trạng thái Error
  if (error && reviews.length === 0) {
    return (
      <section className={styles.reviews}>
        <h2 className={styles.title}>Đánh giá</h2>
        <div className={styles.error}>{error}</div>
      </section>
    );
  }

  const totalReviews = reviews.length;
  const isAllShown = displayCount >= totalReviews;

  return (
    <section className={styles.reviews}>
      <div className={styles.header}>
        <h2 className={styles.title}>Đánh giá</h2>
        <div className={styles.ratingSummary}>
          <div className={styles.ratingNumber}>{averageRating.toFixed(1)}</div>
          <div className={styles.ratingDetails}>
            <div className={styles.stars}>{renderStars(averageRating)}</div>
            <div className={styles.reviewCount}>{totalReviews} đánh giá</div> 
          </div>
        </div>
      </div>

      <div className={styles.reviewsList}>
        {totalReviews === 0 ? (
          <Empty
          description="Chưa có đánh giá nào cho loại phòng này."
          className={styles.empty}
        />          
        ) : (
          reviewsToShow.map((review) => (
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
          ))
        )}
      </div>

      {/* Nút Xem tất cả / Thu gọn */}
      {totalReviews > INITIAL_DISPLAY_COUNT && (
        <div className={styles.showMoreContainer}>
          {isAllShown ? (
            <button className={styles.showMoreButton} onClick={handleCollapse}>
              Thu gọn
            </button>
          ) : (
            <button className={styles.showMoreButton} onClick={handleShowAll}>
              Xem tất cả ({totalReviews} đánh giá)
            </button>
          )}
        </div>
      )}

    </section>
  );
}

export default RoomReviews;