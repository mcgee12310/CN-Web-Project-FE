import React, { useState, useEffect } from "react";
import styles from "./BookingSection.module.css";
import { IoPeople, IoCalendar } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../../auth/auth-context";
import roomService from "../../../../services/user/room";

function BookingSection({
  roomData,
  checkInDate: initialCheckInDate = "",
  checkOutDate: initialCheckOutDate = "",
  onDateChange,
}) {
  const [rooms, setRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const { user } = useAuth();

  const [selectedRooms, setSelectedRooms] = useState([]);
  const [checkInDate, setCheckInDate] = useState(initialCheckInDate);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOutDate);
  const [roomOccupancy, setRoomOccupancy] = useState({});
  const [bookingNote, setBookingNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  // 1. EFFECT: Chỉ lưu allRooms MỘT LẦN khi có dữ liệu lần đầu
  useEffect(() => {
    if (allRooms.length === 0 && roomData?.availableRooms?.length > 0) {
      setAllRooms(roomData.availableRooms);
    }
  }, [roomData, allRooms.length]);

  useEffect(() => {
    if (!checkInDate || !checkOutDate) {
      setRooms([]);
    }
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    if (allRooms.length > 0 && checkInDate && checkOutDate && roomData) {
      const availableIds = new Set(
        roomData.availableRooms
          ?.filter((r) => r.status === "AVAILABLE")
          .map((r) => r.id)
      );

      const roomsWithStatus = allRooms.map((room) => {
        const isAvailable = availableIds.has(room.id);
        return {
          ...room,
          status: isAvailable ? "available" : "unavailable",
        };
      });

      setRooms(roomsWithStatus);
    }
  }, [roomData, allRooms]);

  useEffect(() => {
    setCheckInDate(initialCheckInDate || "");
  }, [initialCheckInDate]);

  useEffect(() => {
    setCheckOutDate(initialCheckOutDate || "");
  }, [initialCheckOutDate]);

  useEffect(() => {
    setSelectedRooms([]);
    setRoomOccupancy({});
    setBookingNote("");
  }, [checkInDate, checkOutDate]);

  const handleCheckInChange = (value) => {
    setCheckInDate(value);

    if (value && checkOutDate && new Date(checkOutDate) <= new Date(value)) {
      setCheckOutDate("");
      return;
    }
    if (value && checkOutDate === "") return;
    if (onDateChange) onDateChange(value, checkOutDate);
  };

  const handleCheckOutChange = (value) => {
    setCheckOutDate(value);

    if (new Date(value) <= new Date(checkInDate)) {
      toast.warn("Ngày trả phòng phải sau ngày nhận phòng");
      return;
    }
    if (onDateChange) onDateChange(checkInDate, value);
  };

  const handleRoomClick = (roomId) => {
    const room = rooms.find((r) => r.id === roomId);
    // Chặn click nếu status là unavailable
    if (!room || room.status === "unavailable") return;

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
    return room.status;
  };

  const handleOccupancyChange = (roomId, rawValue) => {
    const val = rawValue.replace(/\D/g, "");
    if (parseInt(val) < 1) return;

    setRoomOccupancy((prev) => ({
      ...prev,
      [roomId]: val,
    }));
  };

  const handleBooking = async () => {
    // 1. Kiểm tra đăng nhập
    if (!user) {
      toast.warn("Bạn cần đăng nhập để có thể đặt phòng");
      return;
    }

    // 2. Kiểm tra ngày
    if (!checkInDate || !checkOutDate) {
      toast.warn("Vui lòng chọn ngày nhận phòng và trả phòng");
      return;
    }

    // 3. Kiểm tra đã chọn phòng chưa
    if (selectedRooms.length === 0) {
      toast.warn("Vui lòng chọn ít nhất một phòng");
      return;
    }

    // Lấy giới hạn người tối đa từ roomData
    const maxCapacity = roomData?.capacity;

    // 4. Kiểm tra hợp lệ cho từng phòng đã chọn
    for (const roomId of selectedRooms) {
      const raw = roomOccupancy[roomId];
      const occ = parseInt(raw, 10);

      // 4.1 Kiểm tra nhập số dương
      if (!occ || occ < 1) {
        const roomInfo = rooms.find((r) => r.id === roomId);
        const roomName = roomInfo?.number || roomInfo?.roomNumber || roomId;
        toast.warn(`Vui lòng nhập số lượng người (>= 1) cho phòng ${roomName}`);
        return;
      }

      // 4.2 Kiểm tra vượt quá sức chứa
      if (maxCapacity && occ > maxCapacity) {
        const roomInfo = rooms.find((r) => r.id === roomId);
        const roomName = roomInfo?.number || roomInfo?.roomNumber || roomId;
        toast.warn(
          `Phòng ${roomName} vượt quá số người cho phép (${maxCapacity} người)`
        );
        return;
      }
    }

    // 5. Gọi API đặt phòng
    try {
      setIsProcessing(true);

      const payload = {
        rooms: selectedRooms.map((roomId) => {
          return {
            roomId: roomId,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            numberOfGuests: parseInt(roomOccupancy[roomId], 10) || 1,
          };
        }),
        paymentMethod: "VNPAY",
        bookingNote: bookingNote,
      };

      console.log("Sending Payload:", payload);

      const response = await roomService.bookingRooms(payload);

      // 6. Chuẩn bị dữ liệu để chuyển sang trang booking
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

      // 7. Navigate sang trang booking với paymentUrl
      toast.info(
        "Chúng tôi đang giữ phòng cho bạn. Vui lòng thanh toán để hoàn tất!"
      );
      navigate("/booking/payment", {
        state: {
          checkInDate,
          checkOutDate,
          totalPeople,
          selectedRooms: selectedRoomDetails,
          roomType: roomData?.name ?? "Phòng",
          roomPrice: roomData?.price ?? "",
          new_price: response?.amount ?? "",
          heroImage: Array.isArray(roomData?.images) ? roomData.images[0] : "",
          paymentUrl: response?.paymentUrl || "",
          bookingNote: bookingNote,
          discount: response?.discount || 0,
        },
      });
    } catch (error) {
      console.error("Booking Error:", error);
      toast.error("Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại!");
    } finally {
      setIsProcessing(false);
    }
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
                      disabled={status === "unavailable"}
                      title={
                        status === "unavailable" ? "Phòng đã được đặt" : ""
                      }
                    >
                      {room.roomNumber}
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
                            Phòng {room?.number || room?.roomNumber || roomId}
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

                  {/* Ghi chú chung cho đơn đặt phòng */}
                  <div className={styles.bookingNoteCard}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Ghi chú đơn đặt phòng
                      </label>
                      <textarea
                        className={styles.noteInput}
                        placeholder="Ví dụ: Check-in muộn, cần phòng yên tĩnh..."
                        rows={3}
                        value={bookingNote}
                        onChange={(e) => setBookingNote(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={styles.roomSelectorPlaceholder}>
              Vui lòng chọn ngày để hiển thị danh sách phòng
            </div>
          )}
        </div>

        <button
          className={styles.bookButton}
          onClick={handleBooking}
          disabled={isProcessing}
        >
          {isProcessing ? "Đang xử lý..." : "Đặt phòng ngay"}
        </button>
      </div>
    </section>
  );
}

export default BookingSection;
