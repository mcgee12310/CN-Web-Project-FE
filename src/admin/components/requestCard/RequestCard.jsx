import React, { useState } from "react";
import { Table, Input, Button, Modal } from "antd";
import styles from "./RequestCard.module.css";
import { formatDate, formatStatus } from "../../../utils/format";
import AddGuestModal from "../addGuestModal/AddGuestModal";
import { toast } from "react-toastify";
import bookingService from "../../../services/admin/booking";

const RequestCard = ({ request, note, onUpdate }) => {
  const [formData, setFormData] = useState(request);
  // const [bookingnote, setNote] = useState(note);
  const [openAdd, setOpenAdd] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleCheckInSuccess = (newGuests) => {
    const updated = {
      ...formData,
      guestList: newGuests,
      status: "CHECKED_IN",
    };
    setFormData(updated);
    onUpdate?.(updated);
  };

  const openCheckout = () => setShowCheckoutModal(true);
  const closeCheckout = () => setShowCheckoutModal(false);

  const confirmCheckout = async () => {
    try {
      await bookingService.checkOutRequest(request.id);
      const updated = { ...formData, status: "CHECKED_OUT" };
      setFormData(updated);
      onUpdate?.(updated);
      toast.success("Check-out thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Check-out thất bại!");
    } finally {
      closeCheckout();
    }
  };

  const columns = [
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    { title: "Loại giấy tờ", dataIndex: "identityType", key: "identityType" },
    { title: "Số định danh", dataIndex: "identityNumber", key: "identityNumber" },
    {
      title: "Ngày cấp",
      dataIndex: "identityIssuedDate",
      key: "identityIssuedDate",
      render: (date) => formatDate(date),
    },
    { title: "Nơi cấp", dataIndex: "identityIssuedPlace", key: "identityIssuedPlace" },
  ];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>Mã đơn: {request.id}</h3>
      </div>

      <div className={styles.container}>
        <div className={styles.leftForm}>
          <div className={styles.formItem}>
            <label>Phòng</label>
            <Input value={formData.roomNumber} readOnly className={styles.readonlyInput} />
          </div>
          <div className={styles.formItem}>
            <label>Số người</label>
            <Input value={formData.guests} readOnly className={styles.readonlyInput} />
          </div>
          <div className={styles.formItem}>
            <label>Ngày nhận phòng</label>
            <Input value={formatDate(formData.checkIn)} readOnly className={styles.readonlyInput} />
          </div>
          <div className={styles.formItem}>
            <label>Ngày trả phòng</label>
            <Input value={formatDate(formData.checkOut)} readOnly className={styles.readonlyInput} />
          </div>
          <div className={styles.noteBox}>
            <label>Ghi chú</label>
            <Input.TextArea
              rows={3}
              value={note}
              readOnly
              style={{ resize: "none", overflowY: "auto" }}
            />
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.statusRow}>
            <span className={styles.statusLabel}>Trạng thái:</span>
            <div>{formatStatus(formData.status)}</div>
          </div>

          <div className={styles.guestSection}>
            <h4>Khách nhận phòng</h4>
            {formData.guestList && formData.guestList.length > 0 ? (
              <Table
                columns={columns}
                dataSource={formData.guestList}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                scroll={{ y: 400 }}
              />
            ) : (
              <div className={styles.noGuest}>Khách chưa nhận phòng.</div>
            )}

            <div className={styles.actionRow}>
              <Button
                block
                className={styles.addGuestBtn}
                disabled={formData.status !== "PAYMENT_COMPLETED"}
                onClick={() => setOpenAdd(true)}
              >
                Check in
              </Button>

              <Button
                block
                className={styles.checkoutBtn}
                disabled={formData.status !== "CHECKED_IN"}
                onClick={openCheckout}
              >
                Check out
              </Button>
            </div>

            <AddGuestModal
              open={openAdd}
              requestId={request.id}
              onClose={() => setOpenAdd(false)}
              onSuccess={handleCheckInSuccess}
            />
          </div>
        </div>
      </div>

      {/* Modal Check-out */}
      <Modal
        title="Xác nhận check-out"
        open={showCheckoutModal}
        onOk={confirmCheckout}
        onCancel={closeCheckout}
        okText="Check out"
        cancelText="Đóng"
        okButtonProps={{ danger: true }}
      >
        <p>
          Bạn có chắc chắn muốn check-out phòng <strong>{formData.roomNumber}</strong> không?
        </p>
      </Modal>
    </div>
  );
};

export default RequestCard;
