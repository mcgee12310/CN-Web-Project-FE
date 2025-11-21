import apiClient from "./apiClient";

const authService = {
  signup: async (email, password, name, phone, birthDate) => {
    try {
      const response = await apiClient.post("/api/auth/register", {
        email,
        password,
        name,
        phone,
        birthDate,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await apiClient.post("/api/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyOtp: async (email, otpCode) => {
    try {
      const response = await apiClient.post("/api/auth/verify-otp", {
        email,
        otp: otpCode,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resendOtp: async (email) => {
    try {
      const response = await apiClient.post("/api/auth/resend-otp", {
        email,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
