import { useState } from "react";
import { UserChatProvider } from "./UserChatProvider";
import UserChatWindow from "./UserChatWindow";
import { FaRegCommentDots } from "react-icons/fa";
import styles from "./UserChatToggle.module.css";

export default function UserChatToggle() {
  const [open, setOpen] = useState(false);

  return (
    <UserChatProvider>
      <button className={styles.chatButton} onClick={() => setOpen((p) => !p)}>
        <FaRegCommentDots />
      </button>

      {open && (
        <div className={styles.chatWindow}>
          <UserChatWindow />
        </div>
      )}
    </UserChatProvider>
  );
}
