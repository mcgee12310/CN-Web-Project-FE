import apiClient from "../apiClient";

const tierService = {
  getAllTiers: async () => {
    try {
      const response = await apiClient.get(`/api/admin/customer-tiers`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  createTier: async (payload) => {
    try {
      const response = await apiClient.post(`/api/admin/customer-tiers`, payload);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateTier: async (id, payload) => {
    try {
      const response = await apiClient.put(`/api/admin/customer-tiers/${id}`, payload);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteTier: async (id) => {
    try {
      const response = await apiClient.delete(`/api/admin/customer-tiers/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default tierService;
