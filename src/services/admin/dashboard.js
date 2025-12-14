import apiClient from "../apiClient";

const dashBoardService = {
  getDashboard: async () => {
    try {
      const response = await apiClient.get(
        `/api/admin/dashboard`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
}

export default dashBoardService;
