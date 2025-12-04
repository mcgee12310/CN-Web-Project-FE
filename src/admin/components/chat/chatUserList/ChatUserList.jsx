import { useChat } from "../chatProvider/ChatProvider";
import styles from "./ChatUserList.module.css";

const getAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random`;

export default function ChatUserList() {
  const { users, selectUser, selectedUser } = useChat();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Người dùng</h2>

      {users.map((u) => (
        <div
          key={u.id}
          className={`${styles.userItem} ${
            selectedUser?.id === u.id ? styles.active : ""
          }`}
          onClick={() => selectUser(u)}
        >
          {/* Avatar */}
          <img
            src={getAvatarUrl(u.username)}
            alt={u.username}
            className={styles.avatar}
          />

          {/* Username */}
          <span className={styles.username}>{u.username}</span>

          {/* Status */}
          <span
            className={`${styles.status} ${
              u.online ? styles.online : styles.offline
            }`}
          />
        </div>
      ))}
    </div>
  );
}
