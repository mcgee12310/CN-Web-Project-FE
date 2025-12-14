import apiClient from "../apiClient";

const profileService = {
  myInfo: async () => {
    try {
      const response = await apiClient.get("api/user/profile");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateInfo: async ({ name, phone, birthDate }) => {
    try {
      const response = await apiClient.put("api/user/profile", {
        name,
        phone,
        birthDate,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    try {
      const response = await apiClient.put("api/user/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMyBookings: async () => {
    try {
      const response = await apiClient.get("api/user/bookings");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBookingId: async (bookingId) => {
    try {
      const response = await apiClient.get(`api/user/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  postReview: async ({ bookingId, rating, comment }) => {
    try {
      const response = await apiClient.post("api/user/reviews", {
        bookingId,
        rating,
        comment,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMyReviews: async () => {
    try {
      const response = await apiClient.get("api/reviews/my-reviews");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default profileService;
