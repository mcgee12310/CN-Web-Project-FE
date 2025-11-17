import React, { useState } from "react";
import { Modal, Input, DatePicker, Button, Select } from "antd";
import styles from "./AddGuestModal.module.css";

const AddGuestModal = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState({
    guestName: "",
    identityType: "",
    identityNumber: "",
    identityIssueDate: "",
    identityIssuePlace: "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
      className={styles.modal}
    >
      <h2 className={styles.title}>Khách nhận phòng</h2>

      <div className={styles.formRow}>
        <label>Họ tên</label>
        <Input
          value={form.guestName}
          onChange={(e) => handleChange("guestName", e.target.value)}
        />
      </div>

      <div className={styles.formRow}>
        <label>Loại giấy tờ</label>
        <Select
          options={[
            { value: 'CCCD', label: <span>CCCD</span> },
            { value: 'PASSPORT', label: <span>Hộ chiếu</span> },
          ]}
          value={form.identityType}
          onChange={(value) => handleChange("identityType", value)}
        />
      </div>

      <div className={styles.formRow}>
        <label>Số định danh</label>
        <Input
          value={form.identityNumber}
          onChange={(e) => handleChange("identityNumber", e.target.value)}
        />
      </div>

      <div className={styles.formRow}>
        <label>Ngày cấp</label>
        <DatePicker
          style={{ width: "100%" }}
          format="DD/MM/YYYY"
          onChange={(date, str) => handleChange("identityIssueDate", str)}
        />
      </div>

      <div className={styles.formRow}>
        <label>Nơi cấp</label>
        <Input
          value={form.identityIssuePlace}
          onChange={(e) =>
            handleChange("identityIssuePlace", e.target.value)
          }
        />
      </div>

      <div className={styles.footer}>
        <Button type="primary" className={styles.saveBtn} onClick={handleSubmit}>
          Thêm
        </Button>

        <Button className={styles.cancelBtn} onClick={onClose}>
          Hủy
        </Button>
      </div>
    </Modal>
  );
};

export default AddGuestModal;
