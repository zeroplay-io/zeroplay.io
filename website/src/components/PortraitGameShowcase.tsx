import React, { useEffect, useRef, useState } from "react";
import ProgressiveImage from "./ProgressiveImage";
import styles from "./PortraitGameShowcase.module.css";

interface StoreLinks {
  appStore?: string;
  googlePlay?: string;
  amazon?: string;
  macAppStore?: string;
  microsoft?: string;
  facebook?: string;
  galaxyStore?: string;
  appGallery?: string;
  aptoide?: string;
  h5?: string;
}

interface SocialMedia {
  enabled?: boolean;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

interface GameData {
  title: string;
  description: string;
  icon: string;
  videoUrl: string;
  posterUrl?: string;
  stores?: StoreLinks;
  socialMedia?: SocialMedia;
  screenshots?: string[];
}

interface PortraitGameShowcaseProps {
  game: GameData;
}

const PortraitGameShowcase: React.FC<PortraitGameShowcaseProps> = ({
  game,
}) => {
  const {
    title,
    description,
    icon,
    videoUrl,
    posterUrl,
    stores = {},
    socialMedia = {},
    screenshots = [],
  } = game;
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video auto-play logic
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      const handlePlay = () => {
        console.log("Video play event fired");
        setHasPlayedOnce(true);
      };

      const tryPlay = () => {
        video
          .play()
          .then(() => {
            console.log("Video resumed playing.");
            setIsVideoLoading(false);
          })
          .catch((error) => {
            console.log("Video play failed, retrying...", error);
            setTimeout(tryPlay, 1000);
          });
      };

      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          setTimeout(tryPlay, 1000);
        }
      };

      const handleLoadedData = () => {
        setIsVideoLoading(false);
      };

      video.addEventListener('play', handlePlay);
      video.oncanplaythrough = tryPlay;
      video.addEventListener('loadeddata', handleLoadedData);

      const handleFocus = () => {
        console.log("Page has focus");
        tryPlay();
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("focus", handleFocus);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        window.removeEventListener("focus", handleFocus);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('play', handlePlay);
      };
    }
  }, []);

  // Scroll handling for screenshot carousel
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  const scrollLeftBtn = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -320,
        behavior: "smooth",
      });
    }
  };

  const scrollRightBtn = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 320,
        behavior: "smooth",
      });
    }
  };

  // Mouse drag to scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftPos(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = "grabbing";
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab";
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // 拖动速度倍数
    scrollContainerRef.current.scrollLeft = scrollLeftPos - walk;
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftPos(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const canScrollLeft = scrollPosition > 10;
  const canScrollRight =
    scrollContainerRef.current &&
    scrollPosition <
      scrollContainerRef.current.scrollWidth -
        scrollContainerRef.current.clientWidth -
        10;

  return (
    <div className={styles.portraitGameShowcase}>
      {/* Header Section with Video and Info */}
      <div className={styles.headerSection}>
        <div className={styles.contentWrapper}>
          {/* Video Container - Portrait oriented */}
          <div className={`${styles.videoContainer} ${!isVideoLoading ? styles.loaded : ''}`}>
            <div className={styles.videoWrapper}>
              {isVideoLoading && <div className={styles.videoLoading} />}
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                poster={!hasPlayedOnce && posterUrl ? posterUrl : undefined}
                className={`${styles.video} ${isVideoLoading ? styles.loading : ''}`}
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Game Info */}
          <div className={styles.gameInfo}>
            {/* Icon and Title Section */}
            <div className={styles.titleRow}>
              <img
                src={icon}
                alt={`${title} Icon`}
                className={styles.gameIcon}
              />
              <div className={styles.titleGroup}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.subtitle}>{game.subtitle || ''}</p>
              </div>
            </div>

            {/* Store Links */}
            <div className={styles.storeLinksContainer}>
              <div className={styles.storeLinksRow}>
                {stores.appStore && (
                  <a
                    href={stores.appStore}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/img/stores/app-store.svg" alt="App Store" />
                  </a>
                )}
                {stores.googlePlay && (
                  <a
                    href={stores.googlePlay}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/img/stores/google-play.png" alt="Google Play" />
                  </a>
                )}
                {stores.amazon && (
                  <a
                    href={stores.amazon}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/img/stores/amazon.png" alt="Amazon" />
                  </a>
                )}
                {stores.macAppStore && (
                  <a
                    href={stores.macAppStore}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/img/stores/mac-app-store.png"
                      alt="Mac App Store"
                    />
                  </a>
                )}
                {stores.microsoft && (
                  <a
                    href={stores.microsoft}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/img/stores/microsoft.png"
                      alt="Microsoft Store"
                    />
                  </a>
                )}
                {stores.h5 && (
                  <a href={stores.h5} target="_blank" rel="noopener noreferrer">
                    <img src="/img/stores/h5.svg" alt="Play on Web" />
                  </a>
                )}
              </div>

              <div className={styles.storeLinksRow}>
                {stores.facebook && (
                  <a
                    href={stores.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/img/stores/facebook.png"
                      alt="Facebook Gaming"
                    />
                  </a>
                )}
                {stores.galaxyStore && (
                  <a
                    href={stores.galaxyStore}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/img/stores/galaxy-store.png"
                      alt="Galaxy Store"
                    />
                  </a>
                )}
                {stores.appGallery && (
                  <a
                    href={stores.appGallery}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/img/stores/app-gallery.png"
                      alt="AppGallery"
                    />
                  </a>
                )}
                {stores.aptoide && (
                  <a
                    href={stores.aptoide}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/img/stores/aptoide.png" alt="Aptoide" />
                  </a>
                )}
              </div>
            </div>

            {/* Description */}
            <p className={styles.description}>{description}</p>
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      {socialMedia.enabled && (
        <div className={styles.socialMediaContainer}>
          <h3 className={styles.socialTitle}>Sign up for {title} news</h3>
          <div className={styles.socialLinks}>
            {socialMedia.facebook && (
              <a
                href={socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            )}
            {socialMedia.instagram && (
              <a
                href={socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            )}
            {socialMedia.twitter && (
              <a
                href={socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            )}
          </div>
        </div>
      )}

      {/* Horizontal Scrolling Screenshots - App Store Style */}
      {screenshots.length > 0 && (
        <div className={styles.screenshotsSection}>
          <div className={styles.screenshotsCarousel}>
            {canScrollLeft && (
              <button
                onClick={scrollLeftBtn}
                className={`${styles.scrollButton} ${styles.scrollButtonLeft}`}
                aria-label="Scroll left"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}

            <div
              ref={scrollContainerRef}
              className={styles.screenshotsContainer}
              onScroll={handleScroll}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
            >
              {screenshots.map((screenshot, index) => (
                <div key={index} className={styles.screenshotItem}>
                  <ProgressiveImage
                    src={screenshot}
                    alt={`${title} Screenshot ${index + 1}`}
                    className={styles.screenshot}
                  />
                </div>
              ))}
            </div>

            {canScrollRight && (
              <button
                onClick={scrollRightBtn}
                className={`${styles.scrollButton} ${styles.scrollButtonRight}`}
                aria-label="Scroll right"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortraitGameShowcase;
