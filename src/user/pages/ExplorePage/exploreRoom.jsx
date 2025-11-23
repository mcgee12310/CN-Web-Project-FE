import React, { useState, useEffect } from "react";
import Header from "../../component/header/header";
import Footer from "../../component/footer/footer";
import Card2 from "../../component/roomCard/card2/card2";
import FilterSidebar from "../../component/filterSidebar/filterSidebar";
import styles from "./exploreRoom.module.css";
import DetailHeader from "../../component/roomDetail/DetailHeader/DetailHeader";
import roomService from "../../../services/user/room";
import { toast } from "react-toastify";

function ExploreRoom() {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const data = await roomService.getAllRoomType();
      setRooms(data);
    };
    fetchRooms();
  }, []);

  const handleSearch = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.warn("Vui lòng chọn ngày trước khi tìm kiếm");
      return;
    }

    try {
      const data = await roomService.getRoomAvailable(
        checkInDate,
        checkOutDate
      );

      if (data.length) {
        setRooms(data);
        setFilteredRooms(data);
      } else {
        toast.warn("Hiện tại không có phòng phù hợp");
      }
    } catch (error) {
      console.error("Lỗi tải phòng available:", error);
    }
  };

  const [filteredRooms, setFilteredRooms] = useState(rooms);
  useEffect(() => {
    setFilteredRooms(rooms);
  }, [rooms]);

  const handleFilterChange = (selectedTypes) => {
    const activeTypes = Object.keys(selectedTypes).filter(
      (type) => selectedTypes[type] === true
    );

    if (activeTypes.length === 0) {
      setFilteredRooms(rooms);
      return;
    }

    const result = rooms.filter((room) => activeTypes.includes(room.name));
    setFilteredRooms(result);
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <DetailHeader
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          onChangeCheckIn={setCheckInDate}
          onChangeCheckOut={setCheckOutDate}
          onSearch={handleSearch}
        />
        <div className={styles.content}>
          <aside className={styles.sidebarContainer}>
            <FilterSidebar rooms={rooms} onFilterChange={handleFilterChange} />
          </aside>
          <section className={styles.roomsContainer}>
            <Card2 rooms={filteredRooms} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
export default ExploreRoom;
