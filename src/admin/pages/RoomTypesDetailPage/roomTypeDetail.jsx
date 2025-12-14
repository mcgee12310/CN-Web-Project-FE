import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button } from "antd";
import { toast } from "react-toastify";

import ImageGallery from "../../components/roomDetail/ImageGallery/ImageGallery";
import RoomInfo from "../../components/roomDetail/RoomInfo/RoomInfo";
import RoomImagesEdit from "../../components/roomDetail/RoomImages/RoomImagesEdit";
import RoomReviews from "../../components/roomDetail/RoomReviews/RoomReviews";

import styles from "./roomTypeDetail.module.css";
import roomTypeService from "../../../services/admin/roomType";
import amenityService from "../../../services/admin/amenity";

function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roomInfo, setRoomInfo] = useState({});
  const [images, setImages] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [allAmenities, setAllAmenities] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Modal xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        const imagesData = imagesRes.data || [];
        const amenitiesData = amenitiesRes.data || [];

        setRoomInfo(roomData);
        setAmenities(roomData.amenities || []);
        setAllAmenities(amenitiesData);
        setImages(imagesData);

      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu", error);
        toast.error("Không tải được dữ liệu phòng");
      } finally {
        setIsInitialLoading(false);
      }
    };
    if (id) fetchRoomTypeDetail();
  }, [id]);

  // Update room info
  const handleSaveRoomInfo = (payload) => {
    setRoomInfo(prev => ({
      ...prev,
      name: payload.name,
      roomClass: payload.roomClass,
      description: payload.description,
      capacity: payload.capacity,
      price: payload.price
    }));

    const updatedAmenities = allAmenities.filter(am => payload.amenityIds.includes(am.id));
    setAmenities(updatedAmenities);

    console.log("✅ Parent state updated:", {
      roomInfo: payload,
      amenities: updatedAmenities
    });
  };

  // Mở modal xóa
  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // Xác nhận xóa
  const confirmDelete = async () => {
    try {
      await roomTypeService.deleteRoomType(roomInfo.id);
      toast.success(`Xóa loại phòng "${roomInfo.name}" thành công`);
      closeDeleteModal();
      navigate("/admin/room-types"); // chuyển về danh sách
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Xóa thất bại");
      closeDeleteModal();
    }
  };

  if (isInitialLoading) return <p>Loading...</p>;
  if (!roomInfo?.id) return <p>Không tìm thấy phòng!</p>;
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2>{roomInfo.name}</h2>
          </div>

          <ImageGallery images={images} />

          <div className={styles.content}>
            <div className={styles.leftColumn}>
              <RoomInfo
                roomTypeId={roomInfo.id}
                roomData={roomInfo}
                amenities={amenities}
                allAmenities={allAmenities}
                onSave={handleSaveRoomInfo}
              />

              <RoomImagesEdit
                roomTypeId={id}
                images={images}
                onChange={(newImages) => setImages(newImages)}
              />

              <RoomReviews
                rating={roomInfo.review}
                reviewCount={roomInfo.reviewCount}
              />

              <button
                className={styles.deleteBtn}
                onClick={openDeleteModal}
              >
                Xóa loại phòng này
              </button>

              {/* Modal xác nhận xóa */}
              <Modal
                title="Xác nhận xóa"
                open={showDeleteModal}
                onOk={confirmDelete}
                onCancel={closeDeleteModal}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <p>Bạn có chắc chắn muốn xóa loại phòng <strong>{roomInfo.name}</strong> không?</p>
              </Modal>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
export default RoomDetail;