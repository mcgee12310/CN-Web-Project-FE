import React from "react";
import Header from "../../component/header/header";
import Footer from "../../component/footer/footer";
import ImageGallery from "../../component/roomDetail/ImageGallery/ImageGallery";
import RoomInfo from "../../component/roomDetail/RoomInfo/RoomInfo";
import RoomAmenities from "../../component/roomDetail/RoomAmenities/RoomAmenities";
import RoomReviews from "../../component/roomDetail/RoomReviews/RoomReviews";
import BookingSection from "../../component/roomDetail/BookingSection/BookingSection";
import styles from "./roomDetail.module.css";

function RoomDetail() {
  const roomData = {
    id: 1,
    name: "Superior Family Room",
    price: "2,500,000",
    currency: "VNĐ/đêm",
    rating: 4.84,
    reviewCount: 324,
    guests: 6,
    beds: 4,
    baths: 1,
    description:
      "Phòng gia đình rộng rãi và thoáng mát, được thiết kế đặc biệt cho các gia đình có trẻ em. Phòng có 4 giường đôi, 1 phòng tắm riêng và đầy đủ tiện nghi hiện đại. Từ phòng có thể ngắm cảnh thành phố tuyệt đẹp.",
    images: [
      "/background.jpg",
      "/background1.jpg",
      "/background2.jpg",
      "/background.jpg",
    ],
    amenities: [
      "Kitchen",
      "Wifi",
      "Air conditioning",
      "TV",
      "Refrigerator",
      "Hair dryer",
      "Iron",
      "Safe",
    ],
  };

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
