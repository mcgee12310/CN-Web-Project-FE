import React, { useState } from "react";
import { Modal, Input, InputNumber, Select, Button } from "antd";
import styles from "./AddRoomTypeModal.module.css";
import { toast } from "react-toastify";
import roomTypeService from "../../../services/admin/roomType";

const AddRoomTypeModal = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    roomClass: "",
    description: "",
    capacity: 0,
    price: 0
  });

  const handleSubmit = async () => {
    try {
      if (
        !form.name ||
        !form.roomClass ||
        !form.description ||
        !form.capacity ||
        !form.price
      ) {
        toast.warning("Vui lòng điền đầy đủ thông tin!");
        return;
      }

      await roomTypeService.addNewRoomType(form);
      toast.success("Thêm loại phòng thành công!");

      onSave && onSave();
      onClose();

      setForm({
        name: "",
        roomClass: "",
        description: "",
        capacity: 0,
        price: 0
      });

    } catch (error) {
      toast.error("Thêm loại phòng thất bại!");
      console.error(error);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      className={styles.modal}
    >
      <div className={styles.container}>
        <h2 className={styles.title}>Thêm loại phòng mới</h2>

        <div className={styles.section}>
          <p className={styles.label}>Tên phòng</p>
          <Input
            className={styles.input}
            placeholder="Nhập tên phòng ..."
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className={styles.section}>
          <p className={styles.label}>Hạng phòng</p>
          <select
            className={styles.input}
            value={form.roomClass}
            onChange={(e) =>
              setForm({ ...form, roomClass: e.target.value })
            }
          >
            <option value="">-- Chọn hạng phòng --</option>
            <option value="STANDARD">STANDARD</option>
            <option value="SUPERIOR">SUPERIOR</option>
            <option value="BUSINESS">BUSINESS</option>
            <option value="SUITE">SUITE</option>
          </select>

        </div>

        <div className={styles.section}>
          <p className={styles.label}>Sức chứa</p>
          <InputNumber
            className={styles.input}
            placeholder="Nhập sức chứa..."
            min={1}
            onChange={(value) => setForm({ ...form, capacity: value })}
          />
        </div>

        <div className={styles.section}>
          <p className={styles.label}>Mô tả</p>
          <Input.TextArea
            className={styles.input}
            placeholder="Nhập mô tả ..."
            value={form.description}
            rows={3}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className={styles.section}>
          <p className={styles.label}>Giá mặc định</p>
          <InputNumber
            className={styles.input}
            placeholder="Nhập giá mặc định ..."
            min={0}
            onChange={(value) => setForm({ ...form, price: value })}
          />
        </div>

        <Button
          type="primary"
          className={styles.saveButton}
          onClick={handleSubmit}
          block
        >
          Lưu
        </Button>
      </div>
    </Modal>
  );
};

export default AddRoomTypeModal;
