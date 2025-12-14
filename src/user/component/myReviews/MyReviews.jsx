import React, { useState, useEffect } from "react";
import { Input, Rate, Card, Empty, Button, Popconfirm, Avatar } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  HomeOutlined,
  StarFilled,
} from "@ant-design/icons";
import { formatDate } from "../../../utils/format";
import styles from "./MyReviews.module.css";
import FeedbackModal from "../feedbackModal/FeedbackModal";
import profileService from "../../../services/user/profile";

const MyReviews = () => {
  const [search, setSearch] = useState("");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        const reviewsRes = await profileService.getMyReviews();

        const mergedReviews = await Promise.all(
          reviewsRes.map(async (review) => {
            const bookingRes = await profileService.getBookingId(
              review.bookingId
            );

            return {
              id: review.id,
              bookingId: review.bookingId,
              bookingCode: review.bookingCode,
              roomType: bookingRes.roomType,
              roomImage: bookingRes.image,
              rating: review.rating,
              comment: review.comment,
              created_at: review.createdAt,
            };
          })
        );

        setReviews(mergedReviews);
      } catch (error) {
        console.error("Lỗi lấy danh sách reviews", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const filteredData = reviews.filter(
    (review) =>
      review.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      review.roomName.toLowerCase().includes(search.toLowerCase())
  );

  const getRatingText = (rating) => {
    if (rating >= 4.5) return "Tuyệt vời";
    if (rating >= 3.5) return "Rất tốt";
    if (rating >= 2.5) return "Tốt";
    if (rating >= 1.5) return "Trung bình";
    return "Cần cải thiện";
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Đánh giá của tôi</h2>
        <p className={styles.subtitle}>
          Quản lý tất cả các đánh giá bạn đã viết cho các phòng đã đặt
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <SearchOutlined className={styles.searchIcon} />
          <Input
            placeholder="Tìm theo mã đơn hoặc tên phòng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.stats}>
          <span className={styles.statItem}>
            Tổng đánh giá: <strong>{reviews.length}</strong>
          </span>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <Empty
          description="Không tìm thấy đánh giá nào"
          className={styles.empty}
        />
      ) : (
        <div className={styles.reviewsList}>
          {filteredData.map((review) => (
            <Card key={review.id} className={styles.reviewCard} hoverable>
              <div className={styles.cardContent}>
                {/* Ảnh phòng */}
                <div className={styles.imageSection}>
                  <img
                    src={review.roomImage}
                    alt={review.roomName}
                    className={styles.roomImage}
                  />
                </div>

                {/* Nội dung chính */}
                <div className={styles.mainContent}>
                  {/* Header */}
                  <div className={styles.reviewHeader}>
                    <div className={styles.roomInfo}>
                      <h3 className={styles.roomName}>{review.roomType}</h3>
                    </div>
                    <div className={styles.bookingCode}>
                      Mã: {review.bookingCode}
                    </div>
                  </div>

                  {/* Đánh giá */}
                  <div className={styles.ratingSection}>
                    <div className={styles.ratingScore}>
                      <div className={styles.ratingDetails}>
                        <Rate
                          disabled
                          allowHalf
                          value={review.rating}
                          className={styles.stars}
                        />
                        <span className={styles.ratingText}>
                          {getRatingText(review.rating)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bình luận */}
                  <div className={styles.commentSection}>
                    <p className={styles.comment}>{review.comment}</p>
                  </div>

                  {/* Footer */}
                  <div className={styles.reviewFooter}>
                    <div className={styles.dateInfo}>
                      <CalendarOutlined className={styles.icon} />
                      <span className={styles.dateText}>
                        Đánh giá: {formatDate(review.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <FeedbackModal
        visible={isFeedbackOpen}
        onClose={() => {
          setIsFeedbackOpen(false);
          setSelectedReview(null);
        }}
        request={selectedReview}
      />
    </div>
  );
};

export default MyReviews;
