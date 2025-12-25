import React, { useState } from "react";
import {
  Modal,
  Input,
  DatePicker,
  Button,
  Select,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "./AddGuestModal.module.css";
import { toast } from "react-toastify";
import bookingService from "../../../services/admin/booking";

const emptyGuest = {
  fullName: "",
  identityType: "",
  identityNumber: "",
  identityIssuedDate: "",
  identityIssuedPlace: "",
};

const AddGuestModal = ({ open, onClose, requestId, guestsNumber, onSuccess }) => {
  const [guests, setGuests] = useState([{ ...emptyGuest }]);
  const handleChange = (index, key, value) => {
    const newGuests = [...guests];
    newGuests[index][key] = value;
    setGuests(newGuests);
  };

  const addGuest = () => {
    if (guests.length >= guestsNumber) {
      toast.warning(`Số lượng khách tối đa là ${guestsNumber}`);
      return;
    }
    setGuests([...guests, { ...emptyGuest }]);
  };

  const removeGuest = (index) => {
    if (guests.length === 1) return;
    setGuests(guests.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // validate all guests
    for (let i = 0; i < guests.length; i++) {
      const g = guests[i];
      if (
        !g.fullName ||
        !g.identityType ||
        !g.identityNumber ||
        !g.identityIssuedDate ||
        !g.identityIssuedPlace
      ) {
        toast.warning(`Vui lòng điền đầy đủ thông tin khách #${i + 1}`);
        return;
      }
    }

    const payload = {
      requestId,
      guests,
    };

    console.log(payload);

    try {
      await bookingService.checkInRequest(payload);
      toast.success("Check-in thành công");
      onClose();
      onSuccess?.(guests); // Pass guests array to parent
      setGuests([{ ...emptyGuest }]); // Reset form
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.error ||       // ✅ đúng theo BE trả về
        error?.response?.data?.message ||     // fallback nếu BE đổi key
        "Check-in thất bại";
      toast.error(msg);
    }
  };

  const handleClose = () => {
    setGuests([{ ...emptyGuest }]); // Reset form on close
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={1000}
      className={styles.modal}
    >
      <h2 className={styles.title}>Danh sách khách nhận phòng</h2>
      {guests.map((guest, index) => (
        <div key={index} className={styles.guestCard}>
          <div className={styles.guestHeader}>
            <span>Khách #{index + 1}</span>
            {guests.length > 1 && (
              <DeleteOutlined
                className={styles.deleteIcon}
                onClick={() => removeGuest(index)}
              />
            )}
          </div>

          <div className={styles.formContainer}>
            <div className={styles.formRow}>
              <label>Họ tên</label>
              <Input
                value={guest.fullName}
                onChange={(e) =>
                  handleChange(index, "fullName", e.target.value)
                }
              />
            </div>

            <div className={styles.formRow}>
              <label>Loại giấy tờ</label>
              <Select
                value={guest.identityType}
                onChange={(value) =>
                  handleChange(index, "identityType", value)
                }
                options={[
                  { value: "CCCD", label: "CCCD" },
                  { value: "PASSPORT", label: "Hộ chiếu" },
                ]}
              />
            </div>

            <div className={styles.formRow}>
              <label>Số định danh</label>
              <Input
                value={guest.identityNumber}
                onChange={(e) =>
                  handleChange(index, "identityNumber", e.target.value)
                }
              />
            </div>
          
            <div className={styles.formRow}>
              <label>Ngày cấp</label>
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                onChange={(date) =>
                  handleChange(
                    index,
                    "identityIssuedDate",
                    date ? date.format("YYYY-MM-DD") : ""
                  )
                }
              />
            </div>

            <div className={styles.formRow}>
              <label>Nơi cấp</label>
              <Input
                value={guest.identityIssuedPlace}
                onChange={(e) =>
                  handleChange(
                    index,
                    "identityIssuedPlace",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        type="dashed"
        block
        icon={<PlusOutlined />}
        onClick={addGuest}
        disabled={guests.length >= guestsNumber}
        style={{ marginBottom: 16 }}
      >
        Thêm khách {guests.length >= guestsNumber && `(Đã đạt giới hạn ${guestsNumber})`}
      </Button>

      <div className={styles.footer}>
        <Button type="primary" onClick={handleSubmit}>
          Check-in
        </Button>
        <Button onClick={handleClose}>Hủy</Button>
      </div>
    </Modal>
  );
};

export default AddGuestModal;
