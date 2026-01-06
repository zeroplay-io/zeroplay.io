import React, { useEffect, useMemo, useState } from "react";
import Layout from "@theme/Layout";
import Translate from "@docusaurus/Translate";
import { translate } from "@docusaurus/core/lib/client/exports/Translate";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import GameCard from "@site/src/components/GameCard";
import { getReleasedGames } from "@site/src/utils/i18nGames";
import styles from "./index.module.css";

const STORE_FILTERS = ["ios", "ios-china", "google-play", "zeroplay", "taptap-cn"] as const;
type StoreFilter = (typeof STORE_FILTERS)[number];

const resolveStoreFilter = (value: string | null): StoreFilter | undefined => {
  if (!value) {
    return undefined;
  }
  const normalized = value.trim().toLowerCase();
  return STORE_FILTERS.includes(normalized as StoreFilter)
    ? (normalized as StoreFilter)
    : undefined;
};

export default function GamesPage(): JSX.Element {
  const location = useLocation();
  const { i18n } = useDocusaurusContext();
  const localizedGames = useMemo(
    () => getReleasedGames(i18n.currentLocale),
    [i18n.currentLocale],
  );
  const storeFilter = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return resolveStoreFilter(params.get("store"));
  }, [location.search]);

  const hasFilterQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.has("source_game") || Boolean(storeFilter);
  }, [location.search, storeFilter]);

  const [filteredGames, setFilteredGames] = useState(() =>
    hasFilterQuery ? [] : localizedGames,
  );
  const [isFilterReady, setIsFilterReady] = useState(() => !hasFilterQuery);

  useEffect(() => {
    if (hasFilterQuery) {
      setIsFilterReady(false);
    }

    const releaseFilterBlocking = () => {
      if (!ExecutionEnvironment.canUseDOM) {
        return;
      }
      document.documentElement.classList.remove("games-filter-blocking");
    };

    if (!ExecutionEnvironment.canUseDOM) {
      setFilteredGames(localizedGames);
      setIsFilterReady(true);
      releaseFilterBlocking();
      return;
    }

    const params = new URLSearchParams(location.search);
    const excludeTokens: string[] = [];

    params.getAll("source_game").forEach((value) => {
      value
        .split(",")
        .map((token) => token.trim().toLowerCase())
        .filter(Boolean)
        .forEach((token) => excludeTokens.push(token));
    });

    if (excludeTokens.length === 0) {
      const storeFilteredGames = storeFilter
        ? localizedGames.filter((game) => game.stores?.[storeFilter])
        : localizedGames;
      setFilteredGames(storeFilteredGames);
      setIsFilterReady(true);
      releaseFilterBlocking();
      return;
    }

    const excludeSet = new Set(excludeTokens);
    const excludedGames = localizedGames.filter(
      (game) => !excludeSet.has(game.id.toLowerCase()),
    );
    const storeFilteredGames = storeFilter
      ? excludedGames.filter((game) => game.stores?.[storeFilter])
      : excludedGames;
    setFilteredGames(storeFilteredGames);
    setIsFilterReady(true);
    releaseFilterBlocking();
  }, [hasFilterQuery, localizedGames, location.search, storeFilter]);

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
  const loadingLabel = translate({
    id: "games.page.loading",
    message: "Loading…",
    description: "Assistive text shown while the games filter is resolving",
  });

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <div className={styles.gamesPage}>
        <div
          className={styles.gamesListContainer}
          data-loading-label={loadingLabel}
        >
          {!isFilterReady ? (
            <div className="locale-loading" role="status" aria-live="polite">
              Loading…
            </div>
          ) : filteredGames.length > 0 ? (
            [...filteredGames].reverse().map((game, index) => (
              <GameCard key={game.id || index} game={game} preferredStore={storeFilter} />
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
