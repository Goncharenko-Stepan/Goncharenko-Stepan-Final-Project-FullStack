import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet, useParams } from "react-router-dom"; // Исправил import useParams
import { fetchUserChats } from "../../utils/apiUtils/chatApi.js";
import { formatDate } from "../../utils/formatFunctions.js";
import styles from "./MessagePage.module.css"; // Подключаем модули стилей

export const MessagesPage = () => {
  const [chats, setChats] = useState([]);
  const user = useSelector((state) => state.user);
  const { username } = useParams();

  useEffect(() => {
    const getChats = async () => {
      const result = await fetchUserChats();
      if (result) setChats(result);
    };
    if (chats.length === 0) getChats();
  }, [chats.length]);

  return (
    <div className={styles.container}>
      <div className={`${styles.sidebar} ${username ? styles.hidden : ""}`}>
        <p className={styles.username}>{user?.username}</p>
        <div className={styles.chatList}>
          {chats.length > 0 &&
            chats.map((chat) => {
              const chatUsername =
                chat.user1.username === user.username
                  ? chat.user2.username
                  : chat.user1.username;

              const isActive = username === chatUsername;

              return (
                <Link
                  to={`/messages/${chatUsername}`}
                  key={chat._id}
                  className={`${styles.chatItem} ${
                    isActive ? styles.active : ""
                  }`}
                >
                  <img
                    src={
                      chat.user1.username === user.username
                        ? chat.user2.profile_image
                        : chat.user1.profile_image
                    }
                    alt="profile"
                    className={styles.chatImage}
                  />
                  <div className={styles.chatInfo}>
                    <p className={styles.chatUsername}>{chatUsername}</p>
                    {chat.last_message ? (
                      <p className={styles.chatMessage}>
                        {chat.last_message.author.username === user.username
                          ? "You"
                          : chat.last_message.author.username}{" "}
                        sent a message ·{" "}
                        {formatDate(new Date(chat.last_message.createdAt))}
                      </p>
                    ) : (
                      <p className={styles.chatMessage}>No messages yet</p>
                    )}
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
      <div
        className={`${styles.chatWindow} ${
          username ? styles.visible : styles.hidden
        }`}
      >
        <Outlet context={{ user }} />
      </div>
    </div>
  );
};
