import apiClient from "../apiClient";

const paymentService = {
  payment: async (params) => {
    try {
      return apiClient.get("/api/payment/vnpay/callback", {
        params,
      });
    } catch (error) {
      throw error;
    }
  },
};
export default paymentService;
