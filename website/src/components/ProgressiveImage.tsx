import React, { useState, useEffect } from "react";
import styles from "./ProgressiveImage.module.css";

const ProgressiveImage = ({ src, alt, className, onLoad, ...props }) => {
  const [currentSrc, setCurrentSrc] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [firstLoadDone, setFirstLoadDone] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setCurrentSrc("");

    // 生成4种清晰度的图片URL
    const extension = src.match(/\.[^.]+$/)?.[0] || "";
    const baseName = src.replace(/\.[^.]+$/, "");
    const resolutions = ["0.25x", "0.5x", "", "2x"];

    // 加载所有清晰度的图片
    resolutions.forEach((resolution) => {
      const url = resolution ? `${baseName}@${resolution}${extension}` : src;
      const img = new Image();

      img.onload = () => {
        // 如果还没有显示任何图片，或者当前显示的是更低清晰度的图片，则更新
        const currentResolution = currentSrc
          ? currentSrc.match(/@(x\d)/)?.[1]
          : null;
        const currentIndex = currentResolution
          ? resolutions.indexOf(currentResolution)
          : -1;
        const newIndex = resolutions.indexOf(resolution);

        console.log(
          `currentSrc=${currentSrc}, currentIndex=${currentIndex}, newIndex=${newIndex}`
        );
        if (!currentSrc || newIndex > currentIndex) {
          setCurrentSrc(url);
          setIsLoading(false);

          // Call onLoad callback with the image element for the first successful load
          if (!firstLoadDone && onLoad) {
            setFirstLoadDone(true);
            onLoad({ currentTarget: img });
          }
        }
      };

      img.src = url;
    });
  }, [src]);

  return (
    <div className={styles.imageContainer}>
      {isLoading && <div className={styles.loading} />}
      {currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          className={`${styles.image} ${className}`}
          {...props}
        />
      )}
    </div>
  );
};

export default ProgressiveImage;
