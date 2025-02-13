import { useState } from "react";
import { useLocation, useParams } from "react-router";
import { deletePost } from "../../../utils/apiUtils/postApi.js";
import styles from "./PostMore.module.css";

export const PostMore = ({ modalRef, postId, setPostType }) => {
  const location = useLocation();
  const [showNotification, setShowNotification] = useState(false);
  const { username } = useParams();

  const copyToClipboard = () => {
    const fullUrl = `${window.location.origin}${location.pathname}`;
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      })
      .catch((err) => console.error("Failed to copy link:", err));
  };

  const closeModal = (e) => {
    if (modalRef.current) {
      e.stopPropagation();
      modalRef.current.hidden = true;
    }
  };

  const handleDeletePost = async () => {
    try {
      if (!postId || !modalRef.current) return;
      await deletePost(postId);
      window.location.href = `/profile/${username}`;
    } catch (error) {
      console.error("Could not delete post", error);
    }
  };

  return (
    <div className={styles.overlay} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.options}>
          <p className={styles.delete} onClick={handleDeletePost}>
            Delete
          </p>
          <p
            onClick={(e) => {
              closeModal(e);
              setPostType("edit");
            }}
          >
            Edit
          </p>
          <p onClick={closeModal}>Go to post</p>
          <p onClick={copyToClipboard}>Copy link</p>
          <p onClick={closeModal}>Cancel</p>
        </div>
      </div>
      {showNotification && (
        <div className={styles.notification}>
          <span>Link copied!</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowNotification(false);
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
