import React from "react";
import Layout from "@theme/Layout";
import Translate from "@docusaurus/Translate";
import { translate } from "@docusaurus/core/lib/client/exports/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./contact.module.css";

export default function ContactPage(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const email = (siteConfig.customFields?.email as string) || "support@zeroplay.io";

  const pageTitle = translate({
    id: "contact.page.title",
    message: "Contact Us",
    description: "Title for the contact page",
  });

  const pageDescription = translate({
    id: "contact.page.description",
    message: "Get in touch with ZeroPlay",
    description: "Description for the contact page metadata",
  });

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <div className={styles.contactPage}>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={styles.title}>
              <Translate id="contact.hero.title">Contact Us</Translate>
            </h1>
            <p className={styles.tagline}>
              <Translate id="contact.hero.tagline">
                We'd love to hear from you
              </Translate>
            </p>
          </div>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <div className={styles.card}>
              <div className={styles.iconWrapper}>
                <svg
                  className={styles.icon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h2 className={styles.cardTitle}>
                <Translate id="contact.email.title">Email</Translate>
              </h2>
              <p className={styles.cardText}>
                <Translate id="contact.email.description">
                  For general inquiries, support, or feedback, please reach out to us via email.
                </Translate>
              </p>
              <a href={`mailto:${email}`} className={styles.emailLink}>
                {email}
              </a>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Translate id="contact.response.title">Response Time</Translate>
            </h2>
            <p className={styles.sectionText}>
              <Translate id="contact.response.text">
                We typically respond to all inquiries within 1-2 business days. For urgent matters related to account issues or in-app purchases, please include your player ID in your message for faster assistance.
              </Translate>
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Translate id="contact.feedback.title">Feedback Welcome</Translate>
            </h2>
            <p className={styles.sectionText}>
              <Translate id="contact.feedback.text">
                Your feedback helps us improve our games. Whether you have suggestions for new features, found a bug, or just want to share your experience, we appreciate hearing from our players.
              </Translate>
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
