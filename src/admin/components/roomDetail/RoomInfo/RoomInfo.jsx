import React, { useState, useEffect } from "react";
import { IoPerson, IoPricetag } from "react-icons/io5";
import styles from "./RoomInfo.module.css";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import roomTypeService from "../../../../services/admin/roomType"; // <== chỉnh lại đường dẫn nếu khác

function RoomInfo({ roomData = {}, onSave = () => { } }) {
  const { id: roomTypeId } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    price: "",
    roomClass: "",
    description: ""
  });

  const [isDirty, setIsDirty] = useState(false);

  // Khi có data từ API -> fill vào form
  useEffect(() => {
    if (roomData) {
      setFormData({
        name: roomData.name || "",
        capacity: roomData.capacity || 0,
        price: roomData.price || 0,
        roomClass: roomData.roomClass || "",
        description: roomData.description || ""
      });

      setIsDirty(false);
    }
  }, [roomData]);

  const handleChange = (field, value) => {
    const updated = {
      ...formData,
      [field]: value
    };

    setFormData(updated);

    // so sánh với dữ liệu gốc để bật nút Lưu
    const changed = JSON.stringify(updated) !==
      JSON.stringify({
        name: roomData.name || "",
        capacity: roomData.capacity || 0,
        price: roomData.price || 0,
        roomClass: roomData.roomClass || "",
        description: roomData.description || ""
      });

    setIsDirty(changed);
  };

  const handleCancel = () => {
    setFormData({
      name: roomData.name || "",
      capacity: roomData.capacity || 0,
      price: roomData.price || 0,
      roomClass: roomData.roomClass || "",
      description: roomData.description || ""
    });

    setIsDirty(false);
  };

  // ✅ Call API UPDATE
  const handleSubmit = async () => {
    if (!isDirty) return;

    const payload = {
      name: formData.name,
      roomClass: formData.roomClass,
      description: formData.description,
      capacity: Number(formData.capacity),
      price: Number(formData.price)
    };

    try {
      await roomTypeService.updateRoomTypeInfo(roomTypeId, payload);

      onSave(payload);
      setIsDirty(false);

      console.log("✅ Updated:", payload);
      toast.success("Cập nhật thông tin phòng thành công!");
    } catch (err) {
      console.error("❌ Update failed:", err);
      toast.error("Cập nhật thông tin phòng thất bại!");
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
            onChange={(e) =>
              handleChange("roomClass", e.target.value)
            }
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

        <button className={styles.cancelBtn} onClick={handleCancel} type="button">
          Hủy
        </button>
      </div>

    </section>
  );
}

export default RoomInfo;
