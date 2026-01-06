import React from "react";
import Layout from "@theme/Layout";
import Translate from "@docusaurus/Translate";
import { translate } from "@docusaurus/core/lib/client/exports/Translate";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import GameShowcase from "@site/src/components/GameShowcase";
import PortraitGameShowcase from "@site/src/components/PortraitGameShowcase";
import gamesData from "@site/src/data/games.json";
import { getLocalizedGame } from "@site/src/utils/i18nGames";

const getGameIdFromPath = (pathname: string): string | undefined => {
  const segments = pathname.split("/").filter(Boolean);
  const gamesIndex = segments.lastIndexOf("games");
  if (gamesIndex < 0 || gamesIndex + 1 >= segments.length) {
    return undefined;
  }
  const rawId = segments[gamesIndex + 1];
  try {
    return decodeURIComponent(rawId);
  } catch (_) {
    return rawId;
  }
};

export default function GameDetailPage(): JSX.Element {
  const { i18n } = useDocusaurusContext();
  const location = useLocation();
  const gameId = getGameIdFromPath(location.pathname);
  const normalizedId = gameId ? gameId.toLowerCase() : "";
  const baseGame = normalizedId
    ? gamesData.games.find((game) => game.id.toLowerCase() === normalizedId)
    : undefined;
  const resolvedGameId = baseGame?.id ?? normalizedId;
  const localizedGame = resolvedGameId
    ? getLocalizedGame(resolvedGameId, i18n.currentLocale)
    : undefined;
  const game = localizedGame ?? baseGame;

  if (!game) {
    return (
      <Layout
        title={translate({
          id: "game.page.notFound.title",
          message: "Game Not Found",
          description: "Title shown when a game page cannot be found",
        })}
      >
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1>
            <Translate id="game.page.notFound.title">Game Not Found</Translate>
          </h1>
          <p>
            <Translate id="game.page.notFound.description">
              The requested game could not be found.
            </Translate>
          </p>
        </div>
      </Layout>
    );
  }

  type ShowcaseGame = React.ComponentProps<typeof GameShowcase>["game"];
  const resolvedGame = game as ShowcaseGame;
  const gameWithScreenshots: ShowcaseGame = {
    ...resolvedGame,
    screenshots: resolvedGame.screenshots || [],
  };

  const ShowcaseComponent =
    game.orientation === "portrait" ? PortraitGameShowcase : GameShowcase;

  return (
    <Layout title={game.title} description={game.description}>
      <ShowcaseComponent game={gameWithScreenshots} />
    </Layout>
  );
}
