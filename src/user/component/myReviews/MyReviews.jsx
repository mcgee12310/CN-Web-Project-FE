import React, { useState } from "react";
import { Table, Input, Rate, Tooltip, Popconfirm } from "antd";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { formatDate } from "../../../utils/format";
import styles from "./MyReviews.module.css";

import FeedbackModal from "../feedbackModal/FeedbackModal";
import create from "@ant-design/icons/lib/components/IconFont";

const MyReviews = () => {
  // ✅ Dữ liệu mẫu
  const reviews = [
    {
      id: "12345",
      bookingCode: "BK1111",
      roomName: "Superior Family Room",
      rating: 4,
      comment: "Good",
      created_at: "2023-08-20"
    },
    {
      id: "12344",
      bookingCode: "BK1121",
      roomName: "Superior Room",
      rating: 3.5,
      comment: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea, esse dicta in accusantium totam culpa harum qui iure, labore error, itaque quia. Accusantium itaque nesciunt blanditiis voluptas veniam, asperiores quos.",
      created_at: "2023-08-21"
    },
  ];

  // ✅ State
  const [search, setSearch] = useState("");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const filteredData = reviews.filter((b) =>
    b.bookingCode.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Mở Feedback modal
  const handleFeedback = (request) => {
    setSelectedRequest(request);
    setIsFeedbackOpen(true);
  };

  const truncateText = (text, maxLength = 20) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;


  // ✅ Cấu hình bảng
  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "bookingCode",
      key: "bookingCode",
      sorter: (a, b) => a.bookingCode.localeCompare(b.bookingCode),
      render: (bookingCode) => (
        <div className={styles.codeCell}>
          {bookingCode}
        </div>
      ),
    },
    {
      title: "Tên phòng đặt",
      dataIndex: "roomName",
      key: "room",
      render: (room) => <strong className={styles.room}>{room}</strong>,
    },
    {
      title: "Điểm đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => <Rate
        character={({ index }) =>
          index + 1 <= rating ? (
            <StarFilled style={{ color: "#fbbf24" }} />
          ) : (
            <StarOutlined style={{ color: "#fbbf24" }} />
          )
        }
        value={rating}
        count={5}
      />
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
      key: "comment",
      render: (text) => (
        <Tooltip title={text}>
          <span>{truncateText(text, 50)}</span>
        </Tooltip>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      defaultSortOrder: "descend",
      render: (date) => <div className={styles.dateCell}>{formatDate(date)}</div>,
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <div className={styles.actionIcons}>
          <Tooltip title="Edit">
            <EditOutlined
              className={styles.editIcon}
              onClick={() => handleFeedback(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure to delete this review?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(record)}
            >
              <DeleteOutlined className={styles.deleteIcon} />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className={styles.header}>
        <h2>My Reviews</h2>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <SearchOutlined />
          <Input
            placeholder="Tìm theo mã đơn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 250, marginLeft: 8 }}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={false}
        className={styles.table}
      />

      <FeedbackModal
        visible={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        request={selectedRequest}
      />
    </div>
  );
};

export default MyReviews;
