import apiClient from "../apiClient";

const roomTypeService = {
  getAllRoomType: async () => {
    try {
      const response = await apiClient.get(
        `/api/public/room-types`
      );
      return response;   // 👈 Giữ nguyên response để lấy response.data
    } catch (error) {
      throw error;
    }
  },

  getRoomTypeDetail: async (id) => {
    try {
      const response = await apiClient.get(
        `/api/public/room-types/${id}/details`
      );
      return response;   // 👈 Giữ nguyên response để lấy response.data
    } catch (error) {
      throw error;
    }
  },

  addNewRoomType: async (data) => {
    try {
      const response = await apiClient.post(
        `/api/admin/room-types`, data
      );
      return response;   // 👈 Giữ nguyên response để lấy response.data
    } catch (error) {
      throw error;
    }
  },

  updateRoomTypeInfo: async (id, data) => {
    try {
      const response = await apiClient.put(
        `/api/admin/room-types/${id}`, data
      );
      return response;   // 👈 Giữ nguyên response để lấy response.data
    } catch (error) {
      throw error;
    }
  },

  getRoomTypeImages: async (roomTypeId) => {
    try {
      const response = await apiClient.get(
        `/api/admin/room-types/${roomTypeId}/images`
      );
      return response;   // 👈 Giữ nguyên response để lấy response.data
    } catch (error) {
      throw error;
    }
  },

  uploadRoomTypeImage: async (roomTypeId, formData) => {
    try {
      const response = await apiClient.put(
        `/api/admin/room-types/${roomTypeId}/images`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default roomTypeService;
