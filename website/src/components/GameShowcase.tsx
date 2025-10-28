import React, { useEffect, useRef, useState } from "react";
import ProgressiveImage from "./ProgressiveImage";
import styles from "./GameShowcase.module.css";

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

interface GameShowcaseProps {
  game: GameData;
}

const GameShowcase: React.FC<GameShowcaseProps> = ({ game }) => {
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [screenshotDimensions, setScreenshotDimensions] = useState<{width: number, height: number} | null>(null);
  const screenshotWrapperRef = useRef<HTMLDivElement>(null);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);

  const handlePrevClick = () => {
    setCurrentIndex((i) => (i - 1 + screenshots.length) % screenshots.length);
  };

  const handleNextClick = () => {
    setCurrentIndex((i) => (i + 1) % screenshots.length);
  };

  const handleFirstImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    if (!screenshotDimensions && screenshotWrapperRef.current) {
      const img = event.currentTarget;
      setScreenshotDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    }
  };

  const videoRef = useRef(null);

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

  return (
    <div className={styles.gameShowcase}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        {/* Video with Device Frame */}
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
          <div className={styles.titleRow}>
            <img src={icon} alt={`${title} Icon`} className={styles.gameIcon} />
            <div className={styles.titleGroup}>
              <h1 className={styles.title}>{title}</h1>
              <p className={styles.subtitle}>{game.subtitle || ''}</p>
            </div>
          </div>

          {/* Store Links */}
          <div className={styles.storeLinksContainer}>
            <div className={styles.storeLinksRow}>
              {stores.appStore && (
                <a href={stores.appStore} target="_blank" rel="noopener noreferrer">
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
                <a href={stores.amazon} target="_blank" rel="noopener noreferrer">
                  <img src="/img/stores/amazon.png" alt="Amazon" />
                </a>
              )}
              {stores.macAppStore && (
                <a
                  href={stores.macAppStore}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/img/stores/mac-app-store.png" alt="Mac App Store" />
                </a>
              )}
              {stores.microsoft && (
                <a
                  href={stores.microsoft}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/img/stores/microsoft.png" alt="Microsoft Store" />
                </a>
              )}
              {stores.h5 && (
                <a href={stores.h5} target="_blank" rel="noopener noreferrer">
                  <img src="/img/stores/h5.svg" alt="Play on Web" />
                </a>
              )}
            </div>

            {/* Store Links - Second Row */}
            <div className={styles.storeLinksRow}>
              {stores.facebook && (
                <a href={stores.facebook} target="_blank" rel="noopener noreferrer">
                  <img src="/img/stores/facebook.png" alt="Facebook Gaming" />
                </a>
              )}
              {stores.galaxyStore && (
                <a
                  href={stores.galaxyStore}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/img/stores/galaxy-store.png" alt="Galaxy Store" />
                </a>
              )}
              {stores.appGallery && (
                <a
                  href={stores.appGallery}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/img/stores/app-gallery.png" alt="AppGallery" />
                </a>
              )}
              {stores.aptoide && (
                <a href={stores.aptoide} target="_blank" rel="noopener noreferrer">
                  <img src="/img/stores/aptoide.png" alt="Aptoide" />
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <p className={styles.description}>{description}</p>
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

      {/* Screenshots Section */}
      {screenshots.length > 0 && (
        <div className={styles.screenshotsSection}>
          <div className={styles.screenshotsContainer}>
            <div
              ref={screenshotWrapperRef}
              className={styles.screenshotWrapper}
              style={screenshotDimensions ? {
                aspectRatio: `${screenshotDimensions.width} / ${screenshotDimensions.height}`
              } : undefined}
            >
          {screenshots.length > 0 && (
            <ProgressiveImage
              src={screenshots[currentIndex]}
              alt={`${title} Screenshot ${currentIndex + 1}`}
              className={styles.screenshot}
              onLoad={currentIndex === 0 ? handleFirstImageLoad : undefined}
            />
          )}

          {/* 添加切换按钮 */}
          {screenshots.length > 1 && (
            <button
              onClick={handlePrevClick}
              className={`${styles.navButton} ${styles.prevButton}`}
              aria-label="Previous image"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {screenshots.length > 1 && (
            <button
              onClick={handleNextClick}
              className={`${styles.navButton} ${styles.nextButton}`}
              aria-label="Next image"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

              {/* 添加图片计数器 */}
              <div className={styles.counter}>
                {currentIndex + 1} / {screenshots.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameShowcase;
