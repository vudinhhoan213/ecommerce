import React from "react";
import styles from "./RatingStars.module.css";

interface RatingStarsProps {
  rating?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating = 5 }) => {
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
