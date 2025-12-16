import React, { useState, useEffect } from "react";
import Card2 from "../../components/card2/card2";
import { Input, Button } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import AddRoomTypeModal from "../../components/addRoomTypeModal/AddRoomTypeModal";
import styles from "./roomTypes.module.css";
import roomTypeService from "../../../services/admin/roomType";
import { usePageTitle } from '../../../utils/usePageTitle';

function RoomTypes() {
  usePageTitle('Danh sách loại phòng');
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
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Danh sách loại phòng</h1>
          <p className={styles.subtitle}>Quản lý tất cả loại phòng hiện có</p>
        </div>

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

          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setOpenAddRoomType(true)}
          >
            Thêm loại phòng
          </Button>
        </div>

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
