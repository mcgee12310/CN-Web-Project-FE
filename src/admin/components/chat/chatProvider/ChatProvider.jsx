import { createContext, useContext, useState, useMemo } from "react";
import { seedUsers, seedMessages } from "../../../pages/ChatPage/chatSeed";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  // Users
  const [users, setUsers] = useState(() => seedUsers || []);

  // Messages theo userId
  const [messages, setMessages] = useState(() => seedMessages || {});

  // User đang được chọn
  const [selectedUser, setSelectedUser] = useState(null);

  // --- chọn user chat ---
  const selectUser = (user) => {
    setSelectedUser(user);
  };

  // --- gửi tin nhắn (admin) ---
  const sendMessage = (content) => {
    if (!selectedUser || !content?.trim()) return;

    const newMsg = {
      id: Date.now(),
      senderId: 1, // admin
      receiverId: selectedUser.id,
      content,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => {
      const current = prev[selectedUser.id] || [];

      return {
        ...prev,
        [selectedUser.id]: [...current, newMsg],
      };
    });
  };

  // --- lấy ra message theo user đang chọn ---
  const currentMessages = useMemo(() => {
    if (!selectedUser) return [];
    return messages[selectedUser.id] || [];
  }, [messages, selectedUser]);

  const value = {
    users,
    messages,
    selectedUser,
    currentMessages,
    selectUser,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat phải được dùng trong <ChatProvider>");
  }
  return context;
};
