import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RoomDayEditor from "../../components/roomDetail/RoomDayEditor/RoomDayEditor";
import RoomInfo from "../../components/roomInfo/RoomInfo";
import styles from "./RoomDetailPage.module.css";
import roomService from "../../../services/admin/room";
import { toast } from "react-toastify";

function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await roomService.getRoomDetail(id);
        setRoom(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết phòng:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    if (id) fetchRoom();
  }, [id]);

  const handleRoomSave = (updatedData) => {
    setRoom((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  const handleDelete = async () => {
    if (window.confirm(`Xóa phòng: ${room.roomNumber}?`)) {
      console.log("Delete room:", room.id);
      try {
        await roomService.deleteRoom(room.id);
        toast.success("Xóa phòng thành công!");
        navigate("/admin/rooms");
      } catch (error) {
        console.error("Lỗi khi xóa phòng:", error);
        toast.error("Xóa phòng thất bại!");
      }
    }
  };

  if (isInitialLoading) return <p>Đang tải...</p>;
  if (!room) return <p>Không tìm thấy phòng!</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Chỉnh sửa thông tin phòng</h2>
      </div>

      {/* FORM GIỐNG ROOM TYPE NHƯNG CHO ROOM */}
      <RoomInfo
        roomData={room}
        onSave={handleRoomSave}
      />

      {/* EDITOR THEO NGÀY */}
      <RoomDayEditor roomData={room} />

      <button className={styles.deleteBtn} onClick={handleDelete}>Xóa phòng này</button>
    </div>
  );
}

export default RoomDetail;
