import { Tag } from "antd";
import { Currency } from "lucide-react";
// Định dạng ngày
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Định dạng giá tiền
export const formatPrice = (price) => {
  if (price == null) return "0 ₫";

  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

// Định dạng trạng thái (nếu cần)
export const formatStatus = (status) => {
  const tagStyle = {
    fontSize: "14px",
    padding: "4px 10px",
    fontWeight: 500,
  };

  switch (status) {
    case "CANCELLED":
      return <Tag color="red" style={tagStyle}>Đã hủy</Tag>;

    case "PAYMENT_COMPLETED":
      return <Tag color="green" style={tagStyle}>Đã thanh toán</Tag>;

    case "PAYMENT_PENDING":
      return <Tag color="orange" style={tagStyle}>Chờ thanh toán</Tag>;

    case "CHECKED_IN":
      return <Tag color="green" style={tagStyle}>Đã nhận phòng</Tag>;

    case "CHECKED_OUT":
      return <Tag color="blue" style={tagStyle}>Đã trả phòng</Tag>;

    case "COMPLETED":
      return <Tag color="blue" style={tagStyle}>Hoàn thành</Tag>;

    default:
      return <Tag style={tagStyle}>{status}</Tag>;
  }
};
