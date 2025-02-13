import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Picker from "emoji-picker-react";
import { useDispatch } from "react-redux";
import { updatePost } from "../../../store/actionCreators/postActionCreators";
import emoji from "../../../assets/emoji.png";
import styles from "./EditPostForm.module.css";

export const EditPostForm = ({ postContent, postId, setPostType, setPost }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const onEditPost = async (data) => {
    if (!postId) return;
    await dispatch(updatePost({ id: postId, content: data.content })).unwrap();
    setPost((prevPost) =>
      prevPost ? { ...prevPost, content: data.content } : null
    );
    setPostType("preview");
  };

  const onEmojiClick = (emojiData) => {
    const currentContent = watch("content") || "";
    setValue("content", currentContent + emojiData.emoji);
  };

  return (
    <form onSubmit={handleSubmit(onEditPost)} className={styles.form}>
      {errors.content && (
        <p className={styles.error}>
          The comment should be less than 2200 characters
        </p>
      )}
      <textarea
        defaultValue={postContent}
        {...register("content", { required: true, maxLength: 2200 })}
        className={styles.textarea}
      />
      <div className={styles.controls}>
        <img
          src={emoji}
          alt="Emoji"
          className={styles.emojiIcon}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        />
        {showEmojiPicker && (
          <div className={styles.emojiPicker}>
            <Picker onEmojiClick={onEmojiClick} />
          </div>
        )}
        <button
          type="button"
          className={styles.goBack}
          onClick={() => setPostType("preview")}
        >
          Go back
        </button>
        <input type="submit" value="Edit" className={styles.submit} />
      </div>
    </form>
  );
};
