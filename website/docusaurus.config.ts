import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import type { Options as ClientRedirectsOptions } from "@docusaurus/plugin-client-redirects";

const URL = "https://zeroplay.io";
const ORGANIZATION_NAME = "mkideal";
const PROJECT_NAME = "zeroplay";
const REPO = `https://github.com/${ORGANIZATION_NAME}/${PROJECT_NAME}`;

const customFields = {
  version: "0.0.1",
  repo: REPO,
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
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

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
          type: "doc",
          position: "left",
          docId: "legal/terms-of-service",
          label: "Docs",
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
      copyright: `Copyright © ${new Date().getFullYear()} zeroplay.io, Inc (成都度若飞网络科技有限公司).`,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
