import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Osaurus Docs",
  tagline: "Native Apple Silicon local LLM server",
  favicon: "img/osaurus-squirqle.svg",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://docs.osaurus.ai",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "osaurus-ai", // Usually your GitHub org/user name.
  projectName: "osaurus-docs", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/",
        },
        blog: false,
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          filename: "sitemap.xml",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      "vercel-analytics",
      {
        mode: "auto",
      },
    ],
  ],

  stylesheets: [
    {
      href: "https://use.typekit.net/ijx2vmq.css",
      type: "text/css",
    },
  ],

  headTags: [
    {
      tagName: "meta",
      attributes: { name: "theme-color", content: "#ffffea" },
    },
    {
      tagName: "meta",
      attributes: {
        property: "og:type",
        content: "website",
      },
    },
    {
      tagName: "meta",
      attributes: {
        property: "og:title",
        content: "Osaurus — Local-First AI Runtime for Apple Silicon",
      },
    },
    {
      tagName: "meta",
      attributes: {
        property: "og:description",
        content:
          "Run AI models locally with complete privacy. OpenAI- & Ollama-compatible APIs, powered by Apple MLX.",
      },
    },
    {
      tagName: "meta",
      attributes: {
        property: "og:image",
        content: "/img/og-image.png",
      },
    },
    {
      tagName: "meta",
      attributes: {
        name: "twitter:card",
        content: "summary_large_image",
      },
    },
    {
      tagName: "meta",
      attributes: {
        name: "twitter:title",
        content: "Osaurus — Local-First AI Runtime for Apple Silicon",
      },
    },
    {
      tagName: "meta",
      attributes: {
        name: "twitter:description",
        content:
          "Run AI models locally with complete privacy and blazing performance.",
      },
    },
    {
      tagName: "meta",
      attributes: {
        name: "twitter:image",
        content: "/img/og-image.png",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "canonical",
        href: "https://docs.osaurus.ai",
      },
    },
    {
      tagName: "script",
      attributes: {
        type: "application/ld+json",
      },
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Osaurus",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "macOS",
        description:
          "The fastest and most private AI runtime built specifically for Apple Silicon. Run AI models locally with complete privacy and blazing performance.",
        url: "https://osaurus.ai",
        author: {
          "@type": "Organization",
          name: "Osaurus",
          url: "https://osaurus.ai",
        },
      }),
    },
  ],

  themeConfig: {
    colorMode: {
      defaultMode: "light",
      respectPrefersColorScheme: false,
      disableSwitch: true,
    },
    // Replace with your project's social card
    image: "img/og-image.png",
    metadata: [
      {
        name: "description",
        content:
          "Osaurus — the fastest and most private AI runtime built specifically for Apple Silicon. Run AI models locally with complete privacy and blazing performance.",
      },
      {
        name: "keywords",
        content:
          "Osaurus, local AI, Apple Silicon, MLX, OpenAI API, Ollama, Swift, SwiftNIO, macOS, privacy",
      },
      { name: "robots", content: "index, follow" },
    ],
    navbar: {
      hideOnScroll: false,
      title: "",
      logo: {
        alt: "Osaurus",
        src: "img/osaurus-wordmark-blue.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Docs",
        },
        {
          href: "https://github.com/osaurus-ai/osaurus",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "light",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Osaurus Overview",
              to: "/",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/osaurus-ai/osaurus",
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Osaurus`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
