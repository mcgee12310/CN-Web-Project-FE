import apiClient from "../apiClient";

const reviewService = {
  getRoomTypeReviews: async (id) => {
    try {
      const response = await apiClient.get(
        `/api/reviews/room-type/${id}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
}

export default reviewService;
