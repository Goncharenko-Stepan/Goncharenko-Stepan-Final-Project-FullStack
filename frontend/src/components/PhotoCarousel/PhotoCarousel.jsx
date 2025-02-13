import React, { useState } from "react";
import styles from "./PhotoCarousel.module.css";

export const PhotoCarousel = ({
  photos,
  type,
  croppedStyle = false,
  previews,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = (e) => {
    e.preventDefault();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const getAspectRatio = () => {
    if (!croppedStyle || !previews || !previews[currentIndex]) return "";

    const { width, height } = previews[currentIndex];

    const widthThreshold = 1.5;
    const heightThreshold = 1.5;

    if (width / height > widthThreshold) {
      return "16 / 9";
    } else if (height / width > heightThreshold) {
      return "3 / 4";
    } else {
      return "";
    }
  };

  const currentImageAspectRatio = getAspectRatio();

  return (
    <div className={`${styles.carousel} ${type ? styles.fixedHeight : ""}`}>
      {croppedStyle ? (
        <div
          className={styles.croppedContainer}
          style={{ aspectRatio: currentImageAspectRatio }}
        >
          <img
            src={photos[currentIndex]}
            alt={`Photo ${currentIndex + 1}`}
            className={styles.croppedImage}
          />
        </div>
      ) : (
        <img
          src={photos[currentIndex]}
          alt={`Photo ${currentIndex + 1}`}
          className={styles.image}
        />
      )}

      {photos.length > 1 && (
        <>
          <button
            className={`${styles.navButton} ${styles.left}`}
            onClick={handlePrev}
          >
            &#8249;
          </button>
          <button
            className={`${styles.navButton} ${styles.right}`}
            onClick={handleNext}
          >
            &#8250;
          </button>
        </>
      )}
    </div>
  );
};
