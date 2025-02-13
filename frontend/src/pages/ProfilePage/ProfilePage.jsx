import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { useSelector } from "react-redux";
import { PostModal } from "../../components/PostModal/PostModal/PostModal.jsx";
import { ProfileHeader } from "../../components/ProfileHeader/ProfileHeader.jsx";
import { ProfilePageSkeleton } from "../../skeletons/ProfilePageSkeleton/ProfilePageSkeleton.jsx";
import { fetchProfile } from "../../utils/apiUtils/userApi.js";
import styles from "./ProfilePage.module.css";

export const ProfilePage = () => {
  const { username } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const isModal = location.pathname.includes("/post/");

  useEffect(() => {
    const fetchUserFunc = async () => {
      if (!username) return;
      if (user.username !== username) {
        try {
          const result = await fetchProfile(username);
          setCurrentUser(result);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        setCurrentUser(user);
      }
    };
    fetchUserFunc();
  }, [username, user]);

  if (!currentUser) return <ProfilePageSkeleton />;

  return (
    <div className={styles.container}>
      <div className={styles.usernameBar}>{currentUser?.username}</div>
      <div className={styles.profileWrapper}>
        <ProfileHeader user={currentUser} profileUsername={user.username} />
        <div className={styles.postsGrid}>
          {currentUser?.posts?.length > 0 &&
            [...currentUser.posts].reverse().map((post) => (
              <div key={post._id} className={styles.postItem}>
                <Link
                  to={`/post/${post._id}`}
                  state={{ backgroundLocation: location }}
                >
                  <img
                    src={post.photos[0].url}
                    alt="Post"
                    className={styles.postImage}
                  />
                </Link>
                {post.photos.length > 1 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#FFF"
                    className={styles.multiplePhotosIcon}
                  >
                    <path d="M240-400v80h-80q-33 0-56.5-23.5T80-400v-400q0-33 23.5-56.5T160-880h400q33 0 56.5 23.5T640-800v80h-80v-80H160v400h80ZM400-80q-33 0-56.5-23.5T320-160v-400q0-33 23.5-56.5T400-640h400q33 0 56.5 23.5T880-560v400q0 33-23.5 56.5T800-80H400Zm0-80h400v-400H400v400Zm200-200Z" />
                  </svg>
                )}
              </div>
            ))}
        </div>
      </div>
      {isModal && <PostModal />}
    </div>
  );
};
