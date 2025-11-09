import apiClient from "./apiClient";

const authService = {
  signup: async (email, password, name, phone, birthDate) => {
    try {
      const response = await apiClient.post("api/auth/register", {
        email,
        password,
        name,
        phone,
        birthDate,
      });
      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Đăng ký thất bại";
      throw new Error(msg);
    }
  },

  login: async (email, password) => {
    try {
      const response = await apiClient.post("api/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Đăng nhập thất bại";
      throw new Error(msg);
    }
  },
};

export default authService;
