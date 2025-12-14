import React, { useState, useEffect } from "react";
import { IoPerson, IoPricetag } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import roomTypeService from "../../../../services/admin/roomType";
import styles from "./RoomInfo.module.css";

function RoomInfo({ roomData = {}, amenities = [], allAmenities = [], onSave = () => {} }) {
  const { id: roomTypeId } = useParams();

  // State cho thông tin phòng
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    price: "",
    roomClass: "",
    description: ""
  });

  // State cho tiện nghi
  const safeAmenities = Array.isArray(amenities) ? amenities : [];
  const [selectedAmenities, setSelectedAmenities] = useState(
    safeAmenities.map((a) => (typeof a === "string" ? a : a.name))
  );

  const [isDirty, setIsDirty] = useState(false);

  // Khởi tạo dữ liệu ban đầu
  useEffect(() => {
    if (roomData) {
      setFormData({
        name: roomData.name || "",
        capacity: roomData.capacity || 0,
        price: roomData.price || 0,
        roomClass: roomData.roomClass || "",
        description: roomData.description || ""
      });
    }

    setSelectedAmenities(
      safeAmenities.map((a) => (typeof a === "string" ? a : a.name))
    );

    setIsDirty(false);
  }, [roomData, amenities]);

  // Xử lý thay đổi thông tin phòng
  const handleChange = (field, value) => {
    const updated = {
      ...formData,
      [field]: value
    };

    setFormData(updated);
    setIsDirty(true);
  };

  // Xử lý toggle tiện nghi
  const handleToggleAmenity = (amenityName) => {
    let updated;

    if (selectedAmenities.includes(amenityName)) {
      updated = selectedAmenities.filter((a) => a !== amenityName);
    } else {
      updated = [...selectedAmenities, amenityName];
    }

    setSelectedAmenities(updated);
    setIsDirty(true);
  };

  // Reset về trạng thái ban đầu
  const handleCancel = () => {
    setFormData({
      name: roomData.name || "",
      capacity: roomData.capacity || 0,
      price: roomData.price || 0,
      roomClass: roomData.roomClass || "",
      description: roomData.description || ""
    });

    setSelectedAmenities(
      safeAmenities.map((a) => (typeof a === "string" ? a : a.name))
    );

    setIsDirty(false);
  };

  // Gửi cả 2 request cùng lúc
  const handleSubmit = async () => {
    if (!isDirty) return;

    // Lấy amenityIds từ selectedAmenities (dựa vào name)
    const amenityIds = allAmenities
      .filter(am => selectedAmenities.includes(am.name))
      .map(am => am.id);

    // Payload gộp chung
    const payload = {
      name: formData.name,
      roomClass: formData.roomClass,
      description: formData.description,
      capacity: Number(formData.capacity),
      price: Number(formData.price),
      amenityIds: amenityIds
    };

    try {
      await roomTypeService.updateRoomTypeInfo(roomTypeId, payload);
      onSave(payload);
      setIsDirty(false);

      console.log("✅ Updated:", payload);
      toast.success("Cập nhật thông tin phòng và tiện nghi thành công!");
    } catch (err) {
      console.error("❌ Update failed:", err);
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <section className={styles.roomInfo}>
      {/* ----- TITLE ----- */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h2 className={styles.title}>Chỉnh sửa thông tin phòng</h2>
        </div>
      </div>

      {/* ----- FORM ----- */}
      <div className={styles.form}>
        {/* Tên phòng */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Tên phòng</label>
          <div className={styles.priceInputWrapper}>
            <input
              type="text"
              className={styles.input}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
        </div>

        {/* Hạng phòng */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Hạng phòng</label>
          <select
            className={styles.input}
            value={formData.roomClass}
            onChange={(e) => handleChange("roomClass", e.target.value)}
          >
            <option value="">-- Chọn hạng phòng --</option>
            <option value="STANDARD">STANDARD</option>
            <option value="SUPERIOR">SUPERIOR</option>
            <option value="BUSINESS">BUSINESS</option>
            <option value="SUITE">SUITE</option>
          </select>
        </div>
        {/* Sức chứa */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Sức chứa</label>
          <div className={styles.priceInputWrapper}>
            <IoPerson className={styles.priceIcon} />
            <input
              type="number"
              className={styles.input}
              value={formData.capacity}
              onChange={(e) => handleChange("capacity", e.target.value)}
            />
          </div>
        </div>
        {/* Giá phòng */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Giá phòng</label>
          <div className={styles.priceInputWrapper}>
            <IoPricetag className={styles.priceIcon} />
            <input
              type="number"
              className={styles.input}
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
          </div>
        </div>
        {/* Mô tả */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Mô tả</label>
          <div className={styles.priceInputWrapper}>
            <textarea
              className={styles.textarea}
              rows="4"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
        </div>

        {/* ========== TIỆN NGHI - STYLED AS FORM FIELD ========== */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Tiện nghi</label>
          <div className={styles.amenitiesWrapper}>
            {allAmenities.map((am) => (
              <label key={am.id} className={styles.amenityItem}>
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(am.name)}
                  onChange={() => handleToggleAmenity(am.name)}
                  className={styles.amenityCheckbox}
                />
                <span className={styles.amenityText}>{am.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      {/* ----- ACTION BUTTONS ----- */}
      <div className={styles.actions}>
        <button
          className={styles.saveBtn}
          disabled={!isDirty}
          onClick={handleSubmit}
          type="button"
        >
          Lưu
        </button>

        <button
          className={styles.cancelBtn}
          onClick={handleCancel}
          type="button"
        >
          Hủy
        </button>
      </div>
    </section>
  );
}

export default RoomInfo;