import apiClient from "../apiClient";

const bookingService = {
  getAllBookings: async () => {
    try {
      const response = await apiClient.get(
        `/api/admin/bookings`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  getBookingDetail: async (id) => {
    try {
      const response = await apiClient.get(
        `/api/admin/bookings/${id}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  cancelBooking: async (id) => {
    try {
      const response = await apiClient.put(
        `/api/admin/bookings/${id}/cancel`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  checkInRequest: async (payload) => {
    try {
      const response = await apiClient.post(
        "/api/admin/bookings/requests/check-in",
        payload
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  checkOutRequest: async (id) => {
  try {
    const response = await apiClient.put(
      `/api/admin/bookings/requests/${id}/check-out`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
},
};

export default bookingService;
