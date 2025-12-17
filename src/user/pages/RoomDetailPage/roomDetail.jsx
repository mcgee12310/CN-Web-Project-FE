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
import Loading from "../../component/loading/Loading";

function RoomDetail() {
  const { id } = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialCheckInDate = queryParams.get("checkInDate") || "";
  const initialCheckOutDate = queryParams.get("checkOutDate") || "";

  const [roomData, setRoomData] = useState(null);
  const [images, setImages] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [checkInDate, setCheckInDate] = useState(initialCheckInDate);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOutDate);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const DEFAULT_IMAGES = [
    "/background.jpg",
    "/background1.jpg",
    "/background2.jpg",
    "/background.jpg",
  ];
  const normalizeImages = (apiImages) => {
    const result = apiImages.map((img) => img.imageUrl);
    let i = 0;

    while (result.length < 4) {
      result.push(DEFAULT_IMAGES[i % DEFAULT_IMAGES.length]);
      i++;
    }

    return result.slice(0, 4);
  };

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

      const imageRes = await roomService.getRoomTypeImages(id);
      const roomImages = imageRes.data || [];

      setImages(normalizeImages(roomImages));
    } catch (error) {
      console.error("Lỗi tải room detail:", error);
      setImages(DEFAULT_IMAGES);
    } finally {
      setIsInitialLoading(false);
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchRoomDetail(checkInDate, checkOutDate);
  }, [id, checkInDate, checkOutDate]);

  if (isInitialLoading) return <Loading />;
  if (!roomData) return <p>Không tìm thấy phòng!</p>;

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
              <RoomReviews roomTypeId={roomData.id} />
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
