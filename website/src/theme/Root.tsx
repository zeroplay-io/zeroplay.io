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

// Allow case-insensitive lookups for language aliases (e.g., lang=zh-cn)
const LANGUAGE_ALIAS_LOOKUP: Record<string, string> = Object.entries(LANGUAGE_MAP).reduce(
  (acc, [key, value]) => {
    acc[key] = value;
    acc[key.toLowerCase()] = value;
    return acc;
  },
  {} as Record<string, string>,
);

function findLocaleInsensitive(candidate: string, supportedLocales: string[]): string | undefined {
  const lowerCandidate = candidate.toLowerCase();
  return supportedLocales.find((locale) => locale.toLowerCase() === lowerCandidate);
}

function mapLocaleCandidate(candidate: string): string | undefined {
  return LANGUAGE_ALIAS_LOOKUP[candidate] ?? LANGUAGE_ALIAS_LOOKUP[candidate.toLowerCase()];
}

function resolveLocaleCandidate(candidate: string | null, supportedLocales: string[]): string | null {
  if (!candidate) {
    return null;
  }

  const trimmed = candidate.trim();
  if (!trimmed) {
    return null;
  }

  const directMatch = findLocaleInsensitive(trimmed, supportedLocales);
  if (directMatch) {
    return directMatch;
  }

  const mapped = mapLocaleCandidate(trimmed);
  if (mapped && supportedLocales.includes(mapped)) {
    return mapped;
  }

  const base = trimmed.split('-')[0];
  if (base) {
    const baseMatch = findLocaleInsensitive(base, supportedLocales);
    if (baseMatch) {
      return baseMatch;
    }

    const mappedBase = mapLocaleCandidate(base);
    if (mappedBase && supportedLocales.includes(mappedBase)) {
      return mappedBase;
    }
  }

  return null;
}

function buildRedirectPath(
  targetLocale: string,
  pathSegments: string[],
  defaultLocale: string,
  hasTrailingSlash: boolean,
): string {
  const remainingSegments =
    pathSegments[0] === defaultLocale ? pathSegments.slice(1) : pathSegments;
  const newPathSegments = [targetLocale, ...remainingSegments];
  const suffix = hasTrailingSlash ? '/' : '';
  const path = newPathSegments.join('/');
  return path ? `/${path}${suffix}` : `/${suffix}`;
}

function getBrowserLanguage(supportedLocales: string[]): string | null {
  // Get all browser languages
  const browserLanguages = navigator.languages || [navigator.language];

  for (const lang of browserLanguages) {
    const matchedLocale = resolveLocaleCandidate(lang, supportedLocales);
    if (matchedLocale) {
      return matchedLocale;
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
    // Treat routes without a non-default locale prefix as default-locale pages
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const leadingSegment = pathSegments[0];
    const hasLocalePrefix = leadingSegment ? locales.includes(leadingSegment) : false;
    const isDefaultLocalePath = !hasLocalePrefix || leadingSegment === defaultLocale;
    const hasTrailingSlash = location.pathname.endsWith('/');
    const searchParams = new URLSearchParams(location.search);
    const langParam = searchParams.get('lang');
    const hasVisitedBefore = localStorage.getItem('docusaurus.locale.visited');

    if (isDefaultLocalePath && currentLocale === defaultLocale) {
      if (langParam) {
        const requestedLocale = resolveLocaleCandidate(langParam, locales);

        if (requestedLocale && requestedLocale !== currentLocale) {
          localStorage.setItem('docusaurus.locale.visited', 'true');
          const newPath = buildRedirectPath(requestedLocale, pathSegments, defaultLocale, hasTrailingSlash);
          window.location.href = newPath + location.search + location.hash;
        } else if (requestedLocale) {
          // Respect explicit language requests even when they equal the current locale
          localStorage.setItem('docusaurus.locale.visited', 'true');
        }

        return;
      }

      if (!hasVisitedBefore) {
        const detectedLocale = getBrowserLanguage(locales);

        if (detectedLocale && detectedLocale !== defaultLocale) {
          // Mark as visited before redirecting
          localStorage.setItem('docusaurus.locale.visited', 'true');

          // Redirect to detected language
          const newPath = buildRedirectPath(detectedLocale, pathSegments, defaultLocale, hasTrailingSlash);

          window.location.href = newPath + location.search + location.hash;
        } else {
          // Mark as visited even if staying on default locale
          localStorage.setItem('docusaurus.locale.visited', 'true');
        }
      }
    }
  }, [location.pathname, location.search, currentLocale, defaultLocale, locales]);

  return <>{children}</>;
}
