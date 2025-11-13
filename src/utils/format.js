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
  if (price == null) return "";
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

// Định dạng trạng thái (nếu cần)
export const formatStatus = (status) => {
  switch (status) {
    case "PENDING":
      return "Đang xử lý";
    case "COMPLETED":
      return "Hoàn thành";
    case "CANCELED":
      return "Đã hủy";
    default:
      return status;
  }
};
