import React from "react";
import Layout from "@theme/Layout";
import GameCard from "@site/src/components/GameCard";
import gamesData from "@site/src/data/games.json";
import styles from "./index.module.css";

export default function GamesPage(): JSX.Element {
  return (
    <Layout title="Games" description="Explore our games">
      <div className={styles.gamesPage}>
        <div className={styles.header}>
          <h1 className={styles.title}>Our Games</h1>
        </div>
        <div className={styles.gamesListContainer}>
          {gamesData.games.map((game, index) => (
            <GameCard key={game.id || index} game={game} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
