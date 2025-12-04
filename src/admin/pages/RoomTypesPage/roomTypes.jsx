import React, { useState, useEffect } from "react";
import Card2 from "../../components/card2/card2";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AddRoomTypeModal from "../../components/addRoomTypeModal/AddRoomTypeModal";
import styles from "./roomTypes.module.css";
import roomTypeService from "../../../services/admin/roomType";

function RoomTypes() {
  const [search, setSearch] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddRoomType, setOpenAddRoomType] = useState(false);

  // ✅ Gọi API lấy tất cả room types
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        setLoading(true);

        const response = await roomTypeService.getAllRoomType();

        // Nếu API trả về: { data: [...] }
        const data = response.data;

        setRoomTypes(data);
        console.log("Room types:", data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách room types", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomTypes();
  }, []);

  // ✅ Tìm kiếm theo tên
  const filteredData = roomTypes.filter((room) =>
    room.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveRoomType = async (data) => {
    console.log("Room type mới:", data);

    // Sau khi thêm thành công → gọi lại API
    try {
      const response = await roomTypeService.getAllRoomType();
      setRoomTypes(response.data);
    } catch (error) {
      console.error("Không load lại được danh sách phòng", error);
    }

    setOpenAddRoomType(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Quản lý phòng</h2>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <SearchOutlined />
          <Input
            placeholder="Tìm kiếm theo tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 250, marginLeft: 8 }}
          />
        </div>

        <button
          className={styles.addBtn}
          onClick={() => setOpenAddRoomType(true)}
        >
          Thêm loại phòng
        </button>
      </div>

      <div className={styles.content}>
        {loading ? (
          <p>Đang tải danh sách phòng...</p>
        ) : (
          <section className={styles.roomsContainer}>
            <Card2 rooms={filteredData} />
          </section>
        )}
      </div>

      <AddRoomTypeModal
        open={openAddRoomType}
        onClose={() => setOpenAddRoomType(false)}
        onSave={handleSaveRoomType}
      />
    </div>
  );
}

export default RoomTypes;
