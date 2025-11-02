import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Language mapping for better browser language detection
const LANGUAGE_MAP: Record<string, string> = {
  'zh': 'zh-Hans',
  'zh-CN': 'zh-Hans',
  'zh-SG': 'zh-Hans',
  'zh-TW': 'zh-Hant',
  'zh-HK': 'zh-Hant',
  'zh-MO': 'zh-Hant',
  'pt': 'pt-BR', // Default Portuguese to Brazilian
  'en': 'en',
  'ja': 'ja',
  'ko': 'ko',
  'es': 'es',
  'fr': 'fr',
  'de': 'de',
  'it': 'it',
  'ru': 'ru',
  'ar': 'ar',
  'tr': 'tr',
  'th': 'th',
  'vi': 'vi',
  'id': 'id',
  'ms': 'ms',
  'fil': 'fil',
  'tl': 'fil', // Tagalog to Filipino
  'hi': 'hi',
  'nl': 'nl',
  'pl': 'pl',
  'sv': 'sv',
  'no': 'no',
  'nb': 'no',
  'nn': 'no',
  'da': 'da',
  'fi': 'fi',
  'he': 'he',
  'iw': 'he',
  'fa': 'fa',
  'uk': 'uk',
  'ro': 'ro',
  'cs': 'cs',
  'hu': 'hu',
};

function getBrowserLanguage(supportedLocales: string[]): string | null {
  // Get all browser languages
  const browserLanguages = navigator.languages || [navigator.language];

  for (const lang of browserLanguages) {
    // Direct match
    if (supportedLocales.includes(lang)) {
      return lang;
    }

    // Try mapped language
    const mappedLang = LANGUAGE_MAP[lang];
    if (mappedLang && supportedLocales.includes(mappedLang)) {
      return mappedLang;
    }

    // Try base language code (e.g., 'en-US' -> 'en')
    const baseLang = lang.split('-')[0];
    if (supportedLocales.includes(baseLang)) {
      return baseLang;
    }

    // Try mapped base language
    const mappedBaseLang = LANGUAGE_MAP[baseLang];
    if (mappedBaseLang && supportedLocales.includes(mappedBaseLang)) {
      return mappedBaseLang;
    }
  }

  return null;
}

export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  const location = useLocation();
  const {
    i18n: { currentLocale, defaultLocale, locales },
  } = useDocusaurusContext();

  useEffect(() => {
    // Only redirect on initial load and if on default locale
    const isDefaultLocalePath = location.pathname === '/' || location.pathname.startsWith(`/${defaultLocale}/`);
    const hasVisitedBefore = localStorage.getItem('docusaurus.locale.visited');

    if (!hasVisitedBefore && isDefaultLocalePath && currentLocale === defaultLocale) {
      const detectedLocale = getBrowserLanguage(locales);

      if (detectedLocale && detectedLocale !== defaultLocale) {
        // Mark as visited before redirecting
        localStorage.setItem('docusaurus.locale.visited', 'true');

        // Redirect to detected language
        const newPath = location.pathname === '/'
          ? `/${detectedLocale}/`
          : location.pathname.replace(/^\//, `/${detectedLocale}/`);

        window.location.href = newPath + location.search + location.hash;
      } else {
        // Mark as visited even if staying on default locale
        localStorage.setItem('docusaurus.locale.visited', 'true');
      }
    }
  }, [location.pathname, currentLocale, defaultLocale, locales]);

  return <>{children}</>;
}
