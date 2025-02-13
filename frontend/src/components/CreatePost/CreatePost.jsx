import React from "react";
import { Link } from "react-router-dom";
import Picker from "emoji-picker-react";
import upload from "../../assets/upload.png";
import arrowBack from "../../assets/arrow_back.svg";
import smiley from "../../assets/smiley.png";
import { PhotoCarousel } from "../PhotoCarousel/PhotoCarousel";
import { useCreatePost } from "../../utils/customHooks";
import styles from "./CreatePost.module.css";

export const CreatePost = ({
  userId,
  username,
  profileImage,
  setIsCreatePostOpen,
}) => {
  const {
    content,
    setContent,
    photos,
    previews,
    showEmojiPicker,
    setShowEmojiPicker,
    creating,
    status,
    error,
    handleFileChange,
    onEmojiClick,
    handleSubmit,
    resetForm,
  } = useCreatePost(userId, setIsCreatePostOpen);

  const closeCreatePost = (e) => {
    e.stopPropagation();
    setIsCreatePostOpen(false);
    resetForm();
  };

  return (
    <div className={styles.overlay} onClick={closeCreatePost}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {status === "FAILED" && error && (
          <div className={styles.error}>
            Image should be less than 5MB and svg/jpg/png
          </div>
        )}
        <form onSubmit={handleSubmit} className={styles.form}>
          <img
            src={arrowBack}
            alt="Back"
            className={styles.backButton}
            onClick={closeCreatePost}
          />
          <p className={styles.title}>Create new post</p>
          <div className={styles.submitContainer}>
            {creating && <div className={styles.loader}></div>}
            <input
              type="submit"
              disabled={content.length === 0 || photos.length === 0}
              className={
                content.length === 0 || photos.length === 0
                  ? styles.disabledButton
                  : styles.activeButton
              }
              value="Share"
            />
          </div>
        </form>
        <div className={styles.content}>
          <div className={styles.uploadSection}>
            {previews.length > 0 ? (
              <PhotoCarousel
                croppedStyle={true}
                photos={previews.map((preview) => preview.url)}
                previews={previews}
              />
            ) : (
              <img src={upload} alt="Upload" />
            )}
            <input
              type="file"
              className={styles.fileInput}
              onChange={handleFileChange}
              multiple
            />
          </div>
          <div className={styles.details}>
            <Link to={`profile/${userId}`} className={styles.profileLink}>
              <div className={styles.userInfo}>
                <img
                  src={profileImage}
                  alt="Profile"
                  className={styles.profileImage}
                />
                <p className={styles.username}>{username}</p>
              </div>
            </Link>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles.textarea}
              maxLength={2200}
            />
            <p className={styles.charCount}>{content.length}/2200</p>
            <div className={styles.emojiContainer}>
              <img
                src={smiley}
                alt="Emoji"
                className={styles.emojiIcon}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />
              {showEmojiPicker && (
                <div className={styles.emojiPicker}>
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
