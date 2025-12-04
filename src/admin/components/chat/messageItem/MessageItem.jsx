// src/components/chat/MessageItem.jsx
import React from "react";
import { Avatar } from "antd";
import styles from "./MessageItem.module.css";

export default function MessageItem({ msg, isMine }) {
  return (
    <div
      className={`${styles.wrapper} ${
        isMine ? styles.mine : styles.other
      }`}
    >
      <Avatar className={styles.avatar}>
        {(isMine
          ? "A"
          : (msg.fromName || msg.fromId || "U")
        ).toString().slice(0, 1)}
      </Avatar>

      <div
        className={`${styles.bubble} ${
          isMine ? styles.myBubble : styles.otherBubble
        }`}
      >
        <div className={styles.content}>{msg.content}</div>
        <div className={styles.time}>
          {new Date(msg.time || msg.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
