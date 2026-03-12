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
      type: "category",
      label: "Using Osaurus",
      collapsed: false,
      items: [
        {
          type: "doc",
          id: "chat-interface",
          label: "Chat Interface",
        },
        {
          type: "doc",
          id: "agents",
          label: "Agents",
        },
        {
          type: "doc",
          id: "memory",
          label: "Memory",
        },
        {
          type: "doc",
          id: "skills",
          label: "Skills",
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
          id: "work-mode",
          label: "Work Mode",
        },
        {
          type: "doc",
          id: "sandbox",
          label: "Sandbox",
        },
        {
          type: "doc",
          id: "identity",
          label: "Identity",
        },
        {
          type: "doc",
          id: "relay",
          label: "Relay",
        },
        {
          type: "doc",
          id: "voice",
          label: "Voice Input",
        },
        {
          type: "doc",
          id: "multi-window",
          label: "Multi-Window",
        },
        {
          type: "doc",
          id: "keyboard-shortcuts",
          label: "Keyboard Shortcuts",
        },
      ],
    },
    {
      type: "category",
      label: "Developer Guide",
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "cli",
          label: "CLI Reference",
        },
        {
          type: "doc",
          id: "api",
          label: "API Reference",
        },
        {
          type: "doc",
          id: "sdk-examples",
          label: "SDK Examples",
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
      label: "MCP & Tools",
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
          label: "Basic Configuration",
        },
        {
          type: "doc",
          id: "shared-configuration",
          label: "Shared Configuration",
        },
        {
          type: "doc",
          id: "models",
          label: "Model Management",
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
      label: "Resources",
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "benchmarks",
          label: "Benchmarks",
        },
        {
          type: "doc",
          id: "developer",
          label: "Building from Source",
        },
      ],
    },
  ],
};

export default sidebars;
