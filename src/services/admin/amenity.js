import apiClient from "../apiClient";

const amenityService = {
  getAllAmenities: async () => {
    try {
      const response = await apiClient.get(
        `/api/public/amenities`
      );
      return response;   // 👈 Giữ nguyên response để lấy response.data
    } catch (error) {
      throw error;
    }
  },
};

export default amenityService;
