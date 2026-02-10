import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import Translate from "@docusaurus/Translate";
import { translate } from "@docusaurus/core/lib/client/exports/Translate";
import { useLocation } from "@docusaurus/router";
import styles from "./feedback.module.css";

interface FeedbackParams {
  appId: number | null;
  storeType: string | null;
  userId: number | null;
}

const getFeedbackParams = (search: string): FeedbackParams => {
  const params = new URLSearchParams(search);

  const appParam = params.get("app");
  const appId = appParam ? parseInt(appParam, 10) : null;

  const storeType = params.get("store");

  const uidParam = params.get("uid");
  const userId = uidParam ? parseInt(uidParam, 10) : null;

  return {
    appId: appId && !isNaN(appId) ? appId : null,
    storeType: storeType || null,
    userId: userId && !isNaN(userId) ? userId : null,
  };
};

export default function FeedbackPage(): JSX.Element {
  const location = useLocation();
  const [feedbackParams, setFeedbackParams] = useState<FeedbackParams>({
    appId: null,
    storeType: null,
    userId: null,
  });
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = getFeedbackParams(location.search);
    setFeedbackParams(params);
  }, [location.search]);

  const pageTitle = translate({
    id: "feedback.page.title",
    message: "Feedback",
    description: "Title for the feedback page",
  });

  const pageDescription = translate({
    id: "feedback.page.description",
    message: "Send us your feedback",
    description: "Description for the feedback page metadata",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedbackParams.appId) {
      setErrorMessage(translate({
        id: "feedback.error.noAppId",
        message: "App ID is required",
        description: "Error message when app ID is missing",
      }));
      setSubmitStatus("error");
      return;
    }

    if (!content.trim()) {
      setErrorMessage(translate({
        id: "feedback.error.noContent",
        message: "Please enter your feedback",
        description: "Error message when feedback content is empty",
      }));
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const payload: {
        appID: number;
        storeType?: string;
        userID?: number;
        content: string;
      } = {
        appID: feedbackParams.appId,
        content: content.trim(),
      };

      if (feedbackParams.storeType) {
        payload.storeType = feedbackParams.storeType;
      }

      if (feedbackParams.userId) {
        payload.userID = feedbackParams.userId;
      }

      const response = await fetch("https://developer.zeroplay.io/v1/developer/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSubmitStatus("success");
      setContent("");
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      setErrorMessage(translate({
        id: "feedback.error.submit",
        message: "Failed to submit feedback. Please try again later.",
        description: "Error message when feedback submission fails",
      }));
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!feedbackParams.appId) {
    return (
      <Layout title={pageTitle} description={pageDescription}>
        <div className={styles.feedbackPage}>
          <div className={styles.container}>
            <div className={styles.errorBox}>
              <h1 className={styles.errorTitle}>
                <Translate id="feedback.error.invalidAccess.title">
                  Invalid Access
                </Translate>
              </h1>
              <p className={styles.errorText}>
                <Translate id="feedback.error.invalidAccess.description">
                  This page requires a valid app ID parameter.
                </Translate>
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <div className={styles.feedbackPage}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              <Translate id="feedback.header.title">Feedback</Translate>
            </h1>
            <p className={styles.subtitle}>
              <Translate id="feedback.header.subtitle">
                We value your feedback! Please share your thoughts with us.
              </Translate>
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="feedback-content" className={styles.label}>
                <Translate id="feedback.form.label">Your Feedback</Translate>
              </label>
              <textarea
                id="feedback-content"
                className={styles.textarea}
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={translate({
                  id: "feedback.form.placeholder",
                  message: "Tell us what you think...",
                  description: "Placeholder text for feedback textarea",
                })}
                disabled={isSubmitting}
                required
              />
            </div>

            {submitStatus === "error" && errorMessage && (
              <div className={styles.errorMessage}>
                {errorMessage}
              </div>
            )}

            {submitStatus === "success" && (
              <div className={styles.successMessage}>
                <Translate id="feedback.success.message">
                  Thank you for your feedback! We appreciate your input.
                </Translate>
              </div>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Translate id="feedback.form.submitting">Submitting...</Translate>
              ) : (
                <Translate id="feedback.form.submit">Submit Feedback</Translate>
              )}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
