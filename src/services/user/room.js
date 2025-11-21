import apiClient from "../apiClient";
const roomService = {
  getAllRoomType: async () => {
    try {
      const response = await apiClient.get("api/user/room-types/get-all");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getRoomAvailable: async (checkIn, checkOut) => {
    try {
      const response = await apiClient.post("api/user/room-types/available", {
        checkIn,
        checkOut,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getRoomTypeDetail: async (id, checkInDate, checkOutDate) => {
    try {
      const response = await apiClient.get(
        `api/user/room-types/${id}/details`,
        {
          params: {
            checkInDate,
            checkOutDate,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
export default roomService;
