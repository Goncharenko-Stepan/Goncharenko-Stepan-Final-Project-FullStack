import React from "react";
import arrow_back from "../../assets/arrow_back.svg";
import more from "../../assets/more.svg";
import like from "../../assets/reactions/like.svg";
import comment from "../../assets/reactions/comment.svg";
import emoji from "../../assets/emoji.png";
import styles from "./PostModalSkeleton.module.css";

const PostModalSkeleton = () => {
  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <div className={styles.mobileHeader}>
          <img src={arrow_back} alt="Back" className={styles.backIcon} />
          <div className={styles.placeholder}></div>
          <img src={more} alt="More" className={styles.moreIcon} />
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.imageWrapper}>
            <div className={styles.image}></div>
          </div>
          <div className={styles.commentSection}>
            <div className={styles.commentHeader}>
              <div className={styles.commentUser}>
                <div className={styles.commentUserAvatar}></div>
                <div className={styles.commentUserName}></div>
              </div>
            </div>
            <div className={styles.commentBody}>
              <div className={styles.commentText}></div>
              <div className={styles.commentPlaceholder}></div>
            </div>
            <div className={styles.footer}>
              <div className={styles.reactions}>
                <img src={like} alt="like" className={styles.icon} />
                <img src={comment} alt="comment" className={styles.icon} />
              </div>
              <div className={styles.placeholder}></div>
            </div>
            <div className={styles.commentInput}>
              <div className={styles.inputWrapper}>
                <img src={emoji} alt="Emoji" className={styles.emojiIcon} />
                <div className={styles.textInput}></div>
              </div>
              <button className={styles.sendButton}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModalSkeleton;
