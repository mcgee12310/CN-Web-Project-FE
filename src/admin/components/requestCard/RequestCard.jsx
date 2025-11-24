import React, { useState } from "react";
import { Table, Input, Button, Tag } from "antd";
import styles from "./RequestCard.module.css";
import { formatDate } from "../../../utils/format";

import AddGuestModal from "../addGuestModal/AddGuestModal";

const RequestCard = ({ request, onUpdate }) => {
  const [formData, setFormData] = useState(request);
  const [openAdd, setOpenAdd] = useState(false);

  const handleCheckout = () => {
    const updated = { ...formData, status: "CHECKOUT" };
    setFormData(updated);

    if (onUpdate) onUpdate(updated);

    alert("checkout");
  };

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "guestName",
      key: "guestName",
    },
    {
      title: "Loại giấy tờ",
      dataIndex: "identityType",
      key: "identityType",
    },
    {
      title: "Số định danh",
      dataIndex: "identityNumber",
      key: "identityNumber",
    },
    {
      title: "Ngày cấp",
      dataIndex: "identityIssueDate",
      key: "identityIssueDate",
      render: (identityIssueDate) => <div>{formatDate(identityIssueDate)}</div>,
    },
    {
      title: "Nơi cấp",
      dataIndex: "identityIssuePlace",
      key: "identityIssuePlace",
    },
  ];

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <h3>Mã đơn: {request.id}</h3>
      </div>

      {/* 2 columns layout */}
      <div className={styles.container}>
        {/* ----- LEFT FORM ----- */}
        <div className={styles.leftForm}>
          <div className={styles.formItem}>
            <label>Phòng</label>
            <Input
              value={formData.roomNumber}
              className={styles.readonlyInput}
              readonlye="true"
            />
          </div>

          <div className={styles.formItem}>
            <label>Số người</label>
            <Input
              value={formData.totalPeople}
              className={styles.readonlyInput}
              readonlye="true"
            />
          </div>

          <div className={styles.formItem}>
            <label>Loại phòng</label>
            <Input
              value={formData.roomType}
              className={styles.readonlyInput}
              readonlye="true"
            />
          </div>

          <div className={styles.formItem}>
            <label>Tổng tiền</label>
            <Input
              value={formData.price}
              className={styles.readonlyInput}
              readonlye="true"

            />
          </div>

          <div className={styles.formItem}>
            <label>Ngày nhận phòng</label>
            <Input
              value={formatDate(formData.checkIn)}
              className={styles.readonlyInput}
              readonlye="true"
            />
          </div>

          <div className={styles.formItem}>
            <label>Ngày trả phòng</label>
            <Input
              value={formatDate(formData.checkOut)}
              className={styles.readonlyInput}
              readonlye="true"
            />
          </div>

          <div className={styles.noteBox}>
            <label>Ghi chú</label>
            <Input.TextArea
              rows={3}
              value={formData.note}
              className={styles.readonlyInput}
              readonlye="true"
            />
          </div>
        </div>

        {/* ----- RIGHT PANEL ----- */}
        <div className={styles.rightPanel}>
          <div className={styles.statusRow}>
            <span className={styles.statusLabel}>Trạng thái:</span>

            {/* Tag trạng thái */}
            <Tag
              color={
                request.status === "CHECKIN"
                  ? "green"
                  : request.status === "PENDING"
                    ? "orange"
                    : request.status === "CANCELED"
                      ? "red"
                      : "blue"
              }
              className={styles.statusTag}
            >
              {request.status.toUpperCase()}
            </Tag>

            {/* Nút checkout chỉ hiển thị khi checked_in */}
            {request.status === "CHECKIN" && (
              <Button
                type="primary"
                onClick={handleCheckout}
                className={styles.checkoutBtn}
              >
                Trả phòng
              </Button>
            )}
          </div>

          <div className={styles.guestSection}>
            <h4>Khách nhận phòng</h4>

            {formData.guests && formData.guests.length > 0 ? (
              <Table
                columns={columns}
                dataSource={formData.guests}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                scroll={{ y: 400 }}
                style={{ tableLayout: "fixed" }}
              />
            ) : (
              <div className={styles.noGuest}>Khách chưa nhận phòng.</div>
            )}

            <Button
              type="dashed"
              block
              className={styles.addGuestBtn}
              onClick={() => setOpenAdd(true)}
            >
              Check in
            </Button>

            <AddGuestModal
              open={openAdd}
              onClose={() => setOpenAdd(false)}
              onSave={(guest) => {
                const updated = {
                  ...formData,
                  guests: [...formData.guests, { id: Date.now(), ...guest }],
                };
                setFormData(updated);
                onUpdate(updated);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
