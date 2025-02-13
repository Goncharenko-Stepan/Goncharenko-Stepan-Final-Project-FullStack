import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  editProfile,
  fetchUser,
} from "../../store/actionCreators/userActionCreators";
import websiteLink from "../../assets/website_link.svg";
import styles from "./EditProfilePage.module.css";

export const EditProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { username } = useParams();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      username: user?.username || "",
      website: user?.website || "",
      about: user?.bio || "",
      profileImage: null,
    },
  });

  const [preview, setPreview] = useState(user?.profile_image || null);
  const [showNotification, setShowNotification] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File must be smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    setValue("profileImage", [file], {
      shouldValidate: true,
      shouldDirty: true,
    });
    await trigger("profileImage");
  };

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(
        editProfile({
          username: user.username,
          new_username: data.username,
          profile_image: data.profileImage,
          website: data.website,
          bio: data.about,
        })
      ).unwrap(); // Дожидаемся результата

      await dispatch(fetchUser({ username: data.username })).unwrap(); // Дожидаемся обновления юзера

      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error("Failed to edit profile:", error);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <p className={styles.title}>Edit profile</p>
      <div className={styles.profileBox}>
        <div className={styles.profileInfo}>
          <img
            src={preview || user.profile_image}
            alt={user.username}
            className={styles.avatar}
          />
          <div>
            <p className={styles.username}>{user.username}</p>
            <p className={styles.bio}>{user.bio}</p>
          </div>
        </div>
        <input
          {...register("profileImage")}
          type="file"
          id="file-upload"
          className={styles.hiddenInput}
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload" className={styles.uploadButton}>
          New photo
        </label>
      </div>

      <label className={styles.label}>Username</label>
      {user.error && <p className={styles.error}>{user.error}</p>}
      <input
        {...register("username", {
          required: "Username is required",
          maxLength: 120,
        })}
        className={styles.input}
      />
      {errors.username && (
        <p className={styles.error}>{errors.username.message}</p>
      )}

      <label className={styles.label}>Website</label>
      <div className={styles.inputWrapper}>
        <img src={websiteLink} alt="Website" className={styles.icon} />
        <input
          {...register("website", { maxLength: 120 })}
          className={styles.input}
        />
      </div>
      {errors.website && (
        <p className={styles.error}>{errors.website.message}</p>
      )}

      <label className={styles.label}>About</label>
      <div className={styles.textareaWrapper}>
        <textarea
          {...register("about", { maxLength: 150 })}
          className={styles.textarea}
        />
        <p className={styles.counter}>{watch("about").length}/150</p>
      </div>
      {errors.about && <p className={styles.error}>{errors.about.message}</p>}

      <button
        type="submit"
        className={`${styles.submitButton} ${
          isDirty ? styles.active : styles.disabled
        }`}
        disabled={!isDirty}
      >
        Save
      </button>

      {showNotification && (
        <div className={styles.notification}>
          <span>Profile edited</span>
          <button onClick={() => setShowNotification(false)}>✕</button>
        </div>
      )}
    </form>
  );
};
