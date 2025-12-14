import React, { useState, useEffect } from "react";
import styles from "./RoomInfo.module.css";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  HomeOutlined,
  ApartmentOutlined,
  InfoCircleOutlined,
  SyncOutlined
} from "@ant-design/icons";
import roomService from "../../../services/admin/room";
import roomTypeService from "../../../services/admin/roomType";
import { Select } from "antd";
const { Option } = Select;
function RoomInfo({ roomData = {}, onSave = () => { } }) {
  const { id: roomId } = useParams();
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomTypeId: null,
    description: "",
    status: "",
  });
  const [roomTypes, setRoomTypes] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  useEffect(() => {
    if (roomData) {
      setFormData({
        roomNumber: roomData.roomNumber || "",
        roomTypeId: roomData.roomTypeId || null,
        description: roomData.description || "",
        status: roomData.status || "",
      });
      setIsDirty(false);
    }
    fetchRoomTypes();
  }, [roomData]);
  const fetchRoomTypes = async () => {
    try {
      const res = await roomTypeService.getAllRoomType();
      setRoomTypes(res.data || []);
    } catch (err) {
      toast.error("Không lấy được danh sách room type");
    }
  };
  const getInitialData = () => ({
    roomNumber: roomData.roomNumber || "",
    roomTypeId: roomData.roomTypeId || null,
    description: roomData.description || "",
    status: roomData.status || "",
  });
  const handleChange = (field, value) => {
    const updated = {
      ...formData,
      [field]: value,
    };
    setFormData(updated);
    const changed = JSON.stringify(updated) !== JSON.stringify(getInitialData());
    setIsDirty(changed);
  };
  const handleCancel = () => {
    setFormData(getInitialData());
    setIsDirty(false);
  };
  // ✅ Call API UPDATE ROOM
  const handleSubmit = async () => {
    if (!isDirty) return;
    const payload = {
      roomNumber: formData.roomNumber,
      description: formData.description,
      status: formData.status,
      roomTypeId: formData.roomTypeId,
    };
    try {
      await roomService.updateRoom(roomId, payload);
      onSave(payload);
      setIsDirty(false);
      toast.success("Cập nhật thông tin phòng thành công!");
    } catch (err) {
      console.error("❌ Update failed:", err);
      toast.error("Cập nhật thông tin phòng thất bại!");
    }
  };
  return (
    <section className={styles.roomInfo}>
      <div className={styles.form}>
        {/* Số / tên phòng */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Số phòng</label>
          <div className={styles.inputWrapper}>
            <HomeOutlined className={styles.priceIcon} />
            <input
              type="text"
              className={styles.input}
              value={formData.roomNumber}
              onChange={(e) => handleChange("roomNumber", e.target.value)}
            />
          </div>
        </div>
        {/* ✅ Loại phòng (Select + API) */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Loại phòng</label>
          <div className={styles.inputWrapper}>
            <ApartmentOutlined className={styles.priceIcon} />
            <Select
              style={{ flex: 1 }}
              value={formData.roomTypeId}
              placeholder="Chọn loại phòng"
              onChange={(value) => handleChange("roomTypeId", value)}
            >
              {roomTypes.map((type) => (
                <Option key={type.id} value={type.id}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        {/* ✅ Trạng thái (Select giống RoomType) */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Trạng thái</label>
          <div className={styles.inputWrapper}>
            <SyncOutlined className={styles.priceIcon} />
            <Select
              style={{ flex: 1 }}
              value={formData.status}
              placeholder="Chọn trạng thái"
              onChange={(value) => handleChange("status", value)}
            >
              <Option value="AVAILABLE">Khả dụng</Option>
              <Option value="MAINTENANCE">Bảo trì</Option>
            </Select>
          </div>
        </div>
        {/* Mô tả */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Mô tả</label>
          <div className={styles.inputWrapper}>
            <InfoCircleOutlined className={styles.priceIcon} />
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
