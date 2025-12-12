// src/components/chat/MessageInput.jsx
import React, { useState } from "react";
import { Input, Button } from "antd";
import styles from "./MessageInput.module.css";

export default function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const send = async () => {
    if (!text.trim()) return;
    await onSend(text.trim());
    setText("");
  };

  return (
    <div className={styles.wrapper}>
      <Input.TextArea
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nhập tin nhắn..."
        className={styles.input}
      />

      <Button
        type="primary"
        onClick={send}
        disabled={disabled}
        className={styles.sendBtn}
      >
        Gửi
      </Button>
    </div>
  );
}
