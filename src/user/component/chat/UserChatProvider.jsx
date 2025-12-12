import { createContext, useContext, useState } from "react";
import { userSeedMessages } from "../../../admin/pages/ChatPage/chatSeed"; // nếu muốn seed

const ChatContext = createContext();

export const UserChatProvider = ({ children }) => {
  const [messages, setMessages] = useState(userSeedMessages);
  const adminId = 1; // giả sử admin id = 1

  const sendMessage = (content) => {
    const newMsg = {
      senderId: 0, // user
      content,
      time: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, adminId }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useUserChat = () => useContext(ChatContext);
