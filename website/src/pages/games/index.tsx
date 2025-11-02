import React, { useMemo } from "react";
import Layout from "@theme/Layout";
import Translate from "@docusaurus/Translate";
import { translate } from "@docusaurus/core/lib/client/exports/Translate";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import GameCard from "@site/src/components/GameCard";
import { getLocalizedGames } from "@site/src/utils/i18nGames";
import styles from "./index.module.css";

export default function GamesPage(): JSX.Element {
  const location = useLocation();
  const { i18n } = useDocusaurusContext();
  const localizedGames = useMemo(
    () => getLocalizedGames(i18n.currentLocale),
    [i18n.currentLocale],
  );

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
      return localizedGames;
    }

    const excludeSet = new Set(excludeTokens);
    return localizedGames.filter((game) => !excludeSet.has(game.id.toLowerCase()));
  }, [localizedGames, location.search]);

  const pageTitle = translate({
    id: "games.page.meta.title",
    message: "Games",
    description: "Title for the games page metadata",
  });
  const pageDescription = translate({
    id: "games.page.meta.description",
    message: "Explore our games",
    description: "Description for the games page metadata",
  });

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <div className={styles.gamesPage}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <Translate id="games.page.heading" description="Heading for games page">
              Our Games
            </Translate>
          </h1>
        </div>
        <div className={styles.gamesListContainer}>
          {filteredGames.length > 0 ? (
            filteredGames.map((game, index) => (
              <GameCard key={game.id || index} game={game} />
            ))
          ) : (
            <div className={styles.emptyState}>
              <Translate id="games.page.empty" description="Empty state for games page">
                No games to display with the current filter.
              </Translate>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
