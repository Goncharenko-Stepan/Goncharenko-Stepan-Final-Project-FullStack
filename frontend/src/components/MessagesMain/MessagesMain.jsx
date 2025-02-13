import { useEffect, useRef, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { fetchChat } from "../../utils/apiUtils/chatApi.js";
import { formatMessageTime } from "../../utils/formatFunctions.js";
import styles from "./MessagesMain.module.css";

const TEN_MINUTES = 10 * 60 * 1000;

const socket = io("https://insta-clone-71mt.onrender.com", {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true,
  transports: ["websocket"],
});

export const MessagesMain = () => {
  const { user } = useOutletContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiver, setReceiver] = useState(null);
  const [chatId, setChatId] = useState("");
  const { username } = useParams();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const getMessages = async () => {
      if (!username) return;
      try {
        const result = await fetchChat(username);
        setMessages(result.messages);
        setReceiver(
          result.user1.username === username ? result.user1 : result.user2
        );
        setChatId(result._id);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    getMessages();
  }, [username]);

  useEffect(() => {
    if (chatId) socket.emit("joinRoom", chatId);

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      if (chatId) socket.emit("leaveRoom", chatId);
      socket.off("receiveMessage");
    };
  }, [chatId]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && receiver) {
      socket.emit("sendMessage", {
        authorId: user._id,
        receiverId: receiver._id,
        content: newMessage,
      });
      setNewMessage("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to={`/profile/${receiver?.username}`} className={styles.userInfo}>
          <img
            src={receiver?.profile_image}
            alt={receiver?.username}
            className={styles.userImage}
          />
          <p className={styles.username}>{receiver?.username}</p>
        </Link>
      </div>

      <div className={styles.messagesContainer}>
        <div className={styles.profilePreview}>
          <Link to={`/profile/${username}`}>
            <img
              src={receiver?.profile_image}
              alt={receiver?.username}
              className={styles.profileImage}
            />
          </Link>
          <Link to={`/profile/${username}`} className={styles.profileName}>
            {receiver?.username}
          </Link>
          <Link to={`/profile/${username}`} className={styles.viewProfile}>
            View profile
          </Link>
        </div>

        <div className={styles.messages}>
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];
            const showTime =
              !prevMessage ||
              new Date(message.createdAt) - new Date(prevMessage.createdAt) >
                TEN_MINUTES;
            return (
              <div key={message._id}>
                {showTime && (
                  <div className={styles.timestamp}>
                    {formatMessageTime(message.createdAt)}
                  </div>
                )}
                <div
                  className={`${styles.messageRow} ${
                    message.author.username === user?.username
                      ? styles.sent
                      : styles.received
                  }`}
                >
                  {message.author.username !== user?.username && (
                    <img
                      src={message.author.profile_image}
                      alt={message.author.username}
                      className={styles.avatar}
                    />
                  )}
                  <div className={styles.messageBubble}>{message.content}</div>
                  {message.author.username === user?.username && (
                    <img
                      src={user?.profile_image}
                      alt={user?.username}
                      className={styles.avatar}
                    />
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef}></div>
        </div>
      </div>

      <input
        className={styles.input}
        placeholder="Write message"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
