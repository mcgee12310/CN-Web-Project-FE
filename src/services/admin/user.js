import apiClient from "../apiClient";

const userService = {
  getAllUsers: async () => {
    try {
      const response = await apiClient.get(
        `/api/admin/users`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  getUserDetail: async (id) => {
    try {
      const response = await apiClient.get(
        `/api/admin/users/${id}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await apiClient.delete(
        `/api/admin/users/${id}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  resoreUser: async (id) => {
    try {
      const response = await apiClient.put(
        `/api/admin/users/${id}/restore`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
