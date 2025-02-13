import React, { useState } from "react";
import styles from "./NotificationsModal.module.css";
import arrowBack from "../../assets/arrow_back.svg";
import { formatDate } from "../../utils/formatFunctions";

export const NotificationsModal = ({
  isNotificationsOpen,
  setIsNotificationsOpen,
  notifications,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const closeModal = (e) => {
    e.stopPropagation();

    setIsClosing(true);

    setTimeout(() => {
      setIsNotificationsOpen(false);

      setIsClosing(false);
    }, 300);
  };

  return (
    <div
      className={styles.overlay}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.65)" }}
      onClick={closeModal}
    >
      <div
        className={`${styles.modal} ${
          !isNotificationsOpen || isClosing ? styles.hidden : styles.visible
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Верхняя панель для мобильных устройств */}
        <div className={styles.mobileHeader}>
          <img src={arrowBack} alt="Back" onClick={closeModal} />
          <p className={styles.title}>Notifications</p>
          <p></p>
        </div>

        {/* Контент */}
        <div className={styles.content}>
          <p className={styles.desktopTitle}>Notifications</p>
          <p className={styles.sectionTitle}>New</p>

          <div className={styles.notificationsList}>
            {notifications.length > 0 &&
              notifications.map((notification) => (
                <div key={notification._id} className={styles.notificationItem}>
                  <div className={styles.notificationInfo}>
                    <img
                      src={notification?.actionMaker?.profile_image}
                      className={styles.profileImage}
                      alt="profile"
                    />
                    <p className={styles.notificationText}>
                      <span className={styles.username}>
                        {notification?.actionMaker?.username}
                      </span>
                      <span> {notification?.type}</span>
                      <span className={styles.timestamp}>
                        {formatDate(new Date(notification.createdAt))}
                      </span>
                    </p>
                  </div>

                  {/* Превью фото, если есть */}
                  {(notification?.post?.photos ||
                    notification?.comment?.post?.photos) && (
                    <img
                      src={
                        notification?.post?.photos[0]?.url ||
                        notification?.comment?.post?.photos[0]?.url
                      }
                      alt="photo"
                      className={styles.previewImage}
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
