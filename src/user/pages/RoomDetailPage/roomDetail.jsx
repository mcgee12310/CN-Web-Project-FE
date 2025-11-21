import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Header from "../../component/header/header";
import Footer from "../../component/footer/footer";
import ImageGallery from "../../component/roomDetail/ImageGallery/ImageGallery";
import RoomInfo from "../../component/roomDetail/RoomInfo/RoomInfo";
import RoomAmenities from "../../component/roomDetail/RoomAmenities/RoomAmenities";
import RoomReviews from "../../component/roomDetail/RoomReviews/RoomReviews";
import BookingSection from "../../component/roomDetail/BookingSection/BookingSection";
import styles from "./roomDetail.module.css";
import roomService from "../../../services/user/room";

function RoomDetail() {
  const { id } = useParams();
  const location = useLocation();

  // Nếu bạn truyền checkIn, checkOut qua navigate → nhận lại tại đây
  const queryParams = new URLSearchParams(location.search);
  const checkInDate = queryParams.get("checkInDate") || "";
  const checkOutDate = queryParams.get("checkOutDate") || "";

  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        const data = await roomService.getRoomTypeDetail(
          id,
          checkInDate,
          checkOutDate
        );
        setRoomData(data);
      } catch (error) {
        console.error("Lỗi tải room detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetail();
  }, [id, checkInDate, checkOutDate]);

  if (loading) return <p>Loading...</p>;
  if (!roomData) return <p>Không tìm thấy phòng!</p>;

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <ImageGallery images={roomData.images} />

          <div className={styles.content}>
            <div className={styles.leftColumn}>
              <RoomInfo roomData={roomData} />
              <RoomAmenities amenities={roomData.amenities} />
              <RoomReviews
                rating={roomData.rating}
                reviewCount={roomData.reviewCount}
              />
            </div>

            <div className={styles.rightColumn}>
              <BookingSection roomData={roomData} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default RoomDetail;
