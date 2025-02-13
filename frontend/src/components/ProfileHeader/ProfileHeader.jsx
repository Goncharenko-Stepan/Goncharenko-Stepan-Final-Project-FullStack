import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"; // используем "react-router-dom"
import website_link from "../../assets/website_link.svg";
import { selectIfFollowing } from "../../store/selectors/userSelector.js";
import { followUser, unfollowUser } from "../../utils/apiUtils/userApi.js";
import { addFollowing, removeFollowing } from "../../store/slices/userSlice.js";
import styles from "./ProfileHeader.module.css"; // Подключаем модульные стили

export const ProfileHeader = ({ user, profileUsername }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const isFollowingFromRedux = useSelector((state) =>
    user ? selectIfFollowing(state, user._id) : false
  );

  useEffect(() => {
    if (user) {
      setIsFollowing(isFollowingFromRedux);
    }
  }, [isFollowingFromRedux, user]);

  const ifUser = user ? user.username === profileUsername : false;
  const dispatch = useDispatch();

  if (!user) {
    return <div>Loading...</div>;
  }

  const onFollow = async () => {
    try {
      if (!user) return;
      const condensedUser = await followUser(user.username);
      dispatch(addFollowing(condensedUser));
      setIsFollowing(true);
    } catch (e) {
      console.error("Error following user", e);
    }
  };

  const onUnfollow = async () => {
    try {
      if (!user) return;
      const condensedUser = await unfollowUser(user.username);
      dispatch(removeFollowing(condensedUser));
      setIsFollowing(false);
    } catch (e) {
      console.error("Error unfollowing user", e);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <img
          className={styles.profileImage}
          src={user?.profile_image}
          alt="Profile pic"
        />
        <div>
          <div className="flex flex-col items-start md:flex-row md:items-center gap-2 mb-3">
            <p className="text-lg mr-3">{user?.username}</p>
            {!ifUser ? (
              <div className="flex gap-2 mb-4">
                {!isFollowing && (
                  <button className={styles.followButton} onClick={onFollow}>
                    Follow
                  </button>
                )}
                {isFollowing && (
                  <button
                    className={styles.unfollowButton}
                    onClick={onUnfollow}
                  >
                    Unfollow
                  </button>
                )}
                <Link
                  to={`/messages/${user.username}`}
                  className={styles.messageButton}
                >
                  <p className="text-center pt-1">Message</p>
                </Link>
              </div>
            ) : (
              <Link to={`${window.location.pathname}/edit`}>
                <button className={styles.profileEditButton}>
                  Edit profile
                </button>
              </Link>
            )}
          </div>
          <div className={styles.stats}>
            <p>
              <b>{user?.posts.length}</b> posts
            </p>
            <p>
              <b>{user?.followers.length}</b> followers
            </p>
            <p>
              <b>{user?.followings.length}</b> following
            </p>
          </div>
          {user.bio ? (
            <p className="hidden md:block text-sm w-[434px] break-words">
              {user.bio}
            </p>
          ) : (
            <p className="hidden md:block text-sm text-darkgray">No bio yet</p>
          )}
          {user.website && (
            <div className={styles.websiteLink}>
              <img src={website_link} alt="Website" />
              <a
                href={
                  user?.website?.startsWith("http")
                    ? user.website
                    : `https://${user.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {user?.website}
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="md:hidden pl-6 text-sm w-[90vw] break-words">
        {user?.bio && <p>{user?.bio}</p>}
        {user?.website && (
          <div className={styles.websiteLink}>
            <img src={website_link} alt="Website" />
            <p>{user?.website}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileHeader;
