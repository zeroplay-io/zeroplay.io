import React, { useMemo } from "react";
import Layout from "@theme/Layout";
import { useLocation } from "@docusaurus/router";
import GameCard from "@site/src/components/GameCard";
import gamesData from "@site/src/data/games.json";
import styles from "./index.module.css";

export default function GamesPage(): JSX.Element {
  const location = useLocation();

  const filteredGames = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const excludeTokens: string[] = [];

    params.getAll("exclude").forEach((value) => {
      value
        .split(",")
        .map((token) => token.trim().toLowerCase())
        .filter(Boolean)
        .forEach((token) => excludeTokens.push(token));
    });

    if (excludeTokens.length === 0) {
      return gamesData.games;
    }

    const excludeSet = new Set(excludeTokens);
    return gamesData.games.filter(
      (game) => !excludeSet.has(game.id.toLowerCase()),
    );
  }, [location.search]);

  return (
    <Layout title="Games" description="Explore our games">
      <div className={styles.gamesPage}>
        <div className={styles.header}>
          <h1 className={styles.title}>Our Games</h1>
        </div>
        <div className={styles.gamesListContainer}>
          {filteredGames.length > 0 ? (
            filteredGames.map((game, index) => (
              <GameCard key={game.id || index} game={game} />
            ))
          ) : (
            <div className={styles.emptyState}>
              No games to display with the current filter.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
