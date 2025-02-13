import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import like from "../../assets/reactionIcons/like.svg";
import comment from "../../assets/reactionIcons/like.svg";
import liked from "../../assets/reactionIcons/liked.svg";
import searchIcon from "../../assets/navIcons/searchIcons/search.svg";
import notificationsIcon from "../../assets/navIcons/notificationIcons/notifications.svg";
import done from "../../assets/done.png";
import logo from "../../assets/logo.svg";
import { SearchModal } from "../../components/SearchModal/SearchModal.jsx";
import { NotificationsModal } from "../../components/NotificationsModal/NotificationsModal.jsx";
import { PhotoCarousel } from "../../components/PhotoCarousel/PhotoCarousel.jsx";
import { HomePageSkeleton } from "../../skeletons/HomePageSkeleton/HomePageSkeleton.jsx";
import { fetchFollowedPosts } from "../../utils/apiUtils/postApi.js";
import { formatDate } from "../../utils/formatFunctions.js";
import {
  onLikePostFromHomepage,
  isLikedByUser,
} from "../../utils/likeFunctions.js";
import styles from "./HomePage.module.css";

export const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { _id, notifications } = useSelector((state) => state.user);
  const location = useLocation();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const result = await fetchFollowedPosts(page);
        if (result && page === 1) setIsInitialLoading(false);
        setPosts((prevPosts) => {
          const newPosts = result?.filter(
            (newPost) => !prevPosts?.some((post) => post._id === newPost._id)
          );
          return newPosts ? [...prevPosts, ...newPosts] : [...prevPosts];
        });
        if (result?.length < 10) setHasMore(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    loadPosts();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasMore]);

  if (posts.length === 0 && !isInitialLoading) {
    return (
      <div className={styles.emptyContainer}>
        <img src={logo} alt="Ichgram" />
        <p className={styles.emptyText}>Follow users to see their posts here</p>
      </div>
    );
  } else if (posts.length === 0) return <HomePageSkeleton />;

  return (
    <div className={styles.container}>
      <div className={styles.mobileHeader}>
        <p className={styles.emptyWidth}></p>
        <p className={styles.headerTitle}>Homepage</p>
        <div className={styles.icons}>
          <img
            src={searchIcon}
            alt="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          />
          <img
            src={notificationsIcon}
            alt="Notifications"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          />
        </div>
      </div>
      {isSearchOpen && (
        <SearchModal
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
        />
      )}
      {isNotificationsOpen && (
        <NotificationsModal
          isNotificationsOpen={isNotificationsOpen}
          setIsNotificationsOpen={setIsNotificationsOpen}
          notifications={notifications}
        />
      )}
      <div className={styles.postsGrid}>
        {posts.map((post) => (
          <div key={post._id} className={styles.postContainer}>
            <Link
              to={`/profile/${post.author.username}`}
              className={styles.postHeader}
            >
              <img
                src={post.author.profile_image}
                alt={post.author.username}
                className={styles.profileImage}
              />
              <p className={styles.username}>{post.author.username}</p>
              <p className={styles.postDate}>
                · {post.createdAt && formatDate(new Date(post.createdAt))}
              </p>
            </Link>
            <Link
              to={`/post/${post._id}`}
              state={{ backgroundLocation: location }}
            >
              {post.photos.length > 1 ? (
                <PhotoCarousel
                  type="home"
                  photos={post.photos.map((photo) => photo.url || "")}
                />
              ) : (
                <img
                  src={post.photos[0].url}
                  alt="Post"
                  className={styles.postImage}
                />
              )}
            </Link>
            <div className={styles.reactions}>
              <img
                src={
                  _id && post.likes && isLikedByUser(post.likes, _id)
                    ? liked
                    : like
                }
                alt="like"
                className={styles.likeIcon}
                onClick={(e) => onLikePostFromHomepage(e, post._id, setPosts)}
              />
              <Link
                to={`/post/${post._id}`}
                state={{ backgroundLocation: location }}
              >
                <img
                  src={comment}
                  alt="comment"
                  className={styles.commentIcon}
                />
              </Link>
            </div>
            <p className={styles.likesCount}>{post.like_count} likes</p>
            <p className={styles.postContent}>
              <span className={styles.bold}>{post.author.username}</span>{" "}
              {post.content}
            </p>
            <p className={styles.comments}>
              View all comments ({post.comments.length})
            </p>
          </div>
        ))}
        <div ref={loadMoreRef} className={styles.loadMoreTrigger}></div>
      </div>
      {!hasMore && (
        <div className={styles.doneContainer}>
          <img src={done} alt="done" className={styles.doneIcon} />
          <p>You've seen all the posts</p>
          <p className={styles.doneText}>
            You have viewed all the posts from followed users
          </p>
        </div>
      )}
    </div>
  );
};
