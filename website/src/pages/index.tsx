import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Translate, { translate } from "@docusaurus/Translate";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import GameCard from "@site/src/components/GameCard";
import { getLocalizedGames } from "@site/src/utils/i18nGames";
import styles from "./index.module.css";

function HeroBanner() {
  return (
    <div className={styles.hero} data-theme="dark">
      <div className={styles.heroInner}>
        <Heading as="h1" className={styles.heroProjectTagline}>
          <span
            className={styles.heroTitleTextHtml}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: translate({
                id: "homepage.hero.title",
                message: "Start from <b>Zero</b>,<b>Play</b> to Infinite!",
                description:
                  "Home page hero title, can contain simple html tags",
              }),
            }}
          />
        </Heading>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig, i18n } = useDocusaurusContext();
  const localizedGames = getLocalizedGames(i18n.currentLocale);

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Start from Zero, Play to Infinite."
    >
      <HeroBanner />
      <main>
        <div className={styles.gamesSection}>
          <h2 className={styles.gamesTitle}>
            <Translate id="homepage.games.title">Our Games</Translate>
          </h2>
          <div className={styles.gamesListContainer}>
            {localizedGames.map((game, index) => (
              <GameCard key={game.id || index} game={game} />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
