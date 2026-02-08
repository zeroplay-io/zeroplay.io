import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import type { Options as ClientRedirectsOptions } from "@docusaurus/plugin-client-redirects";

const URL = "https://zeroplay.io";
const ORGANIZATION_NAME = "mkideal";
const PROJECT_NAME = "zeroplay";
const REPO = `https://github.com/${ORGANIZATION_NAME}/${PROJECT_NAME}`;
const CURRENT_YEAR = new Date().getFullYear();
const START_YEAR = 2025;
const COPYRIGHT = `Copyright © ${
  CURRENT_YEAR > START_YEAR ? `${START_YEAR}-${CURRENT_YEAR}` : START_YEAR
} ZeroPlay Ltd. (成都零游网络科技有限公司)`;

const customFields = {
  version: "0.0.1",
  repo: REPO,
  email: "support@zeroplay.io",
};

const I18N_CONFIG: Config["i18n"] = {
  defaultLocale: "en",
  locales: [
    "en",       // English
    "ar",       // Arabic
    "ca",       // Catalan
    "cs",       // Czech
    "da",       // Danish
    "de",       // German
    "el",       // Greek
    "es",       // Spanish
    "fi",       // Finnish
    "fr",       // French
    "he",       // Hebrew
    "hi",       // Hindi
    "hr",       // Croatian
    "hu",       // Hungarian
    "id",       // Indonesian
    "it",       // Italian
    "ja",       // Japanese
    "ko",       // Korean
    "ms",       // Malay
    "nb",       // Norwegian Bokmål
    "nl",       // Dutch
    "pl",       // Polish
    "pt",       // Portuguese
    "ro",       // Romanian
    "ru",       // Russian
    "sk",       // Slovak
    "sv",       // Swedish
    "th",       // Thai
    "tr",       // Turkish
    "uk",       // Ukrainian
    "vi",       // Vietnamese
    "zh-Hans",  // Simplified Chinese
    "zh-Hant",  // Traditional Chinese
  ],
  localeConfigs: {
    en: { label: "English", direction: "ltr", htmlLang: "en-US" },
    ar: { label: "العربية", direction: "rtl", htmlLang: "ar-SA" },
    ca: { label: "Català", direction: "ltr", htmlLang: "ca-ES" },
    cs: { label: "Čeština", direction: "ltr", htmlLang: "cs-CZ" },
    da: { label: "Dansk", direction: "ltr", htmlLang: "da-DK" },
    de: { label: "Deutsch", direction: "ltr", htmlLang: "de-DE" },
    el: { label: "Ελληνικά", direction: "ltr", htmlLang: "el-GR" },
    es: { label: "Español", direction: "ltr", htmlLang: "es-ES" },
    fi: { label: "Suomi", direction: "ltr", htmlLang: "fi-FI" },
    fr: { label: "Français", direction: "ltr", htmlLang: "fr-FR" },
    he: { label: "עברית", direction: "rtl", htmlLang: "he-IL" },
    hi: { label: "हिन्दी", direction: "ltr", htmlLang: "hi-IN" },
    hr: { label: "Hrvatski", direction: "ltr", htmlLang: "hr-HR" },
    hu: { label: "Magyar", direction: "ltr", htmlLang: "hu-HU" },
    id: { label: "Bahasa Indonesia", direction: "ltr", htmlLang: "id-ID" },
    it: { label: "Italiano", direction: "ltr", htmlLang: "it-IT" },
    ja: { label: "日本語", direction: "ltr", htmlLang: "ja-JP" },
    ko: { label: "한국어", direction: "ltr", htmlLang: "ko-KR" },
    ms: { label: "Bahasa Melayu", direction: "ltr", htmlLang: "ms-MY" },
    nb: { label: "Norsk Bokmål", direction: "ltr", htmlLang: "nb-NO" },
    nl: { label: "Nederlands", direction: "ltr", htmlLang: "nl-NL" },
    pl: { label: "Polski", direction: "ltr", htmlLang: "pl-PL" },
    pt: { label: "Português", direction: "ltr", htmlLang: "pt-PT" },
    ro: { label: "Română", direction: "ltr", htmlLang: "ro-RO" },
    ru: { label: "Русский", direction: "ltr", htmlLang: "ru-RU" },
    sk: { label: "Slovenčina", direction: "ltr", htmlLang: "sk-SK" },
    sv: { label: "Svenska", direction: "ltr", htmlLang: "sv-SE" },
    th: { label: "ไทย", direction: "ltr", htmlLang: "th-TH" },
    tr: { label: "Türkçe", direction: "ltr", htmlLang: "tr-TR" },
    uk: { label: "Українська", direction: "ltr", htmlLang: "uk-UA" },
    vi: { label: "Tiếng Việt", direction: "ltr", htmlLang: "vi-VN" },
    "zh-Hans": { label: "简体中文", direction: "ltr", htmlLang: "zh-CN" },
    "zh-Hant": { label: "繁體中文", direction: "ltr", htmlLang: "zh-TW" },
  },
};

const config: Config = {
  title: "ZeroPlay",
  tagline: "Start from Zero, Play to Infinite",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: URL,
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: ORGANIZATION_NAME, // Usually your GitHub org/user name.
  projectName: PROJECT_NAME, // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: I18N_CONFIG,

  markdown: {
    mermaid: true,
  },
  plugins: [],

  customFields: customFields,

  presets: [
    [
      "classic",
      {
        docs: {
          path: "docs",
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: REPO + "/tree/main/website/",
          // showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  scripts: [
    {
      src: "data:text/javascript;charset=utf-8," + encodeURIComponent(`window.__ZERO_LOCALE_CONFIG=${JSON.stringify({
        defaultLocale: I18N_CONFIG.defaultLocale,
        locales: I18N_CONFIG.locales,
      })};`),
      async: false,
    },
    { src: "/js/clean-mode-init.js", async: false },
  ],
  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 5,
    },
    navbar: {
      title: "",
      logo: {
        alt: "ZeroPlay Logo",
        src: "img/logo.png",
      },
      items: [
        // Left links
        {
          to: "/games",
          position: "left",
          label: "Games",
        },
        {
          to: "/about",
          position: "left",
          label: "About",
        },
        {
          to: "/contact",
          position: "left",
          label: "Contact",
        },
        {
          type: "doc",
          position: "left",
          docId: "legal/terms-of-service",
          label: "Docs",
        },
        // Right links
        {
          type: "localeDropdown",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          label: "Terms of Service",
          to: "/docs/legal/terms-of-service",
        },
        {
          label: "Privacy Policy",
          to: "/docs/legal/privacy-policy",
        },
      ],
      logo: {
        alt: "ZeroPlay Logo",
        src: "img/logo_banner.png",
        href: "/",
      },
      copyright: COPYRIGHT,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
