import React, { useState } from "react";
import styles from "./ProgressiveImage.module.css";

const ProgressiveImage = ({ src, alt, className, onLoad, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = (e) => {
    setIsLoading(false);
    if (onLoad) {
      onLoad(e);
    }
  };

  return (
    <div className={styles.imageContainer}>
      {isLoading && <div className={styles.loading} />}
      <img
        src={src}
        alt={alt}
        className={`${styles.image} ${className}`}
        onLoad={handleImageLoad}
        {...props}
      />
    </div>
  );
};

export default ProgressiveImage;
