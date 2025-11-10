import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

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
  const safeSearch = typeof location.search === 'string' ? location.search : '';
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const leadingSegment = pathSegments[0];
  const hasLocalePrefix = leadingSegment ? locales.includes(leadingSegment) : false;
  const isDefaultLocalePath = !hasLocalePrefix || leadingSegment === defaultLocale;
  const searchParamsMemo = useMemo(
    () => new URLSearchParams(safeSearch),
    [safeSearch],
  );
  const isCleanMode = useMemo(
    () => searchParamsMemo.get('mode')?.toLowerCase() === 'clean',
    [searchParamsMemo],
  );
  const requestedTheme = useMemo(() => {
    const themeParam = searchParamsMemo.get('theme')?.toLowerCase();
    if (themeParam === 'light' || themeParam === 'dark') {
      return themeParam;
    }
    return null;
  }, [searchParamsMemo]);

  const [isLocaleReady, setIsLocaleReady] = useState<boolean>(() => {
    if (!ExecutionEnvironment.canUseDOM) {
      return true;
    }
    if (!isDefaultLocalePath || currentLocale !== defaultLocale) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) {
      return;
    }

    const pathSegmentsInEffect = location.pathname.split('/').filter(Boolean);
    const leadingSegmentInEffect = pathSegmentsInEffect[0];
    const hasLocalePrefixInEffect = leadingSegmentInEffect ? locales.includes(leadingSegmentInEffect) : false;
    const isDefaultLocalePathInEffect = !hasLocalePrefixInEffect || leadingSegmentInEffect === defaultLocale;
    const hasTrailingSlash = location.pathname.endsWith('/');
    const searchParams = new URLSearchParams(safeSearch);
    const langParam = searchParams.get('lang');

    const needsBlocking =
      isDefaultLocalePathInEffect &&
      currentLocale === defaultLocale &&
      Boolean(langParam);

    if (needsBlocking && isLocaleReady) {
      setIsLocaleReady(false);
    }

    if (isDefaultLocalePathInEffect && currentLocale === defaultLocale) {
      if (langParam) {
        const requestedLocale = resolveLocaleCandidate(langParam, locales);

        if (requestedLocale && requestedLocale !== currentLocale) {
          const newPath = buildRedirectPath(requestedLocale, pathSegmentsInEffect, defaultLocale, hasTrailingSlash);
          window.location.href = newPath + location.search + location.hash;
          return;
        }

        setIsLocaleReady(true);
        return;
      }

      // Auto-detection disabled: no longer redirect based on browser language
    }

    setIsLocaleReady(true);
  }, [currentLocale, defaultLocale, locales, location.pathname, safeSearch, isLocaleReady]);

  const useIsomorphicLayoutEffect = ExecutionEnvironment.canUseDOM ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) {
      return;
    }

    const html = document.documentElement;
    if (isLocaleReady) {
      html.classList.remove('locale-blocking');
      html.classList.add('locale-ready');
    } else {
      html.classList.remove('locale-ready');
      html.classList.add('locale-blocking');
    }
  }, [isLocaleReady]);

  useIsomorphicLayoutEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) {
      return;
    }

    document.documentElement.classList.toggle('clean-mode', isCleanMode);
    document.body.classList.toggle('clean-mode', isCleanMode);
  }, [isCleanMode]);

  useIsomorphicLayoutEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) {
      return;
    }

    if (!requestedTheme) {
      return;
    }

    const html = document.documentElement;
    html.setAttribute('data-theme', requestedTheme);
    try {
      window.localStorage.setItem('theme', requestedTheme);
    } catch {
      // Ignore storage failures (e.g., private mode)
    }
  }, [requestedTheme]);

  if (!isLocaleReady) {
    return (
      <div className="locale-loading" role="status" aria-live="polite">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
