import React, { useState, useEffect } from "react";

const ProgressiveImage = ({ src, alt, className, ...props }) => {
  const [currentSrc, setCurrentSrc] = useState("");

  useEffect(() => {
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
        }
      };

      img.src = url;
    });
  }, [src]);

  // 如果没有任何图片加载成功，返回 null
  if (!currentSrc) {
    return null;
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={`w-full h-full object-cover transition-[filter] duration-300 ${className}`}
      {...props}
    />
  );
};

export default ProgressiveImage;
