import React, { useState, useEffect } from "react";
import styles from "./BookingSection.module.css";
import { IoPeople, IoCalendar } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function BookingSection({
  roomData,
  roomsList,
  checkInDate: initialCheckInDate = "",
  checkOutDate: initialCheckOutDate = "",
}) {
  // Nếu có roomsList từ API, sử dụng nó; nếu không, sử dụng danh sách mặc định
  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [checkInDate, setCheckInDate] = useState(initialCheckInDate);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOutDate);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (roomsList && roomsList.length > 0) {
      // Nếu có dữ liệu từ API, sử dụng nó
      setRooms(roomsList);
    } else {
      // Mặc định: tạo 20 phòng (phòng 3, 7, 12, 15, 18 là đã đặt)
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

    // Toggle selection
    if (selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter((r) => r !== roomId));
    } else {
      setSelectedRooms([...selectedRooms, roomId]);
    }
  };

  const getRoomStatus = (room) => {
    if (room.status === "booked") {
      return "booked"; // Đã đặt
    }
    if (selectedRooms.includes(room.id)) {
      return "selected"; // Đang chọn
    }
    return "available"; // Trống
  };

  const handleBooking = () => {
    if (!checkInDate || !checkOutDate) {
      alert("Vui lòng chọn ngày nhận phòng và trả phòng");
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      alert("Ngày trả phòng phải sau ngày nhận phòng");
      return;
    }

    if (selectedRooms.length === 0) {
      alert("Vui lòng chọn ít nhất một phòng");
      return;
    }

    const normalizedAdults =
      adults === ""
        ? 0
        : typeof adults === "number"
        ? adults
        : parseInt(adults, 10) || 0;
    const normalizedChildren =
      children === ""
        ? 0
        : typeof children === "number"
        ? children
        : parseInt(children, 10) || 0;

    const selectedRoomDetails = rooms.filter((room) =>
      selectedRooms.includes(room.id)
    );

    navigate("/booking", {
      state: {
        checkInDate,
        checkOutDate,
        adults: normalizedAdults,
        children: normalizedChildren,
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
          <h3 className={styles.roomListTitle}>Thời gian lưu trú</h3>
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
          ) : (
            <div className={styles.roomSelectorPlaceholder}>
              Vui lòng chọn ngày để hiển thị danh sách phòng
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <IoPeople className={styles.labelIcon} />
            Số lượng người lớn
          </label>
          <input
            type="text"
            className={styles.input}
            value={adults}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setAdults(val === "" ? "" : Math.max(1, parseInt(val)));
            }}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <IoPeople className={styles.labelIcon} />
            Số lượng trẻ em
          </label>
          <input
            type="text"
            className={styles.input}
            value={children}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setChildren(val === "" ? "" : Math.max(0, parseInt(val)));
            }}
          />
        </div>

        <button className={styles.bookButton} onClick={handleBooking}>
          Đặt phòng ngay
        </button>
      </div>
    </section>
  );
}

export default BookingSection;
