import React from "react";
import styles from "./HomePageSkeleton.module.css";
import like from "../../assets/reactionIcons/like.svg";
import comment from "../../assets/reactionIcons/comment.svg";

export const HomePageSkeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeletonGrid}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={styles.skeletonItem}>
            <div className={styles.skeletonHeader}>
              <div className={styles.skeletonAvatar}></div>
              <div className={styles.skeletonText}></div>
            </div>
            <div className={styles.skeletonImage}></div>
            <div className={styles.skeletonReactions}>
              <img src={like} alt="like" className={styles.skeletonIcon} />
              <img
                src={comment}
                alt="comment"
                className={styles.skeletonIcon}
              />
            </div>
            <div className={styles.skeletonFooter}>
              <div className={styles.skeletonAvatar}></div>
              <div className={styles.skeletonComment}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
