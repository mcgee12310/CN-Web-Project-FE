import React, { useState, useEffect } from "react";
import { Modal, Rate, Input, Button } from "antd";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

import styles from "./FeedbackModal.module.css";
import profileService from "../../../services/user/profile";

const FeedbackModal = ({ visible, onClose, booking }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (booking) {
      setRating(booking.rating || 0);
      setComment(booking.comment || "");
    }
  }, [booking]);

  if (!booking) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.warning("Vui lòng chọn số sao đánh giá");
      return;
    }

    setLoading(true);
    try {
      await profileService.postReview({
        bookingId: booking.id,
        rating,
        comment,
      });

      toast.success("Đánh giá thành công!");
      onClose();
    } catch (error) {
      console.error("Post review failed:", error);
      toast.error("Gửi đánh giá thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      className={styles.modal}
    >
      <div className={styles.container}>
        <h2 className={styles.roomName}>{booking.roomType}</h2>
        {/* Ảnh phòng placeholder */}{" "}
        <div className={styles.imageWrapper}>
          {booking.image ? (
            <img
              src={booking.image}
              alt={booking.roomType}
              className={styles.roomImage}
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              <div className={styles.imageIcon} />
            </div>
          )}
        </div>
        {/* Rating */}
        <div className={styles.section}>
          <p className={styles.label}>Điểm đánh giá</p>
          <Rate
            character={({ index }) =>
              index + 1 <= rating ? (
                <StarFilled style={{ color: "#fbbf24" }} />
              ) : (
                <StarOutlined style={{ color: "#fbbf24" }} />
              )
            }
            onChange={setRating}
            value={rating}
            count={5}
          />
        </div>
        {/* Comment */}
        <div className={styles.section}>
          <p className={styles.label}>Bình luận</p>
          <Input.TextArea
            rows={4}
            placeholder="Viết nhận xét của bạn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles.commentBox}
            maxLength={500}
            showCount
          />
        </div>
        <Button
          type="primary"
          className={styles.saveButton}
          onClick={handleSubmit}
          loading={loading}
          block
        >
          Lưu đánh giá
        </Button>
      </div>
    </Modal>
  );
};

export default FeedbackModal;
