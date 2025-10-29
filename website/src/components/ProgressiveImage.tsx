import React, { useState, useRef, useEffect } from "react";
import styles from "./ProgressiveImage.module.css";

const ProgressiveImage = ({ src, alt, className, onLoad, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef(null);

  const handleImageLoad = (e) => {
    setIsLoading(false);
    if (onLoad) {
      onLoad(e);
    }
  };

  const handleImageError = () => {
    // Hide loading spinner even if image fails to load
    setIsLoading(false);
  };

  // Check if image is already loaded (cached) or failed
  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      if (img.complete) {
        // Image is already loaded (from cache or already rendered)
        setIsLoading(false);
        // Trigger onLoad callback if provided
        if (onLoad && img.naturalWidth > 0) {
          onLoad({ currentTarget: img });
        }
      }
    }
  }, [src, onLoad]);

  return (
    <div className={styles.imageContainer}>
      {isLoading && <div className={styles.loading} />}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`${styles.image} ${className}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...props}
      />
    </div>
  );
};

export default ProgressiveImage;
