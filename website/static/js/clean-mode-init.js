(function () {
  if (typeof window === "undefined") {
    return;
  }

  var docEl = document.documentElement;

  function safeGetLocalStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }

  function safeSetLocalStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (_) {
      /* ignore write failures */
    }
  }

  function toLocaleCandidates(value) {
    if (!value) {
      return [];
    }
    if (Array.isArray(value)) {
      return value;
    }
    return [value];
  }

  var params = null;
  try {
    params = new URLSearchParams(window.location.search || "");
  } catch (error) {
    params = null;
  }

  var localeConfig = window.__ZERO_LOCALE_CONFIG;
  if (localeConfig && typeof localeConfig === "object") {
    var locales = Array.isArray(localeConfig.locales)
      ? localeConfig.locales.slice()
      : [];
    var defaultLocale =
      typeof localeConfig.defaultLocale === "string"
        ? localeConfig.defaultLocale
        : locales[0] || "en";

    var LANGUAGE_MAP = {
      zh: "zh-Hans",
      "zh-CN": "zh-Hans",
      "zh-SG": "zh-Hans",
      "zh-TW": "zh-Hant",
      "zh-HK": "zh-Hant",
      "zh-MO": "zh-Hant",
      pt: "pt-BR",
      en: "en",
      ja: "ja",
      ko: "ko",
      es: "es",
      fr: "fr",
      de: "de",
      it: "it",
      ru: "ru",
      ar: "ar",
      tr: "tr",
      th: "th",
      vi: "vi",
      id: "id",
      ms: "ms",
      fil: "fil",
      tl: "fil",
      hi: "hi",
      nl: "nl",
      pl: "pl",
      sv: "sv",
      no: "no",
      nb: "no",
      nn: "no",
      da: "da",
      fi: "fi",
      he: "he",
      iw: "he",
      fa: "fa",
      uk: "uk",
      ro: "ro",
      cs: "cs",
      hu: "hu",
    };

    var LANGUAGE_ALIAS_LOOKUP = Object.keys(LANGUAGE_MAP).reduce(function (acc, key) {
      var value = LANGUAGE_MAP[key];
      acc[key] = value;
      acc[key.toLowerCase()] = value;
      return acc;
    }, {});

    function findLocaleInsensitive(candidate, supportedLocales) {
      var lower = candidate.toLowerCase();
      for (var i = 0; i < supportedLocales.length; i += 1) {
        if (supportedLocales[i].toLowerCase() === lower) {
          return supportedLocales[i];
        }
      }
      return undefined;
    }

    function mapLocaleCandidate(candidate) {
      if (!candidate) {
        return undefined;
      }
      return (
        LANGUAGE_ALIAS_LOOKUP[candidate] ||
        LANGUAGE_ALIAS_LOOKUP[(candidate || "").toLowerCase()]
      );
    }

    function resolveLocaleCandidate(candidate, supportedLocales) {
      if (!candidate) {
        return null;
      }

      var trimmed = candidate.trim();
      if (!trimmed) {
        return null;
      }

      var directMatch = findLocaleInsensitive(trimmed, supportedLocales);
      if (directMatch) {
        return directMatch;
      }

      var mapped = mapLocaleCandidate(trimmed);
      if (mapped && supportedLocales.indexOf(mapped) !== -1) {
        return mapped;
      }

      var base = trimmed.split("-")[0];
      if (base) {
        var baseMatch = findLocaleInsensitive(base, supportedLocales);
        if (baseMatch) {
          return baseMatch;
        }

        var mappedBase = mapLocaleCandidate(base);
        if (mappedBase && supportedLocales.indexOf(mappedBase) !== -1) {
          return mappedBase;
        }
      }

      return null;
    }

    function buildRedirectPath(targetLocale, pathSegments, defaultLocaleValue, hasTrailingSlash) {
      var segments = pathSegments.slice();
      if (segments[0] === defaultLocaleValue) {
        segments.shift();
      }
      segments.unshift(targetLocale);
      var suffix = hasTrailingSlash ? "/" : "";
      if (segments.length === 0) {
        return "/" + suffix;
      }
      return "/" + segments.join("/") + suffix;
    }

    function detectBrowserLocale(supportedLocales) {
      var browserLocales = toLocaleCandidates(
        (navigator.languages && navigator.languages.length)
          ? navigator.languages
          : navigator.language,
      );

      for (var i = 0; i < browserLocales.length; i += 1) {
        var matched = resolveLocaleCandidate(browserLocales[i], supportedLocales);
        if (matched) {
          return matched;
        }
      }
      return null;
    }

    var pathSegments = window.location.pathname.split("/").filter(Boolean);
    var leadingSegment = pathSegments[0];
    var hasLocalePrefix =
      typeof leadingSegment === "string" && locales.indexOf(leadingSegment) !== -1;
    var currentLocale = hasLocalePrefix ? leadingSegment : defaultLocale;
    var isDefaultLocalePath = !hasLocalePrefix || leadingSegment === defaultLocale;
    var hasTrailingSlash = window.location.pathname.endsWith("/");

    var langParam = params ? params.get("lang") : null;
    var storedLocale = safeGetLocalStorage("docusaurus.locale");
    var hasVisitedBefore = safeGetLocalStorage("docusaurus.locale.visited");

    var shouldBlockForLocale =
      isDefaultLocalePath &&
      currentLocale === defaultLocale &&
      (!!langParam || !hasVisitedBefore);

    if (shouldBlockForLocale) {
      docEl.classList.add("locale-blocking");
    }

    var targetLocale = null;

    if (langParam) {
      targetLocale = resolveLocaleCandidate(langParam, locales);
    } else if (!hasLocalePrefix) {
      var normalizedStoredLocale = resolveLocaleCandidate(storedLocale, locales);
      if (normalizedStoredLocale && normalizedStoredLocale !== currentLocale) {
        targetLocale = normalizedStoredLocale;
      } else if (!hasVisitedBefore) {
        var detectedLocale = detectBrowserLocale(locales);
        if (detectedLocale && detectedLocale !== defaultLocale) {
          targetLocale = detectedLocale;
        }
      }
    }

    if (targetLocale && targetLocale !== currentLocale) {
      docEl.classList.add("locale-blocking");
      safeSetLocalStorage("docusaurus.locale", targetLocale);
      safeSetLocalStorage("docusaurus.locale.visited", "true");
      var newPath = buildRedirectPath(targetLocale, pathSegments, defaultLocale, hasTrailingSlash);
      window.location.replace(newPath + window.location.search + window.location.hash);
      return;
    }

    if (!hasVisitedBefore) {
      safeSetLocalStorage("docusaurus.locale.visited", "true");
    }
  }

  if (params && params.has("source_game")) {
    docEl.classList.add("games-filter-blocking");
  }

  try {
    if (!params) {
      params = new URLSearchParams(window.location.search || "");
    }

    var mode = params.get("mode");
    if (mode && mode.toLowerCase() === "clean") {
      docEl.classList.add("clean-mode");

      if (document.body) {
        document.body.classList.add("clean-mode");
      } else {
        document.addEventListener(
          "DOMContentLoaded",
          function () {
            if (document.body) {
              document.body.classList.add("clean-mode");
            }
          },
          { once: true },
        );
      }
    }

    var theme = params.get("theme");
    if (theme && (theme === "light" || theme === "dark")) {
      docEl.setAttribute("data-theme", theme);
      safeSetLocalStorage("theme", theme);
    }
  } catch (error) {
    // Silently ignore malformed query strings.
  }
})();
