import React from "react";
import styles from "./SearchPageSkeleton.module.css";

export const SearchPageSkeleton = () => {
  return (
    <div className={styles.container}>
      {new Array(3).fill(0).map((_, ind) => (
        <div key={ind} className={styles.grid}>
          {new Array(5).fill(0).map((_, i) => (
            <div
              key={i}
              className={`${styles.gridItem} ${
                (ind % 2 === 0 && i === 0) || (ind % 2 !== 0 && i === 4)
                  ? styles.rowSpan
                  : styles.regularItem
              }`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};
