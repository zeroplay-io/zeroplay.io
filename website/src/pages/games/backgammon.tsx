import React from "react";
import Layout from "@theme/Layout";
import Translate from "@docusaurus/Translate";
import { translate } from "@docusaurus/core/lib/client/exports/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import GameShowcase from "@site/src/components/GameShowcase";
import PortraitGameShowcase from "@site/src/components/PortraitGameShowcase";
import gamesData from "@site/src/data/games.json";
import { getLocalizedGame } from "@site/src/utils/i18nGames";

export default function BackgammonPage(): JSX.Element {
  const { i18n } = useDocusaurusContext();
  const baseGame = gamesData.games.find((g) => g.id === "backgammon");
  const localizedGame = getLocalizedGame("backgammon", i18n.currentLocale);
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

  // Use screenshots array directly from game data
  type ShowcaseGame = React.ComponentProps<typeof GameShowcase>["game"];
  const resolvedGame = game as ShowcaseGame;
  const gameWithScreenshots: ShowcaseGame = {
    ...resolvedGame,
    screenshots: resolvedGame.screenshots || [],
  };

  // Choose component based on orientation
  const ShowcaseComponent =
    game.orientation === "portrait" ? PortraitGameShowcase : GameShowcase;

  return (
    <Layout
      title={game.title}
      description={game.description}
    >
      <ShowcaseComponent game={gameWithScreenshots} />
    </Layout>
  );
}
