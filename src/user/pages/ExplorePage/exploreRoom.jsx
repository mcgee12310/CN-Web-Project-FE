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

  const [allRooms, setAllRooms] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await roomService.getAllRoomType();
        setAllRooms(data);
        setRooms(data);
        setFilteredRooms(data);
      } catch (error) {
        console.error("Lỗi tải danh sách phòng:", error);
      }
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

      if (data.length > 0) {
        setRooms(data);
        setFilteredRooms(data);
      } else {
        setRooms([]);
        setFilteredRooms([]);
        toast.warn("Hiện tại không có phòng phù hợp");
      }
    } catch (error) {
      console.error("Lỗi tải phòng available:", error);
    }
  };

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

  useEffect(() => {
    setFilteredRooms(rooms);
  }, [rooms]);

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        {/* SEARCH HEADER */}
        <DetailHeader
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          onChangeCheckIn={setCheckInDate}
          onChangeCheckOut={setCheckOutDate}
          onSearch={handleSearch}
        />

        <div className={styles.content}>
          {/* FILTER */}
          <aside className={styles.sidebarContainer}>
            <FilterSidebar
              rooms={allRooms}
              onFilterChange={handleFilterChange}
            />
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
