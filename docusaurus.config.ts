import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Osaurus Docs",
  tagline: "Own your AI — a local-first agent harness for Apple Silicon",
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

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

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
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          { from: "/work-mode", to: "/agent-loop" },
          { from: "/chat-interface", to: "/chat" },
          { from: "/multi-window", to: "/chat" },
          { from: "/keyboard-shortcuts", to: "/chat" },
          { from: "/shared-configuration", to: "/integrations" },
          { from: "/benchmarks", to: "/inference-runtime" },
        ],
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
        content: "Osaurus — Own Your AI on Apple Silicon",
      },
    },
    {
      tagName: "meta",
      attributes: {
        property: "og:description",
        content:
          "Run AI agents with memory, tools, and identity entirely on your Mac — offline and open source. OpenAI-, Anthropic-, Ollama-, and MCP-compatible so any client connects.",
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
        content: "Osaurus — Own Your AI on Apple Silicon",
      },
    },
    {
      tagName: "meta",
      attributes: {
        name: "twitter:description",
        content:
          "Own your AI: local-first agents with memory, tools, and identity on Apple Silicon. Offline, open source, and API-compatible with OpenAI, Anthropic, and Ollama.",
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
          "Open-source, local-first AI harness for Apple Silicon. Run AI agents with persistent memory, tools, and a cryptographic identity entirely on your Mac — offline. Compatible with the OpenAI, Anthropic, Ollama, and MCP APIs.",
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
          "Osaurus is an open-source, local-first AI harness for Apple Silicon — run AI agents with persistent memory, tools, and a cryptographic identity on your Mac, fully offline. Compatible with the OpenAI, Anthropic, Ollama, and MCP APIs.",
      },
      {
        name: "keywords",
        content:
          "Osaurus, local AI, AI agents, AI harness, agent memory, Apple Silicon, MLX, OpenAI API, Anthropic API, Ollama, MCP, identity, private AI, offline AI, macOS, Swift",
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
