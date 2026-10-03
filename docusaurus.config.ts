import type { PrismTheme } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Code highlighting tuned to the osaurus.ai cream/teal/lime palette.
const osaurusPrismTheme: PrismTheme = {
  plain: { color: "#11100F", backgroundColor: "#EEEEE7" },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "#66635F", fontStyle: "italic" } },
    { types: ["punctuation", "operator"], style: { color: "#53504C" } },
    { types: ["keyword", "atrule", "important", "selector"], style: { color: "#004243", fontWeight: "600" } },
    { types: ["tag", "deleted"], style: { color: "#004243" } },
    { types: ["string", "char", "attr-value", "inserted", "regex"], style: { color: "#4F7300" } },
    { types: ["number", "boolean", "constant", "symbol", "unit"], style: { color: "#A3361A" } },
    { types: ["function", "class-name", "maybe-class-name"], style: { color: "#016466" } },
    { types: ["property", "attr-name", "key", "variable", "parameter"], style: { color: "#015052" } },
    { types: ["builtin", "namespace", "url"], style: { color: "#2A2724" } },
    { types: ["entity"], style: { color: "#A3361A", cursor: "help" } },
  ],
};

const config: Config = {
  title: "Osaurus Docs",
  tagline: "Own your AI — a local-first agent harness for Apple Silicon",
  favicon: "img/favicon-64.png",

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

  headTags: [
    ...[
      "/fonts/inter-tight-latin.woff2",
      "/fonts/line-seed-jp-700-latin.woff2",
    ].map((href) => ({
      tagName: "link",
      attributes: {
        rel: "preload",
        href,
        as: "font",
        type: "font/woff2",
        crossorigin: "anonymous",
      },
    })),
    {
      tagName: "link",
      attributes: { rel: "apple-touch-icon", href: "/img/apple-touch-icon.png" },
    },
    {
      tagName: "meta",
      attributes: { name: "theme-color", content: "#F7F6F2" },
    },
    {
      tagName: "meta",
      attributes: { name: "color-scheme", content: "light" },
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
      attributes: { name: "twitter:site", content: "@OsaurusAI" },
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
        src: "img/osaurus-wordmark.svg",
        width: 115,
        height: 32,
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
          href: "https://community.osaurus.ai/",
          label: "Community",
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
        {
          type: "search",
          position: "right",
        },
        {
          href: "https://github.com/osaurus-ai/osaurus/releases/latest/download/Osaurus.dmg",
          label: "Download for Mac",
          position: "right",
          className: "navbar-cta",
        },
      ],
    },
    footer: {
      style: "dark",
      logo: {
        alt: "Osaurus",
        src: "img/osaurus-wordmark-white.svg",
        href: "https://osaurus.ai",
        width: 101,
        height: 28,
      },
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
            { label: "Community", href: "https://community.osaurus.ai/" },
            { label: "Discord", href: "https://discord.gg/osaurus" },
            { label: "GitHub", href: "https://github.com/osaurus-ai/osaurus" },
            { label: "Hugging Face", href: "https://huggingface.co/OsaurusAI" },
          ],
        },
        {
          title: "Follow",
          items: [
            { label: "X", href: "https://x.com/OsaurusAI" },
            { label: "YouTube", href: "https://www.youtube.com/@OsaurusAI" },
            { label: "Reddit", href: "https://reddit.com/r/osaurus" },
            { label: "Blog", href: "https://osaurus.ai/blog" },
            { label: "Changelog", href: "https://osaurus.ai/changelog" },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Osaurus`,
    },
    prism: {
      theme: osaurusPrismTheme,
      additionalLanguages: ["bash", "json", "swift", "yaml"],
    },
    mermaid: {
      theme: { light: "base", dark: "base" },
      options: {
        fontFamily: '"Inter Tight", -apple-system, sans-serif',
        themeVariables: {
          fontFamily: '"Inter Tight", -apple-system, sans-serif',
          fontSize: "14px",
          background: "#FDFCFA",
          primaryColor: "#DFECE8",
          primaryBorderColor: "#004243",
          primaryTextColor: "#11100F",
          secondaryColor: "#F0F2CF",
          secondaryBorderColor: "#8DC115",
          secondaryTextColor: "#11100F",
          tertiaryColor: "#EEEEE7",
          tertiaryBorderColor: "#ADACA6",
          tertiaryTextColor: "#11100F",
          lineColor: "#53504C",
          textColor: "#2A2724",
          mainBkg: "#DFECE8",
          nodeBorder: "#004243",
          clusterBkg: "#F7F6F2",
          clusterBorder: "#E0E0D6",
          edgeLabelBackground: "#FDFCFA",
          noteBkgColor: "#F0F2CF",
          noteBorderColor: "#8DC115",
          actorBkg: "#DFECE8",
          actorBorder: "#004243",
          signalColor: "#2A2724",
        },
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
