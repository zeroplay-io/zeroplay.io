import React from "react";
import Link from "@docusaurus/Link";
import styles from "./GameCard.module.css";

interface GameCardData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

interface GameCardProps {
  game: GameCardData;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <Link to={`/games/${game.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <img src={game.icon} alt={game.title} className={styles.icon} />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>{game.title}</h2>
          <p className={styles.subtitle}>{game.subtitle}</p>
          <p className={styles.description}>{game.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
