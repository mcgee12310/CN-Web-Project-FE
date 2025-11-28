import React, { useState, useEffect } from "react";
import { Modal, Rate, Input, Button } from "antd";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import styles from "./FeedbackModal.module.css";

const FeedbackModal = ({ visible, onClose, request }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (request) {
      setRating(request.rating || 0);
      setComment(request.comment || "");
    }
  }, [request]);

  if (!request) return null;

  const handleSubmit = () => {
    console.log("Feedback submitted:", {
      requestId: request.id,
      room: request.roomName,
      rating,
      comment,
    });
    onClose();
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
        <h2 className={styles.roomName}>{request.roomName}</h2>

        {/* Ảnh phòng placeholder */}
        <div className={styles.imagePlaceholder}>
          <div className={styles.imageIcon} />
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
          />
        </div>

        {/* Nút lưu */}
        <Button
          type="primary"
          className={styles.saveButton}
          onClick={handleSubmit}
          // loading={loading}
          block
        >
          Lưu đánh giá
        </Button>
      </div>
    </Modal>
  );
};

export default FeedbackModal;
