import React, { useState } from "react";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import { translate } from "@docusaurus/core/lib/client/exports/Translate";
import styles from "./GameCard.module.css";

interface GameCardData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  banner: string;
  deeplink?: string;
  stores?: {
    appStore?: string;
    googlePlay?: string;
    h5?: string;
  };
}

interface GameCardProps {
  game: GameCardData;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const [isBannerLoaded, setIsBannerLoaded] = useState(false);
  const primaryLink =
    game.deeplink ||
    game.stores?.appStore ||
    game.stores?.googlePlay ||
    game.stores?.h5;
  const downloadLabel = translate({
    id: "game.button.get",
    message: "Get",
    description: "Label for the game download button",
  });
  const downloadAriaLabel = translate(
    {
      id: "game.button.get.aria",
      message: "Get {title}",
      description: "Aria-label for the game download button",
    },
    { title: game.title },
  );
  const bannerAlt = translate(
    {
      id: "game.banner.alt",
      message: "{title} banner",
      description: "Alt text for the game banner image",
    },
    { title: game.title },
  );

  return (
    <Link to={`/games/${game.id}`} className={styles.cardLink}>
      <article className={styles.card}>
        <div
          className={`${styles.bannerSection} ${
            isBannerLoaded ? styles.bannerLoaded : styles.bannerLoading
          }`}
        >
          <img
            src={game.banner}
            alt={bannerAlt}
            className={styles.banner}
            loading="lazy"
            onLoad={() => setIsBannerLoaded(true)}
            onError={() => setIsBannerLoaded(false)}
          />
          {!isBannerLoaded && (
            <div className={styles.bannerPlaceholder} aria-hidden="true" />
          )}
          <div className={styles.bannerOverlay} />
        </div>
        <div className={styles.metadata}>
          <div className={styles.iconContainer}>
            <img
              src={game.icon}
              alt={game.title}
              className={styles.icon}
              loading="lazy"
            />
          </div>
          <div className={styles.content}>
            <div className={styles.headingRow}>
              <div className={styles.textGroup}>
                <h2 className={styles.title}>{game.title}</h2>
                <p className={styles.subtitle}>{game.subtitle}</p>
              </div>
              {primaryLink && (
                <a
                  href={primaryLink}
                  className={styles.downloadButton}
                  title={downloadLabel}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  aria-label={downloadAriaLabel}
                >
                  <Translate id="game.button.get">Get</Translate>
                </a>
              )}
            </div>
            <p className={styles.description}>{game.description}</p>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default GameCard;
