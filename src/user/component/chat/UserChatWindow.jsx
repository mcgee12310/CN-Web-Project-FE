import { useState, useRef, useEffect } from "react";
import { useUserChat } from "./UserChatProvider";
import styles from "./UserChatWindow.module.css";

export default function UserChatWindow() {
  const { messages, sendMessage } = useUserChat();
  const [text, setText] = useState("");
  const scrollRef = useRef();

  const onSend = () => {
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Ngăn xuống dòng
      onSend();
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Chat với Admin</h3>
      <div className={styles.chatList} ref={scrollRef}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`${styles.message} ${m.senderId === 0 ? styles.user : styles.admin}`}
          >
            {m.content}
          </div>
        ))}
      </div>
      <div className={styles.inputRow}>
        <input
          className={styles.userInput}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nhập tin nhắn..."
          onKeyDown={handleKeyDown}
        />
        <button className={styles.sendBtn} onClick={onSend} disabled={!text.trim()}>
          Gửi
        </button>
      </div>
    </div>
  );
}
