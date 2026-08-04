import React, { useState, useMemo, useRef } from "react";
import Layout from "@theme/Layout";
import Translate from "@docusaurus/Translate";
import { translate } from "@docusaurus/core/lib/client/exports/Translate";
import { useLocation } from "@docusaurus/router";
import styles from "./feedback.module.css";

interface FeedbackParams {
  appId: number | null;
  slug: string | null;
  storeType: string | null;
  userId: number | null;
  osVersion: string | null;
  appVersion: string | null;
  deviceModel: string | null;
}

const getFeedbackParams = (search: string): FeedbackParams => {
  const params = new URLSearchParams(search);

  const appParam = params.get("app");
  const appId = appParam ? parseInt(appParam, 10) : null;

  const storeType = params.get("store");

  const uidParam = params.get("uid");
  const userId = uidParam ? parseInt(uidParam, 10) : null;

  // App slug for external apps that have no ZeroPlay appID.
  const slug = params.get("slug");

  // Client environment information. Support a couple of common aliases so the
  // calling app can pass whichever name is convenient.
  const osVersion = params.get("os") || params.get("osVersion");
  const appVersion = params.get("ver") || params.get("appver") || params.get("appVersion");
  const deviceModel = params.get("device") || params.get("model") || params.get("deviceModel");

  return {
    appId: appId && !isNaN(appId) ? appId : null,
    slug: slug || null,
    storeType: storeType || null,
    userId: userId && !isNaN(userId) ? userId : null,
    osVersion: osVersion || null,
    appVersion: appVersion || null,
    deviceModel: deviceModel || null,
  };
};

const isValidEmail = (email: string): boolean => {
  // Simple but practical email validation.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function FeedbackPage(): JSX.Element {
  const location = useLocation();
  const feedbackParams = useMemo(() => getFeedbackParams(location.search), [location.search]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

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

  const clearStatus = () => {
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
      setErrorMessage("");
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // 清除错误和成功状态，让用户可以重新输入
    clearStatus();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    clearStatus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // An app must be identifiable either by appID or slug. External apps
    // without a ZeroPlay appID pass a slug instead.
    if (!feedbackParams.appId && !feedbackParams.slug) {
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

    const trimmedEmail = email.trim();
    if (trimmedEmail && !isValidEmail(trimmedEmail)) {
      setErrorMessage(translate({
        id: "feedback.error.invalidEmail",
        message: "Please enter a valid email address",
        description: "Error message when the provided email is invalid",
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
        slug?: string;
        storeType?: string;
        userID?: number;
        content: string;
        email?: string;
        osVersion?: string;
        appVersion?: string;
        deviceModel?: string;
      } = {
        appID: feedbackParams.appId || 0,
        content: content.trim(),
      };

      if (feedbackParams.slug) {
        payload.slug = feedbackParams.slug;
      }

      if (feedbackParams.storeType) {
        payload.storeType = feedbackParams.storeType;
      }

      if (feedbackParams.userId) {
        payload.userID = feedbackParams.userId;
      }

      if (trimmedEmail) {
        payload.email = trimmedEmail;
      }

      if (feedbackParams.osVersion) {
        payload.osVersion = feedbackParams.osVersion;
      }

      if (feedbackParams.appVersion) {
        payload.appVersion = feedbackParams.appVersion;
      }

      if (feedbackParams.deviceModel) {
        payload.deviceModel = feedbackParams.deviceModel;
      }

      const response = await fetch("https://api.zeroplay.io/v1/developer/feedback", {
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
      setEmail("");
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
                Please share your thoughts with us.
              </Translate>
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {submitStatus === "success" ? (
              <div className={styles.successMessage} role="status">
                <Translate id="feedback.success.message">
                  Thank you for your feedback! We appreciate your input.
                </Translate>
              </div>
            ) : (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="feedback-content" className={styles.label}>
                    <Translate id="feedback.form.label">Your Feedback</Translate>
                  </label>
                  <textarea
                    ref={textareaRef}
                    id="feedback-content"
                    className={styles.textarea}
                    rows={8}
                    value={content}
                    onChange={handleContentChange}
                    placeholder={translate({
                      id: "feedback.form.placeholder",
                      message: "Tell us what you think...",
                      description: "Placeholder text for feedback textarea",
                    })}
                    disabled={isSubmitting}
                    required
                    maxLength={500}
                    aria-invalid={submitStatus === "error"}
                    aria-describedby={submitStatus === "error" ? "feedback-error" : undefined}
                  />
                  <div
                    className={`${styles.charCount} ${
                      content.length >= 500
                        ? styles.charCountDanger
                        : content.length >= 450
                        ? styles.charCountWarning
                        : ''
                    }`}
                  >
                    {content.length} / 500
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="feedback-email" className={styles.label}>
                    <Translate id="feedback.form.emailLabel">Email (optional)</Translate>
                  </label>
                  <input
                    id="feedback-email"
                    type="email"
                    className={styles.input}
                    value={email}
                    onChange={handleEmailChange}
                    placeholder={translate({
                      id: "feedback.form.emailPlaceholder",
                      message: "you@example.com",
                      description: "Placeholder text for the email input",
                    })}
                    disabled={isSubmitting}
                    maxLength={255}
                    autoComplete="email"
                    inputMode="email"
                  />
                  <p className={styles.hint}>
                    <Translate id="feedback.form.emailHint">
                      Leave your email so we can get back to you with a reply.
                    </Translate>
                  </p>
                </div>

                {submitStatus === "error" && errorMessage && (
                  <div id="feedback-error" className={styles.errorMessage} role="alert">
                    {errorMessage}
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
                    <Translate id="feedback.form.submit">Submit</Translate>
                  )}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
}
