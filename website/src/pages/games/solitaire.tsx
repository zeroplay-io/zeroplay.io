import React from "react";
import Layout from "@theme/Layout";
import GameShowcase from "@site/src/components/GameShowcase";
import PortraitGameShowcase from "@site/src/components/PortraitGameShowcase";
import gamesData from "@site/src/data/games.json";

export default function SolitairePage(): JSX.Element {
  // Find the solitaire game from games.json
  const game = gamesData.games.find((g) => g.id === "solitaire");

  if (!game) {
    return (
      <Layout title="Game Not Found">
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1>Game Not Found</h1>
          <p>The requested game could not be found.</p>
        </div>
      </Layout>
    );
  }

  // Generate screenshots array based on screenshotCount
  const screenshots = Array.from(
    { length: game.screenshotCount || 0 },
    (_, i) => `/games/${game.id}/screenshot-${String(i + 1).padStart(2, "0")}.jpg`
  );

  // Prepare game data with screenshots
  const gameWithScreenshots = {
    ...game,
    screenshots,
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
