import apiClient from "../apiClient";

const roomService = {
  getAllRoomType: async () => {
    try {
      const response = await apiClient.get("api/public/room-types");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getRoomAvailable: async (checkIn, checkOut) => {
    try {
      const response = await apiClient.post("api/public/room-types/available", {
        checkInDate: checkIn,
        checkOutDate: checkOut,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getRoomTypeDetail: async (id, checkInDate, checkOutDate) => {
    try {
      const response = await apiClient.get(
        `api/public/room-types/${id}/details`,
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
  bookingRooms: async (payload) => {
    try {
      const response = await apiClient.post("api/bookings", payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
export default roomService;
