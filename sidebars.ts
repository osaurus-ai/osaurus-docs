import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: "doc",
      id: "intro",
      label: "Overview",
    },
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
      items: [
        {
          type: "doc",
          id: "installation",
          label: "Installation",
        },
        {
          type: "doc",
          id: "quickstart",
          label: "Quick Start",
        },
      ],
    },
    {
      type: "doc",
      id: "security",
      label: "Security & Privacy",
    },
    {
      type: "category",
      label: "For Everyone",
      collapsed: false,
      items: [
        {
          type: "doc",
          id: "chat",
          label: "Chat",
        },
        {
          type: "doc",
          id: "agent-loop",
          label: "Agent Loop",
        },
        {
          type: "doc",
          id: "agents",
          label: "Agents",
        },
        {
          type: "doc",
          id: "models",
          label: "Models",
        },
        {
          type: "doc",
          id: "memory",
          label: "Memory",
        },
        {
          type: "doc",
          id: "skills",
          label: "Skills & Methods",
        },
        {
          type: "doc",
          id: "voice",
          label: "Voice Input",
        },
        {
          type: "doc",
          id: "schedules",
          label: "Schedules",
        },
        {
          type: "doc",
          id: "watchers",
          label: "Watchers",
        },
        {
          type: "doc",
          id: "themes",
          label: "Themes",
        },
        {
          type: "doc",
          id: "identity",
          label: "Identity & Access",
        },
        {
          type: "doc",
          id: "relay",
          label: "Relay",
        },
      ],
    },
    {
      type: "category",
      label: "For Developers",
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "architecture",
          label: "Architecture",
        },
        {
          type: "category",
          label: "API Reference",
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "api",
              label: "HTTP API",
            },
            {
              type: "doc",
              id: "sdk-examples",
              label: "SDK Examples",
            },
            {
              type: "doc",
              id: "cli",
              label: "CLI",
            },
            {
              type: "doc",
              id: "integrations",
              label: "Integrations",
            },
          ],
        },
        {
          type: "category",
          label: "Tools & Plugins",
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "tools",
              label: "Tools & Plugins",
            },
            {
              type: "doc",
              id: "plugin-authoring",
              label: "Plugin Authoring",
            },
            {
              type: "doc",
              id: "tool-contract",
              label: "Tool Contract",
            },
            {
              type: "doc",
              id: "sandbox",
              label: "Sandbox Internals",
            },
          ],
        },
        {
          type: "category",
          label: "Providers",
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "remote-providers",
              label: "Remote Providers",
            },
            {
              type: "doc",
              id: "remote-mcp-providers",
              label: "Remote MCP Providers",
            },
          ],
        },
        {
          type: "category",
          label: "Configuration",
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "configuration",
              label: "Server Settings",
            },
            {
              type: "doc",
              id: "storage",
              label: "Storage & Encryption",
            },
            {
              type: "doc",
              id: "models/apple-intelligence",
              label: "Apple Intelligence",
            },
          ],
        },
        {
          type: "category",
          label: "Internals",
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "identity-internals",
              label: "Identity Cryptography",
            },
            {
              type: "doc",
              id: "inference-runtime",
              label: "Inference Runtime",
            },
            {
              type: "doc",
              id: "developer-tools",
              label: "Developer Tools",
            },
            {
              type: "doc",
              id: "developer",
              label: "Building from Source",
            },
          ],
        },
      ],
    },
  ],
};

export default sidebars;
