import React, { useEffect, useRef, useState } from "react";
import styles from "./ProgressiveImage.module.css";

interface ProgressiveImageProps
  extends Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    "src" | "alt" | "className"
  > {
  src: string;
  alt: string;
  className?: string;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  className = "",
  onLoad,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    if (onLoad) {
      onLoad(event);
    }
  };

  const handleImageError = () => {
    // Hide loading spinner even if image fails to load
    setIsLoading(false);
  };

  // Check if image is already loaded (cached) or failed
  useEffect(() => {
    const imageElement = imgRef.current;
    if (!imageElement) {
      return;
    }

    if (imageElement.complete) {
      // Image is already loaded (from cache or already rendered)
      setIsLoading(false);

      if (onLoad && imageElement.naturalWidth > 0) {
        const syntheticEvent = {
          currentTarget: imageElement,
          target: imageElement,
        } as unknown as React.SyntheticEvent<HTMLImageElement>;
        onLoad(syntheticEvent);
      }
    }
  }, [src, onLoad]);

  const combinedClassName = [styles.image, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.imageContainer}>
      {isLoading && <div className={styles.loading} />}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={combinedClassName}
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...props}
      />
    </div>
  );
};

export default ProgressiveImage;
