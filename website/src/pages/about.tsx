import React from "react";
import Layout from "@theme/Layout";
import Translate from "@docusaurus/Translate";
import { translate } from "@docusaurus/core/lib/client/exports/Translate";
import styles from "./about.module.css";

export default function AboutPage(): JSX.Element {
  const pageTitle = translate({
    id: "about.page.title",
    message: "About Us",
    description: "Title for the about page",
  });

  const pageDescription = translate({
    id: "about.page.description",
    message: "Learn more about ZeroPlay",
    description: "Description for the about page metadata",
  });

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <div className={styles.aboutPage}>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={styles.title}>
              <Translate id="about.hero.title">About ZeroPlay</Translate>
            </h1>
            <p className={styles.tagline}>
              <Translate id="about.hero.tagline">
                Start from Zero, Play to Infinite
              </Translate>
            </p>
          </div>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Translate id="about.mission.title">Our Mission</Translate>
            </h2>
            <p className={styles.sectionText}>
              <Translate id="about.mission.text">
                ZeroPlay is dedicated to creating exceptional casual puzzle games that bring joy and mental stimulation to players worldwide. We believe that great games should be accessible to everyone, offering moments of relaxation and intellectual challenge in equal measure.
              </Translate>
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Translate id="about.philosophy.title">Our Philosophy</Translate>
            </h2>
            <p className={styles.sectionText}>
              <Translate id="about.philosophy.text">
                We are committed to fairness and transparency in everything we do. Our games feature provably fair systems, ensuring every player has an equal opportunity to succeed. We combine classic gameplay mechanics with modern design principles to create experiences that are both timeless and fresh.
              </Translate>
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Translate id="about.games.title">Our Games</Translate>
            </h2>
            <p className={styles.sectionText}>
              <Translate id="about.games.text">
                From strategic board games like Backgammon to relaxing card games like Solitaire, and brain-teasing puzzles like Rubik's Cube, our portfolio spans a wide range of casual gaming experiences. Each game is crafted with attention to detail, beautiful visuals, and smooth gameplay that works seamlessly across all your devices.
              </Translate>
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Translate id="about.global.title">Global Community</Translate>
            </h2>
            <p className={styles.sectionText}>
              <Translate id="about.global.text">
                With support for over 30 languages and players from every corner of the world, ZeroPlay games bring people together through the universal language of play. Join millions of players who have made our games part of their daily routine.
              </Translate>
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
