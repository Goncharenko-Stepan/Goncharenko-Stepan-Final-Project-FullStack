import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getRandomPosts } from "../../utils/apiUtils/postApi.js";
import useScrollToTop from "../../utils/customHooks.js";
import { SearchPageSkeleton } from "../../skeletons/SearchPageSkeleton/SearchPageSkeleton.jsx";
import styles from "./ExplorePage.module.css";

export const ExplorePage = () => {
  const [photos, setPhotos] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const loadMoreRef = useRef(null);
  useScrollToTop();

  const loadPosts = async () => {
    try {
      if (isFetching) return;
      setIsFetching(true);
      const fetchCount =
        window.innerHeight > window.innerWidth && photos.length === 0 ? 20 : 10;
      const result = await getRandomPosts(fetchCount);

      setPhotos((prevPosts) => [...prevPosts, ...result]);

      setIsFetching(false);
      setIsInitialLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isInitialLoading) {
      loadPosts();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadPosts();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [photos]);

  const getBlocks = () => {
    const blocks = [];
    for (let i = 0; i < photos.length; i += 5) {
      blocks.push(photos.slice(i, i + 5));
    }
    return blocks;
  };

  if (isInitialLoading) return <SearchPageSkeleton />;

  return (
    <div className={styles.container}>
      {getBlocks().map((block, blockIndex) => (
        <div key={blockIndex} className={styles.grid}>
          {block.map((post, postIndex) => (
            <Link
              to={`/post/${post._id}`}
              key={post._id}
              className={`${styles.post} ${
                (blockIndex % 2 === 0 && postIndex === 0) ||
                (blockIndex % 2 !== 0 && postIndex === 4)
                  ? styles.large
                  : ""
              }`}
            >
              <img
                src={post.photos[0].url}
                alt="Photo"
                className={styles.image}
              />
            </Link>
          ))}
        </div>
      ))}
      <div ref={loadMoreRef} className={styles.loadMoreTrigger}></div>
    </div>
  );
};
