import React, { useState } from "react";
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

const MyReviews = () => {
  // Dữ liệu mẫu - trong thực tế sẽ fetch từ API
  const reviews = [
    {
      id: "12345",
      bookingCode: "BK1111",
      roomName: "Superior Family Room",
      roomType: "Phòng Standard",
      roomImage: "/background.jpg",
      rating: 4,
      comment:
        "Phòng rất đẹp và sạch sẽ. Nhân viên thân thiện. Tôi sẽ quay lại!",
      created_at: "2023-08-20",
      checkIn: "2023-08-15",
      checkOut: "2023-08-18",
    },
    {
      id: "12344",
      bookingCode: "BK1121",
      roomName: "Superior Room",
      roomType: "Phòng Deluxe",
      roomImage: "/background.jpg",
      rating: 3.5,
      comment:
        "Phòng khá tốt nhưng có một số điểm cần cải thiện. View đẹp nhưng cách âm chưa tốt lắm. Nhìn chung vẫn hài lòng với dịch vụ.",
      created_at: "2023-08-21",
      checkIn: "2023-08-10",
      checkOut: "2023-08-12",
    },
    {
      id: "12343",
      bookingCode: "BK1131",
      roomName: "Deluxe King Room",
      roomType: "Phòng VIP",
      roomImage: "/background1.jpg",
      rating: 5,
      comment:
        "Tuyệt vời! Không có gì để chê. Phòng sang trọng, tiện nghi đầy đủ.",
      created_at: "2023-07-15",
      checkIn: "2023-07-10",
      checkOut: "2023-07-13",
    },
  ];

  const [search, setSearch] = useState("");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const filteredData = reviews.filter(
    (review) =>
      review.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      review.roomName.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (review) => {
    setSelectedReview(review);
    setIsFeedbackOpen(true);
  };

  const handleDelete = (review) => {
    console.log("Xóa đánh giá:", review);
    // Xử lý xóa đánh giá
  };

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
                      <h3 className={styles.roomName}>{review.roomName}</h3>
                      <span className={styles.roomType}>{review.roomType}</span>
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
                        Lưu trú: {formatDate(review.checkIn)} -{" "}
                        {formatDate(review.checkOut)}
                      </span>
                      <span className={styles.divider}>•</span>
                      <span className={styles.dateText}>
                        Đánh giá: {formatDate(review.created_at)}
                      </span>
                    </div>

                    <div className={styles.actions}>
                      <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(review)}
                        className={styles.editBtn}
                      >
                        Sửa
                      </Button>
                      <Popconfirm
                        title="Xóa đánh giá này?"
                        description="Bạn có chắc chắn muốn xóa đánh giá này không?"
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={() => handleDelete(review)}
                        okButtonProps={{ danger: true }}
                      >
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          className={styles.deleteBtn}
                        >
                          Xóa
                        </Button>
                      </Popconfirm>
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
