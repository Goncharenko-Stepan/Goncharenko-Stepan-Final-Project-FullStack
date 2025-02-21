import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getRandomPosts } from "../../utils/apiUtils/postApi.js";
import useScrollToTop from "../../utils/customHooks.js";
import { SearchPageSkeleton } from "../../skeletons/SearchPageSkeleton/SearchPageSkeleton.jsx";
import styles from "./ExplorePage.module.css";

export const ExplorePage = () => {
  // Состояние для хранения постов
  const [photos, setPhotos] = useState([]);
  // Флаг для предотвращения одновременных запросов
  const [isFetching, setIsFetching] = useState(false);
  // Флаг для начальной загрузки данных
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  // Ссылка на элемент для бесконечной прокрутки
  const loadMoreRef = useRef(null);

  // Хук для прокрутки страницы вверх при монтировании компонента
  useScrollToTop();

  // Функция загрузки постов
  const loadPosts = async () => {
    if (isFetching) return; // Если уже загружаем, выходим
    setIsFetching(true);
    try {
      // Определяем количество постов для загрузки: 20 для мобильных, 10 для остальных
      const fetchCount =
        window.innerHeight > window.innerWidth && photos.length === 0 ? 20 : 10;
      const result = await getRandomPosts(fetchCount);
      setPhotos((prevPosts) => [...prevPosts, ...result]);
    } catch (error) {
      console.error("Ошибка получения постов:", error);
    } finally {
      setIsFetching(false);
      setIsInitialLoading(false);
    }
  };

  // Начальная загрузка постов
  useEffect(() => {
    if (isInitialLoading) {
      loadPosts();
    }
  }, [isInitialLoading]);

  // Бесконечная прокрутка: наблюдаем за элементом loadMoreRef
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadPosts();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [photos, isFetching]);

  // Функция для группировки постов по 5 элементов
  const getBlocks = () => {
    const blocks = [];
    for (let i = 0; i < photos.length; i += 5) {
      blocks.push(photos.slice(i, i + 5));
    }
    return blocks;
  };

  // Если данные ещё загружаются, показываем скелетон
  if (isInitialLoading) return <SearchPageSkeleton />;

  return (
    <div className={styles.container}>
      {getBlocks().map((block, blockIndex) => (
        <div key={blockIndex} className={styles.grid}>
          {block.map((post, postIndex) => (
            <Link
              key={post._id}
              to={`/post/${post._id}`}
              className={`${styles.post} ${
                (blockIndex % 2 === 0 && postIndex === 0) ||
                (blockIndex % 2 !== 0 && postIndex === 4)
                  ? styles.large
                  : ""
              }`}
            >
              {post.photos && post.photos[0] ? (
                <img
                  src={post.photos[0].url}
                  alt="Post"
                  className={styles.image}
                />
              ) : (
                <div>No Image</div>
              )}
            </Link>
          ))}
        </div>
      ))}
      {/* Элемент для отслеживания конца страницы */}
      <div ref={loadMoreRef} className={styles.loadMoreTrigger}></div>
    </div>
  );
};
