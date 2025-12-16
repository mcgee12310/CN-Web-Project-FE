import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import styles from "./RoomReviews.module.css";
import reviewService from "../../../../services/admin/review";
import { formatDate } from "../../../../utils/format";

const MOCK_REVIEWS = [
  {
    id: 901,
    name: "Nguyễn Thành Đạt",
    rating: 5,
    date: "2025-12-16T01:36:19.570Z",
    comment: "Phòng ốc sạch sẽ, thoáng mát, dịch vụ quá tuyệt vời. Rất đáng tiền!",
  },
  {
    id: 902,
    name: "Lê Thị Hồng",
    rating: 4,
    date: "2025-12-16T01:36:19.570Z",
    comment: "Trải nghiệm tốt, chỉ có bữa sáng hơi đơn điệu một chút.",
  },
  {
    id: 903,
    name: "Phạm Văn Tài",
    rating: 5,
    date: "2025-12-16T01:36:19.570Z",
    comment: "Địa điểm thuận tiện, nhân viên thân thiện, chắc chắn sẽ quay lại.",
  },
  {
    id: 904,
    name: "Vũ Phương Thảo",
    rating: 3.5,
    date: "2025-12-16T01:36:19.570Z",
    comment: "Mọi thứ ổn, nhưng phòng cách âm chưa thực sự tốt.",
  },
  {
    id: 905,
    name: "Hoàng Minh Quân",
    rating: 4.5,
    date: "2025-12-16T01:36:19.570Z",
    comment: "View đẹp, bể bơi sạch. Rất hài lòng với kỳ nghỉ này.",
  },
  {
    id: 906,
    name: "Trần Mai Anh",
    rating: 5,
    date: "2025-12-16T01:36:19.570Z",
    comment: "Xuất sắc! Không có gì để chê. Phòng sang trọng.",
  },
  {
    id: 907,
    name: "Ngô Đức Kiên",
    rating: 4,
    date: "2025-12-16T01:36:19.570Z",
    comment: "Phòng hơi nhỏ so với mong đợi, nhưng sạch sẽ và tiện nghi đầy đủ.",
  },
  {
    id: 908,
    name: "Bùi Thanh Nga",
    rating: 5,
    date: "2025-12-16T01:36:19.570Z",
    comment: "Tuyệt vời cho chuyến công tác. Có bàn làm việc thoải mái.",
  },
  {
    id: 909,
    name: "Đặng Hữu Phước",
    rating: 4,
    date: "2025-12-16T01:36:19.570Z",
    comment: "Chất lượng tốt, giá cả hợp lý. Khá xa trung tâm.",
  },
  {
    id: 910,
    name: "Lê Mỹ Duyên",
    rating: 5,
    date: "2025-12-16T01:36:19.570Z",
    comment: "Cảm ơn khách sạn đã mang lại trải nghiệm tuyệt vời cho gia đình tôi!",
  },
];

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
        
        let rawReviews = response.data || [];
        let isMocking = false;

        // Sử dụng MOCK DATA nếu API trả về rỗng
        if (rawReviews.length === 0) {
            rawReviews = MOCK_REVIEWS;
            isMocking = true;
        }

        // Chuyển đổi dữ liệu từ API / Mock
        const formattedReviews = rawReviews.map((review) => {
            const date = isMocking ? formatDate(review.date) : formatDate(review.createdAt);
            
            return {
                id: review.id,
                name: review.userName || review.name || "Khách hàng", 
                rating: review.rating,
                date: date, 
                comment: review.comment,
            };
        });

        setReviews(formattedReviews);
        setError(null);
        setAverageRating(calculateAverageRating(rawReviews)); 

      } catch (err) {
        console.error("Lỗi khi tải đánh giá:", err);
        setError("Không thể tải đánh giá. Vui lòng thử lại.");
        
        // Sử dụng Mock khi API lỗi
        const formattedMock = MOCK_REVIEWS.map(r => ({ 
          ...r, 
          date: formatDate(r.date) 
        }));
        setReviews(formattedMock);
        setAverageRating(calculateAverageRating(MOCK_REVIEWS));

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
          <div className={styles.noReviews}>
            Chưa có đánh giá nào cho loại phòng này.
          </div>
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
