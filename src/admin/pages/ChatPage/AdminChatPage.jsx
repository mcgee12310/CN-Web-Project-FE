import ChatUserList from "../../components/chat/chatUserList/ChatUserList";
import ChatWindow from "../../components/chat/chatWindow/ChatWindow";
import { ChatProvider } from "../../components/chat/chatProvider/ChatProvider";

import styles from "./AdminChatPage.module.css";

export default function AdminChatPage() {
  return (
    <ChatProvider>
      <div className={styles.container}>
        <ChatUserList />
        <ChatWindow />
      </div>
    </ChatProvider>
  );
}
