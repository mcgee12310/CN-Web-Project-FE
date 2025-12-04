// src/services/chatApi.js
import axios from "axios";

const API = axios.create({
  baseURL: "/api", // change base if needed
});

// Get list of users who chatted or online (server returns lastMessage, unreadCount, online)
export const getChatUsers = () => API.get("/admin/chat/users");

// Get chat history between admin and a user
export const getChatHistory = (userId, page = 0, size = 100) =>
  API.get(`/admin/chat/${userId}/messages`, { params: { page, size } });

// Send a direct message via REST fallback (optional)
export const sendMessageRest = (payload) => API.post("/admin/chat/send", payload);

// Mark messages as read
export const markAsRead = (userId) => API.post(`/admin/chat/${userId}/read`);

export default {
  getChatUsers,
  getChatHistory,
  sendMessageRest,
  markAsRead,
};
