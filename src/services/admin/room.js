import { get } from "react-hook-form";
import apiClient from "../apiClient";

const roomService = {
  getAllRooms: async () => {
    try {
      const response = await apiClient.get(
        `/api/admin/rooms`
      );
      return response;   // 👈 Giữ nguyên response để lấy response.data
    } catch (error) {
      throw error;
    }
  },

  getRoomDetail: async (roomId) => {
    try {
      const response = await apiClient.get(
        `/api/admin/rooms/${roomId}`
      );
      return response;   // 👈 Giữ nguyên response để lấy response.data
    } catch (error) {
      throw error;
    }
  },

  updateRoom: async (id, roomData) => {
    try {
      const response = await apiClient.put(
        `/api/admin/rooms/${id}`,
        roomData
      );
      return response;   // 👈 Giữ nguyên response để lấy response.data
    } catch (error) {
      throw error;
    }
  },

  addRoom: async (roomData) => {
    try {
      const response = await apiClient.post(
        `/api/admin/rooms`,
        roomData
      );
      return response;   // 👈 Giữ nguyên response để lấy response.data
    } catch (error) {
      throw error;
    }
  },

  deleteRoom: async (id) => {
    try {
      const response = await apiClient.delete(
        `/api/admin/rooms/${id}`
      );
      return response;   // 👈 Giữ nguyên response để lấy response.data
    } catch (error) {
      throw error;
    }
  },

  getRoomCalendar: async (id, from, to) => {
    try {
      // Đảm bảo URL có tham số query cho ngày tháng
      const response = await apiClient.get(
        `/api/admin/rooms/${id}/calendar?from=${from}&to=${to}`
      );
      // Giả định response.data chứa mảng lịch
      return response.data; 
    } catch (error) {
      throw error;
    }
  },
};

export default roomService;
