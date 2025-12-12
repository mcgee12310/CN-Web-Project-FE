import { useChat } from "../chatProvider/ChatProvider";
import { useState } from "react";
import styles from "./ChatWindow.module.css";

export default function ChatWindow() {
  const { selectedUser, messages, sendMessage } = useChat();
  const [text, setText] = useState("");

  if (!selectedUser)
    return <div className={styles.empty}>Chọn người dùng để chat</div>;

  const list = messages[selectedUser.id] || [];

  const onSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  };

  return (
    <div className={styles.chatWindow}>
      <h2 className={styles.header}>
        Chat với: {selectedUser.username}
      </h2>

      <div className={styles.messages}>
        {list.map((m, i) => (
          <div
            key={i}
            className={`${styles.messageRow} ${
              m.senderId === 1 ? styles.me : styles.other
            }`}
          >
            <span className={styles.messageBubble}>
              {m.content}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.inputArea}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={styles.input}
          placeholder="Nhập tin nhắn..."
        />
        <button
          onClick={onSend}
          className={styles.sendBtn}
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
