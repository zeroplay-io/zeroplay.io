import React, { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { translate } from "@docusaurus/core/lib/client/exports/Translate";
import ProgressiveImage from "./ProgressiveImage";
import styles from "./GameShowcase.module.css";

interface StoreLinks {
  ios?: string;
  "ios-china"?: string;
  "google-play"?: string;
  amazon?: string;
  macAppStore?: string;
  microsoft?: string;
  facebook?: string;
  galaxyStore?: string;
  appGallery?: string;
  aptoide?: string;
  zeroplay?: string;
  "taptap-cn"?: string;
}

interface SocialMedia {
  enabled?: boolean;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

interface GameData {
  title: string;
  subtitle?: string;
  description: string;
  icon: string;
  videoUrl?: string;
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
  const appStoreLink = stores.ios || stores["ios-china"];
  const hasVideo = Boolean(videoUrl);
  const previewImage = screenshots[0];
  const [isVideoLoading, setIsVideoLoading] = useState(() => hasVideo);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenshotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollAnimationFrame = useRef<number | null>(null);
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const dragMoved = useRef(false);

  // Scroll handling for screenshot carousel
  const updateScrollMetrics = useCallback(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const maxScrollLeft = container.scrollWidth - containerWidth;
    const containerCenter = scrollLeft + containerWidth / 2;

    const nextCanScrollLeft = scrollLeft > 24;
    const nextCanScrollRight = scrollLeft < maxScrollLeft - 24;

    setCanScrollLeft((prev) =>
      prev === nextCanScrollLeft ? prev : nextCanScrollLeft
    );
    setCanScrollRight((prev) =>
      prev === nextCanScrollRight ? prev : nextCanScrollRight
    );

    let closestIndex = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;

    screenshotRefs.current.forEach((item, index) => {
      if (!item) {
        return;
      }
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const distance = Math.abs(itemCenter - containerCenter);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveScreenshot((prev) =>
      prev === closestIndex ? prev : closestIndex
    );
  }, []);

  const handleScroll = () => {
    if (scrollAnimationFrame.current) {
      cancelAnimationFrame(scrollAnimationFrame.current);
    }
    scrollAnimationFrame.current = window.requestAnimationFrame(
      updateScrollMetrics
    );
  };

  const scrollToScreenshot = useCallback(
    (index: number) => {
      if (!scrollContainerRef.current || screenshots.length === 0) {
        return;
      }

      const safeIndex = Math.max(
        0,
        Math.min(index, screenshots.length - 1)
      );
      const target = screenshotRefs.current[safeIndex];

      if (!target) {
        return;
      }

      const container = scrollContainerRef.current;
      const targetOffset =
        target.offsetLeft +
        target.offsetWidth / 2 -
        container.clientWidth / 2;

      container.scrollTo({
        left: targetOffset,
        behavior: "smooth",
      });
    },
    [screenshots.length]
  );

  const scrollLeftBtn = () => {
    scrollToScreenshot(activeScreenshot - 1);
  };

  const scrollRightBtn = () => {
    scrollToScreenshot(activeScreenshot + 1);
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartScrollLeft.current = scrollContainerRef.current.scrollLeft;
    dragMoved.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 5) {
      dragMoved.current = true;
    }
    scrollContainerRef.current.scrollLeft = dragStartScrollLeft.current - delta;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const delta = e.clientX - dragStartX.current;
    const threshold = 50;

    if (Math.abs(delta) > threshold) {
      // 拖动超过阈值，切换到上/下一张
      if (delta > 0 && activeScreenshot > 0) {
        scrollToScreenshot(activeScreenshot - 1);
      } else if (delta < 0 && activeScreenshot < screenshots.length - 1) {
        scrollToScreenshot(activeScreenshot + 1);
      }
    }
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    screenshotRefs.current = screenshotRefs.current.slice(
      0,
      screenshots.length
    );
    updateScrollMetrics();
  }, [screenshots.length, updateScrollMetrics]);

  useEffect(() => {
    const handleResize = () => updateScrollMetrics();
    window.addEventListener("resize", handleResize);
    updateScrollMetrics();
    return () => {
      window.removeEventListener("resize", handleResize);
      if (scrollAnimationFrame.current) {
        cancelAnimationFrame(scrollAnimationFrame.current);
      }
    };
  }, [updateScrollMetrics]);

  useEffect(() => {
    if (!hasVideo) {
      setIsVideoLoading(false);
      setHasPlayedOnce(false);
      return;
    }

    setIsVideoLoading(true);

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
  }, [hasVideo]);

  const iconAlt = translate(
    {
      id: "game.showcase.iconAlt",
      message: "{title} icon",
      description: "Alt text for the game icon in the showcase component",
    },
    { title },
  );
  const scrollLeftLabel = translate({
    id: "game.showcase.carousel.prev",
    message: "Scroll left",
    description: "Aria-label for scrolling left in the landscape carousel",
  });
  const scrollRightLabel = translate({
    id: "game.showcase.carousel.next",
    message: "Scroll right",
    description: "Aria-label for scrolling right in the landscape carousel",
  });
  const screenshotsListLabel = translate(
    {
      id: "game.showcase.screenshots.label",
      message: "{title} screenshots",
      description: "Aria-label for the landscape screenshots list",
    },
    { title },
  );
  const socialTitle = translate(
    {
      id: "game.showcase.social.title",
      message: "Sign up for {title} news",
      description: "Heading for the social media section on game detail pages",
    },
    { title },
  );
  const previewAlt = translate(
    {
      id: "game.showcase.screenshot.alt",
      message: "{title} screenshot {index}",
      description: "Alt text for a screenshot displayed in the landscape carousel",
    },
    { title, index: 1 },
  );

  return (
    <div className={styles.gameShowcase}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        {/* Video with Device Frame */}
        <div className={`${styles.videoContainer} ${!isVideoLoading ? styles.loaded : ''}`}>
          <div className={styles.videoWrapper}>
            {hasVideo ? (
              <>
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
              </>
            ) : previewImage ? (
              <img
                src={previewImage}
                alt={previewAlt}
                className={styles.video}
                loading="lazy"
              />
            ) : null}
          </div>
        </div>

        {/* Game Info */}
        <div className={styles.gameInfo}>
          <div className={styles.titleRow}>
            <img src={icon} alt={iconAlt} className={styles.gameIcon} />
            <div className={styles.titleGroup}>
              <h1 className={styles.title}>{title}</h1>
              <p className={styles.subtitle}>{game.subtitle || ''}</p>
            </div>
          </div>

          {/* Store Links */}
          <div className={styles.storeLinksContainer}>
            <div className={styles.storeLinksRow}>
              {appStoreLink && (
                <a href={appStoreLink} target="_blank" rel="noopener noreferrer">
                  <img src="/img/stores/app-store.svg" alt="App Store" />
                </a>
              )}
              {stores["google-play"] && (
                <a
                  href={stores["google-play"]}
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
              {stores.zeroplay && (
                <a href={stores.zeroplay} target="_blank" rel="noopener noreferrer">
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
          <h3 className={styles.socialTitle}>{socialTitle}</h3>
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

      {/* Screenshots Section - Horizontal Scroll Carousel */}
      {screenshots.length > 0 && (
        <div className={styles.screenshotsSection}>
          <div className={styles.screenshotsCarousel}>
            {canScrollLeft && (
              <button
                type="button"
                onClick={scrollLeftBtn}
                className={`${styles.scrollButton} ${styles.scrollButtonLeft}`}
                aria-label={scrollLeftLabel}
                disabled={!canScrollLeft}
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
              className={`${styles.screenshotsContainer} ${isDragging ? styles.dragging : ''}`}
              onScroll={handleScroll}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onDragStart={(e) => e.preventDefault()}
              role="list"
              aria-label={screenshotsListLabel}
            >
              {screenshots.map((screenshot, index) => (
                <div
                  key={`${screenshot}-${index}`}
                  className={styles.screenshotItem}
                  ref={(element) => {
                    screenshotRefs.current[index] = element;
                  }}
                  onClick={() => {
                    if (!dragMoved.current) {
                      scrollToScreenshot(index);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      scrollToScreenshot(index);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={translate(
                    {
                      id: "game.showcase.screenshots.view",
                      message: "View screenshot {index}",
                      description:
                        "Aria-label for selecting a screenshot in the carousel",
                    },
                    { index: index + 1 },
                  )}
                >
                  <ProgressiveImage
                    src={screenshot}
                    alt={translate(
                      {
                        id: "game.showcase.screenshot.alt",
                        message: "{title} screenshot {index}",
                        description:
                          "Alt text for a screenshot displayed in the landscape carousel",
                      },
                      { title, index: index + 1 },
                    )}
                    className={styles.screenshot}
                  />
                </div>
              ))}
            </div>

            <div className={styles.paginationDots} aria-hidden="true">
              {screenshots.map((_, index) => (
                <span
                  key={`dot-${index}`}
                  className={clsx(
                    styles.paginationDot,
                    activeScreenshot === index && styles.paginationDotActive
                  )}
                />
              ))}
            </div>

            {canScrollRight && (
              <button
                type="button"
                onClick={scrollRightBtn}
                className={`${styles.scrollButton} ${styles.scrollButtonRight}`}
                aria-label={scrollRightLabel}
                disabled={!canScrollRight}
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

export default GameShowcase;
