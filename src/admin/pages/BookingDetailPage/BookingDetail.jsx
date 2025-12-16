import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tabs } from "antd";
import styles from "./BookingDetail.module.css";
import RequestCard from "../../components/requestCard/RequestCard";
import userService from "../../../services/admin/user";
import bookingService from "../../../services/admin/booking";
import { usePageTitle } from "../../../utils/usePageTitle";
import { formatDate, formatStatus, formatPrice } from "../../../utils/format";

export default function BookingDetail({}) {
  usePageTitle("Chi tiết đơn");
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  const fetchBookingDetail = async (id) => {
    try {
      setLoading(true);
      const res = await bookingService.getBookingDetail(id);

      setBooking(res.data);
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Fetch booking detail failed", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetail = async (userId) => {
    try {
      setUserLoading(true);
      const res = await userService.getUserDetail(userId);
      setUser(res.data);
    } catch (err) {
      console.error("Fetch user detail failed", err);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBookingDetail(id);
  }, [id]);

  useEffect(() => {
    if (booking?.userId) {
      fetchUserDetail(booking.userId);
    }
  }, [booking]);

  const handleUpdate = (updatedRequest) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r))
    );
  };

  const tabItems = requests.map((req) => ({
    key: String(req.id),
    label: `Request ${req.id}`,
    children: (
      <RequestCard
        request={req}
        note={booking.bookingNote}
        onUpdate={handleUpdate}
      />
    ),
  }));

  if (loading) return <div>Loading...</div>;
  if (!booking) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Thông tin chi tiết - {booking.id}</h2>
      <div className={styles.cardRow}>
        {/* --- CUSTOMER INFORMATION --- */}
        <div className={styles.customerCard}>
          <div className={styles.cardHeader}>
            <span>Thông tin khách hàng</span>
          </div>

          {userLoading ? (
            <div>Loading user...</div>
          ) : user ? (
            <>
              <div className={styles.infoRow}>
                <span className={styles.label}>Họ tên:</span>
                <span>{user.name}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.label}>Email:</span>
                <span>{user.email}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.label}>Số điện thoại:</span>
                <span>{user.phone}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.label}>Hạng:</span>
                <span className={styles.badge}>{user.customerTier}</span>
              </div>
            </>
          ) : (
            <div>Không tìm thấy thông tin người dùng</div>
          )}
        </div>

        {/* --- BOOKING INFORMATION --- */}
        <div className={styles.customerCard}>
          <div className={styles.cardHeader}>
            <span>Thông tin đơn</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Mã đơn:</span>
            <span>{booking.bookingCode}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Tổng tiền:</span>
            <span>{formatPrice(booking.price)}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Trạng thái:</span>
            <span>{formatStatus(booking.status)}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Ngày đặt:</span>
            <span>{formatDate(booking.bookingDate)}</span>
          </div>
        </div>
      </div>
      {/* --- REQUEST CARDS --- */}
      <Tabs defaultActiveKey="1" items={tabItems} tabPosition="top" />
    </div>
  );
}
