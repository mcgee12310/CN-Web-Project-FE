import React, { useState, useEffect } from "react";
import styles from "./BookingSection.module.css";
import { IoPeople, IoCalendar } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function BookingSection({
  roomData,
  roomsList,
  checkInDate: initialCheckInDate = "",
  checkOutDate: initialCheckOutDate = "",
}) {
  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [checkInDate, setCheckInDate] = useState(initialCheckInDate);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOutDate);

  // Lưu số người theo từng phòng: { 4: 2, 5: 3, ... }
  const [roomOccupancy, setRoomOccupancy] = useState({});

  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (roomsList && roomsList.length > 0) {
      setRooms(roomsList);
    } else {
      const defaultRooms = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        number: i + 1,
        status: [3, 7, 12, 15, 18].includes(i + 1) ? "booked" : "available",
      }));
      setRooms(defaultRooms);
    }
  }, [roomsList]);

  useEffect(() => {
    setCheckInDate(initialCheckInDate || "");
  }, [initialCheckInDate]);

  useEffect(() => {
    setCheckOutDate(initialCheckOutDate || "");
  }, [initialCheckOutDate]);

  useEffect(() => {
    setSelectedRooms([]);
    setRoomOccupancy({});
  }, [checkInDate, checkOutDate]);

  const handleCheckInChange = (value) => {
    setCheckInDate(value);

    if (
      value &&
      checkOutDate &&
      new Date(checkOutDate).getTime() <= new Date(value).getTime()
    ) {
      setCheckOutDate("");
    }
  };

  const handleCheckOutChange = (value) => {
    setCheckOutDate(value);
  };

  const handleRoomClick = (roomId) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room || room.status === "booked") {
      return;
    }

    if (selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter((r) => r !== roomId));
      setRoomOccupancy((prev) => {
        const copy = { ...prev };
        delete copy[roomId];
        return copy;
      });
    } else {
      setSelectedRooms([...selectedRooms, roomId]);
      setRoomOccupancy((prev) => ({
        ...prev,
        [roomId]: prev[roomId] ?? "1",
      }));
    }
  };

  const getRoomStatus = (room) => {
    if (room.status === "booked") return "booked";
    if (selectedRooms.includes(room.id)) return "selected";
    return "available";
  };

  const handleOccupancyChange = (roomId, rawValue) => {
    const val = rawValue.replace(/\D/g, "");
    setRoomOccupancy((prev) => ({
      ...prev,
      [roomId]: val,
    }));
  };

  const handleBooking = () => {
    if (!checkInDate || !checkOutDate) {
      toast.warn("Vui lòng chọn ngày nhận phòng và trả phòng");
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      toast.warn("Ngày trả phòng phải sau ngày nhận phòng");
      return;
    }

    if (selectedRooms.length === 0) {
      toast.warn("Vui lòng chọn ít nhất một phòng");
      return;
    }

    // kiểm tra từng phòng
    for (const roomId of selectedRooms) {
      const raw = roomOccupancy[roomId];
      const occ = parseInt(raw, 10);

      if (!occ || occ < 1) {
        toast.warn(`Vui lòng nhập số lượng người (>= 1) cho phòng ${roomId}`);
        return;
      }
    }

    const selectedRoomDetails = rooms
      .filter((room) => selectedRooms.includes(room.id))
      .map((room) => ({
        ...room,
        occupancy: parseInt(roomOccupancy[room.id], 10) || 1,
      }));

    const totalPeople = selectedRooms.reduce((sum, id) => {
      const occ = parseInt(roomOccupancy[id], 10) || 0;
      return sum + occ;
    }, 0);

    navigate("/booking", {
      state: {
        checkInDate,
        checkOutDate,
        totalPeople,
        selectedRooms: selectedRoomDetails,
        roomType: roomData?.name ?? "Phòng",
        price: roomData?.price ?? "",
        currency: roomData?.currency ?? "",
        heroImage: Array.isArray(roomData?.images) ? roomData.images[0] : "",
      },
    });
  };

  return (
    <section className={styles.bookingSection}>
      <div className={styles.bookingForm}>
        <div className={styles.formGroup}>
          <div className={styles.dateRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <IoCalendar className={styles.labelIcon} />
                Check-in
              </label>
              <input
                type="date"
                className={styles.input}
                value={checkInDate}
                onChange={(e) => handleCheckInChange(e.target.value)}
                min={today}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <IoCalendar className={styles.labelIcon} />
                Check-out
              </label>
              <input
                type="date"
                className={styles.input}
                value={checkOutDate}
                onChange={(e) => handleCheckOutChange(e.target.value)}
                min={checkInDate || today}
                disabled={!checkInDate}
              />
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <h3 className={styles.roomListTitle}>Danh sách phòng</h3>
          {checkInDate && checkOutDate ? (
            <>
              <div className={styles.roomSelector}>
                {rooms.map((room) => {
                  const status = getRoomStatus(room);
                  return (
                    <button
                      key={room.id}
                      className={`${styles.roomButton} ${
                        styles[
                          `roomButton${
                            status.charAt(0).toUpperCase() + status.slice(1)
                          }`
                        ]
                      }`}
                      onClick={() => handleRoomClick(room.id)}
                      disabled={status === "booked"}
                    >
                      {room.number || room.id}
                    </button>
                  );
                })}
              </div>

              {selectedRooms.length > 0 && (
                <div className={styles.guestsPerRoomWrapper}>
                  {selectedRooms.map((roomId) => {
                    const room = rooms.find((r) => r.id === roomId);
                    const occ = roomOccupancy[roomId] ?? "";
                    return (
                      <div key={roomId} className={styles.roomGuestCard}>
                        <div className={styles.formGroup}>
                          <h4 className={styles.roomListTitle}>
                            Phòng {room?.number ?? roomId}
                          </h4>
                          <div className={styles.dateRow}>
                            <div className={styles.formGroup}>
                              <label className={styles.label}>
                                <IoPeople className={styles.labelIcon} />
                                Số lượng người
                              </label>
                              <input
                                type="text"
                                className={styles.input}
                                value={occ}
                                onChange={(e) =>
                                  handleOccupancyChange(roomId, e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className={styles.roomSelectorPlaceholder}>
              Vui lòng chọn ngày để hiển thị danh sách phòng
            </div>
          )}
        </div>
        <button className={styles.bookButton} onClick={handleBooking}>
          Đặt phòng ngay
        </button>
      </div>
    </section>
  );
}

export default BookingSection;
