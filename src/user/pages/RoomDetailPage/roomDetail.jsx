import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Header from "../../component/header/header";
import Footer from "../../component/footer/footer";
import ImageGallery from "../../component/roomDetail/ImageGallery/ImageGallery";
import RoomInfo from "../../component/roomDetail/RoomInfo/RoomInfo";
import RoomAmenities from "../../component/roomDetail/RoomAmenities/RoomAmenities";
import BookingSection from "../../component/roomDetail/BookingSection/BookingSection";
import styles from "./roomDetail.module.css";
import roomService from "../../../services/user/room";

function RoomDetail() {
  const { id } = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialCheckInDate = queryParams.get("checkInDate") || "";
  const initialCheckOutDate = queryParams.get("checkOutDate") || "";

  const [roomData, setRoomData] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [checkInDate, setCheckInDate] = useState(initialCheckInDate);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOutDate);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Hàm gọi lại API để lấy chi tiết phòng
  const fetchRoomDetail = async (checkInDate, checkOutDate) => {
    try {
      if (roomData) {
        setIsUpdating(true);
      } else {
        setIsInitialLoading(true);
      }
      const data = await roomService.getRoomTypeDetail(
        id,
        checkInDate,
        checkOutDate
      );
      setRoomData(data);
    } catch (error) {
      console.error("Lỗi tải room detail:", error);
    } finally {
      setIsInitialLoading(false);
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchRoomDetail(checkInDate, checkOutDate);
  }, [id, checkInDate, checkOutDate]);

  if (isInitialLoading) return <p>Loading...</p>;
  if (!roomData) return <p>Không tìm thấy phòng!</p>;

  const images = [
    "/background.jpg",
    "/background1.jpg",
    "/background2.jpg",
    "/background.jpg",
  ];

  const handleDateChange = (newCheckInDate, newCheckOutDate) => {
    setCheckInDate(newCheckInDate);
    setCheckOutDate(newCheckOutDate);
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <ImageGallery images={images} />

          <div className={styles.content}>
            <div className={styles.leftColumn}>
              <RoomInfo roomData={roomData} />
              <RoomAmenities amenities={roomData.amenities} />
            </div>

            <div className={styles.rightColumn}>
              <BookingSection
                roomData={roomData}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                onDateChange={handleDateChange}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default RoomDetail;
