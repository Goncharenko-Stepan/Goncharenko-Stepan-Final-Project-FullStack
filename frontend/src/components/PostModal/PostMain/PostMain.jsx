import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Picker from "emoji-picker-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/formatFunctions.js";
import {
  isLikedByUser,
  onLikeComment,
  onLikePost,
} from "../../../utils/likeFunctions";
import { addComment } from "../../../utils/apiUtils/commentApi.js";
import moreIcon from "../../../assets/more.svg";
import likedIcon from "../../../assets/reactions/liked.svg";
import likeIcon from "../../../assets/reactions/like.svg";
import commentIcon from "../../../assets/reactions/comment.svg";
import emojiIcon from "../../../assets/emoji.png";
import styles from "./PostMain.module.css";

export const PostMain = ({ post, setPost }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const userId = useSelector((state) => state.user._id);
  const moreRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    setFocus,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onEmojiClick = (emojiData) => {
    const currentContent = watch("content") || "";
    setValue("content", currentContent + emojiData.emoji);
  };

  const onComment = async (data) => {
    try {
      if (post) {
        const newComment = await addComment(data.content, post._id);
        if (newComment) {
          setPost((prev) => ({
            ...prev,
            comments: [...(prev?.comments || []), newComment],
          }));
        }
        reset();
      }
    } catch (e) {
      console.error("Could not upload comment", e);
      setCommentError("Could not upload comment");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link
          to={`/profile/${post?.author?.username}`}
          className={styles.profile}
        >
          <img
            src={post?.author?.profile_image}
            alt="Profile"
            className={styles.profileImage}
          />
          <span className={styles.username}>{post?.author?.username}</span>
        </Link>
        {post?.author?._id === userId && (
          <img
            src={moreIcon}
            alt="More"
            className={styles.moreIcon}
            onClick={() => moreRef.current && (moreRef.current.hidden = false)}
          />
        )}
      </div>

      <div className={styles.content}>
        <Link to={`/profile/${post?.author?.username}`}>
          <img
            src={post?.author?.profile_image}
            alt="Profile"
            className={styles.profileImage}
          />
        </Link>
        <div className={styles.postText}>
          <Link
            to={`/profile/${post?.author?.username}`}
            className={styles.username}
          >
            {post?.author?.username}
          </Link>
          <p>{post?.content}</p>
          {post?.createdAt && (
            <p className={styles.date}>
              {formatDate(new Date(post?.createdAt))}
            </p>
          )}
        </div>
      </div>

      <div className={styles.commentsSection}>
        {post?.comments?.length > 0 &&
          post?.comments.map((comment) => (
            <div key={comment._id} className={styles.comment}>
              <Link to={`/profile/${comment.author.username}`}>
                <img
                  src={comment.author.profile_image}
                  alt={comment.author.username}
                  className={styles.commentProfile}
                />
              </Link>
              <div className={styles.commentContent}>
                <Link
                  to={`/profile/${comment.author.username}`}
                  className={styles.username}
                >
                  {comment.author.username}
                </Link>
                <p>{comment.content}</p>
                <div className={styles.commentMeta}>
                  {comment?.createdAt && (
                    <p>{formatDate(new Date(comment?.createdAt))}</p>
                  )}
                  <p>Likes: {comment?.like_count}</p>
                </div>
              </div>
              <img
                src={
                  userId && isLikedByUser(comment?.likes, userId)
                    ? likedIcon
                    : likeIcon
                }
                alt="like"
                className={styles.likeIcon}
                onClick={(e) => onLikeComment(e, comment._id, post, setPost)}
              />
            </div>
          ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.actions}>
          <img
            src={
              userId && post?.likes && isLikedByUser(post?.likes, userId)
                ? likedIcon
                : likeIcon
            }
            alt="like"
            className={styles.actionIcon}
            onClick={(e) => post?._id && onLikePost(e, post._id, post, setPost)}
          />
          <img
            src={commentIcon}
            alt="comment"
            className={styles.actionIcon}
            onClick={() => setFocus("content")}
          />
        </div>
        <p className={styles.likesCount}>{post?.like_count} likes</p>
        {post?.createdAt && (
          <p className={styles.date}>{formatDate(new Date(post?.createdAt))}</p>
        )}
      </div>

      <div className={styles.commentInputSection}>
        {errors.content && (
          <p className={styles.errorText}>
            The comment should be less than 120 characters
          </p>
        )}
        {commentError && <p className={styles.errorText}>{commentError}</p>}
        <form className={styles.commentForm} onSubmit={handleSubmit(onComment)}>
          <div className={styles.inputWrapper}>
            <img
              src={emojiIcon}
              alt="Emoji"
              className={styles.emojiIcon}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />
            {showEmojiPicker && (
              <div className={styles.emojiPicker}>
                <Picker
                  width={300}
                  height={300}
                  searchDisabled
                  onEmojiClick={onEmojiClick}
                />
              </div>
            )}
            <input
              {...register("content", { required: true, maxLength: 120 })}
              placeholder="Add a comment..."
              className={styles.commentInput}
            />
          </div>
          <button type="submit" className={styles.sendButton}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
