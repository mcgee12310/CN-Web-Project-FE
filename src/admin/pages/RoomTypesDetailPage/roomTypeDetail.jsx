import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageGallery from "../../components/roomDetail/ImageGallery/ImageGallery";
import RoomInfo from "../../components/roomDetail/RoomInfo/RoomInfo";
import RoomImagesEdit from "../../components/roomDetail/RoomImages/RoomImagesEdit";
import RoomReviews from "../../components/roomDetail/RoomReviews/RoomReviews";
import RoomAmenities from "../../components/roomDetail/RoomAmenities/RoomAmenities";
import styles from "./roomTypeDetail.module.css";
import roomTypeService from "../../../services/admin/roomType";
import amenityService from "../../../services/admin/amenity";

function RoomDetail() {
  const { id } = useParams();
  const [roomInfo, setRoomInfo] = useState({});
  const [images, setImages] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [allAmenities, setAllAmenities] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const fetchRoomTypeDetail = async () => {
      try {
        setIsInitialLoading(true);

        const [roomRes, imagesRes, amenitiesRes] = await Promise.all([
          roomTypeService.getRoomTypeDetail(id),
          roomTypeService.getRoomTypeImages(id),
          amenityService.getAllAmenities(),
        ]);

        const roomData = roomRes.data;
        const imagesData = (imagesRes.data || []);
        const amenitiesData = amenitiesRes.data || [];

        console.log(imagesData);

        setRoomInfo(roomData);
        setAmenities(roomData.amenities || []);
        setAllAmenities(amenitiesData);
        setImages(imagesData);

      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    if (id) fetchRoomTypeDetail();
  }, [id]);

  const handleDeleteRoomType = () => {
    if (window.confirm(`Xóa loại phòng: ${roomInfo.name}?`)) {
      console.log("Delete room type:", roomInfo.id);
    }
  }

  if (isInitialLoading) return <p>Loading...</p>;
  if (!roomInfo?.id) return <p>Không tìm thấy phòng!</p>;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}><h2>{roomInfo.name}</h2></div>

          <ImageGallery images={images} />

          <div className={styles.content}>
            <div className={styles.leftColumn}>
              <RoomInfo
                roomTypeId={roomInfo.id}
                roomData={roomInfo}
                onSave={(updated) => setRoomInfo({ ...roomInfo, ...updated })}
              />

              <RoomImagesEdit
                roomTypeId={id}
                images={images}
                onChange={(newImages) => setImages(newImages)}
              />

              <RoomAmenities
                roomTypeId={roomInfo.id}
                amenities={amenities}
                allAmenities={allAmenities}
                onChange={(data) => setAmenities(data.amenities)}
              />

              <RoomReviews
                rating={roomInfo.review}
                reviewCount={roomInfo.reviewCount}
              />
              <button className={styles.deleteBtn} onClick={handleDeleteRoomType}>Xóa loại phòng này</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RoomDetail;
