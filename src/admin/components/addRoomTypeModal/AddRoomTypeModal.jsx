import React, { useState, useEffect } from "react";
import { Modal, Input, InputNumber, Select } from "antd";
import { toast } from "react-toastify";
import styles from "./AddRoomTypeModal.module.css";
import roomTypeService from "../../../services/admin/roomType";

const { TextArea } = Input;

const AddRoomTypeModal = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    roomClass: "",
    description: "",
    capacity: 1,
    price: 0,
  });

  useEffect(() => {
    if (open) {
      // reset form khi mở modal
      setForm({
        name: "",
        roomClass: "",
        description: "",
        capacity: 1,
        price: 0,
      });
    }
  }, [open]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      if (!form.name || !form.roomClass || !form.description) {
        toast.warning("Vui lòng điền đầy đủ thông tin!");
        return;
      }

      await roomTypeService.addNewRoomType(form);
      toast.success("Thêm loại phòng thành công!");
      onSave && onSave();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <Modal
      title="Thêm loại phòng mới"
      open={open}
      onOk={handleSave}
      onCancel={onClose}
      okText="Tạo mới"
      cancelText="Hủy"
      width={600}
    >
      <div className={styles.modalForm}>
        <div className={styles.formGroup}>
          <label>Tên phòng *</label>
          <Input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Nhập tên phòng"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Hạng phòng *</label>
          <Select
            value={form.roomClass}
            onChange={(value) => handleChange("roomClass", value)}
            placeholder="Chọn hạng phòng"
            style={{ width: "100%" }}
          >
            <Select.Option value="STANDARD">STANDARD</Select.Option>
            <Select.Option value="SUPERIOR">SUPERIOR</Select.Option>
            <Select.Option value="BUSINESS">BUSINESS</Select.Option>
            <Select.Option value="SUITE">SUITE</Select.Option>
          </Select>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Sức chứa *</label>
            <InputNumber
              value={form.capacity}
              onChange={(value) => handleChange("capacity", value)}
              min={1}
              style={{ width: "100%" }}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Giá mặc định *</label>
            <InputNumber
              value={form.price}
              onChange={(value) => handleChange("price", value)}
              min={0}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Mô tả *</label>
          <TextArea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
            placeholder="Nhập mô tả phòng"
          />
        </div>
      </div>
    </Modal>
  );
};
export default AddRoomTypeModal;