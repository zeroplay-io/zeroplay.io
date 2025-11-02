import React, { useState } from "react";
import Link from "@docusaurus/Link";
import styles from "./GameCard.module.css";

interface GameCardData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  banner: string;
}

interface GameCardProps {
  game: GameCardData;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const [isBannerLoaded, setIsBannerLoaded] = useState(false);

  return (
    <Link to={`/games/${game.id}`} className={styles.cardLink}>
      <div
        className={`${styles.card} ${
          isBannerLoaded ? styles.cardLoaded : styles.cardLoading
        }`}
      >
        <img
          src={game.banner}
          alt={`${game.title} banner`}
          className={styles.banner}
          loading="lazy"
          onLoad={() => setIsBannerLoaded(true)}
          onError={() => setIsBannerLoaded(false)}
        />
        {!isBannerLoaded && (
          <div className={styles.bannerPlaceholder} aria-hidden="true" />
        )}
        <div className={styles.overlay} />
        <div className={styles.info}>
          <div className={styles.iconContainer}>
            <img
              src={game.icon}
              alt={game.title}
              className={styles.icon}
              loading="lazy"
            />
          </div>
          <div className={styles.content}>
            <h2 className={styles.title}>{game.title}</h2>
            <p className={styles.subtitle}>{game.subtitle}</p>
            <p className={styles.description}>{game.description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
