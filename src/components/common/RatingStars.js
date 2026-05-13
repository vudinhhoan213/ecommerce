import React from "react";
import styles from "./RatingStars.module.css"; // Import CSS Module dưới dạng một object 'styles'

const RatingStars = ({ rating = 5 }) => {
  return (
    <div className={styles.starsContainer}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={styles.starItem}>
          {index < rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
};

export default RatingStars;
