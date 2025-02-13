import React from "react";
import default_profile_pic from "../../assets/profile_pic.png";
import styles from "./ProfilePageSkeleton.module.css";

export const ProfilePageSkeleton = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}></div>
      </div>
      <div className={styles.profileWrapper}>
        <div className={styles.profileHeader}>
          <img
            className={styles.profilePic}
            src={default_profile_pic}
            alt="Profile pic"
          />
          <div className={styles.userInfo}>
            <div className={styles.userName}>
              <div className={styles.placeholder}></div>
            </div>
            <div className={styles.buttons}>
              <button className={styles.followButton}>Follow</button>
              <button className={styles.messageButton}>Message</button>
            </div>
            <div className={styles.stats}>
              <p>
                <b>0</b> posts
              </p>
              <p>
                <b>0</b> followers
              </p>
              <p>
                <b>0</b> following
              </p>
            </div>
            <div className={styles.hiddenPlaceholder}></div>
          </div>
        </div>
        <div className={styles.grid}>
          {new Array(12).fill(0).map((_, i) => (
            <div key={i} className={styles.gridItem}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;
