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
    mermaid: true,
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
          editUrl: "https://github.com/osaurus-ai/osaurus-docs/edit/main/",
          showLastUpdateTime: true,
        },
        blog: false,
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          filename: "sitemap.xml",
        },
        googleTagManager: {
          containerId: "GTM-WCVDZS73",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    "@docusaurus/theme-mermaid",
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: "/",
        highlightSearchTermsOnTargetPage: true,
      },
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
      respectPrefersColorScheme: true,
      disableSwitch: false,
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
          to: "/installation",
          label: "Install",
          position: "left",
        },
        {
          to: "/api",
          label: "API",
          position: "left",
        },
        {
          href: "https://osaurus.ai",
          label: "osaurus.ai",
          position: "right",
        },
        {
          href: "https://discord.gg/osaurus",
          label: "Discord",
          position: "right",
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
          title: "Get Started",
          items: [
            { label: "Overview", to: "/" },
            { label: "Installation", to: "/installation" },
            { label: "Quick Start", to: "/quickstart" },
            { label: "Security & Privacy", to: "/security" },
          ],
        },
        {
          title: "Use",
          items: [
            { label: "Chat", to: "/chat" },
            { label: "Agents", to: "/agents" },
            { label: "Models", to: "/models" },
            { label: "Memory", to: "/memory" },
          ],
        },
        {
          title: "Build",
          items: [
            { label: "Architecture", to: "/architecture" },
            { label: "HTTP API", to: "/api" },
            { label: "CLI", to: "/cli" },
            { label: "Tools & Plugins", to: "/tools" },
          ],
        },
        {
          title: "Community",
          items: [
            { label: "osaurus.ai", href: "https://osaurus.ai" },
            { label: "GitHub", href: "https://github.com/osaurus-ai/osaurus" },
            { label: "Discord", href: "https://discord.gg/osaurus" },
            { label: "Hugging Face", href: "https://huggingface.co/OsaurusAI" },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Osaurus`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    mermaid: {
      theme: { light: "neutral", dark: "dark" },
      options: {
        fontFamily: "futura-pt, -apple-system, sans-serif",
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
