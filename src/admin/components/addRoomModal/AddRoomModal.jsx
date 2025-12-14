import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Select, message } from "antd";
import styles from "./AddRoomModal.module.css";
import { toast } from "react-toastify"
import roomTypeService from "../../../services/admin/roomType";
import roomService from "../../../services/admin/room";

const { Option } = Select;

const AddRoomModal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    roomNumber: "",
    roomTypeId: null,
    description: "",
    status: "AVAILABLE",
  });
  const [roomTypes, setRoomTypes] = useState([]);
  // ================== FETCH ROOM TYPE ==================
  useEffect(() => {
    if (!open) return;
    const fetchRoomTypes = async () => {
      try {
        const res = await roomTypeService.getAllRoomType();
        setRoomTypes(res.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải danh sách loại phòng");
      }
    };
    fetchRoomTypes();
  }, [open]);
  // ================== HANDLE CHANGE ==================
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  // ================== SUBMIT ==================
  const handleSubmit = async () => {
    const { roomNumber, roomTypeId } = form;
    if (!roomNumber || !roomTypeId) {
      toast.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      await roomService.addRoom({
        roomNumber: form.roomNumber,
        roomTypeId: form.roomTypeId,
        description: form.description,
        status: form.status,
      });

      toast.success("Thêm phòng thành công!");
      onSuccess?.();
      onClose();

      // reset form
      setForm({
        roomNumber: "",
        roomTypeId: null,
        description: "",
        status: "AVAILABLE",
      });
    } catch (error) {
      console.error(error);
      toast.error("Thêm phòng thất bại!");
    }
  };

  return (
    <Modal
      title="Thêm phòng mới"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Thêm"
      cancelText="Hủy"
      width={600}
    >
      {/* SỐ PHÒNG */}
      <div className={styles.formRow}>
        <label>Số phòng *</label>
        <Input
          value={form.roomNumber}
          onChange={(e) => handleChange("roomNumber", e.target.value)}
          placeholder="Ví dụ: A101"
        />
      </div>

      {/* LOẠI PHÒNG */}
      <div className={styles.formRow}>
        <label>Loại phòng *</label>
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn loại phòng"
          value={form.roomTypeId}
          onChange={(value) => handleChange("roomTypeId", value)}
        >
          {roomTypes.map((rt) => (
            <Option key={rt.id} value={rt.id}>
              {rt.name}
            </Option>
          ))}
        </Select>
      </div>
      {/* MÔ TẢ */}
      <div className={styles.formRow}>
        <label>Mô tả</label>
        <Input.TextArea
          rows={3}
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      {/* TRẠNG THÁI */}
      <div className={styles.formRow}>
        <label>Trạng thái</label>
        <Select
          style={{ width: "100%" }}
          value={form.status}
          onChange={(value) => handleChange("status", value)}
        >
          <Option value="AVAILABLE">Khả dụng</Option>
          <Option value="MAINTENANCE">Bảo trì</Option>
        </Select>
      </div>
    </Modal>
  );
};
export default AddRoomModal;
