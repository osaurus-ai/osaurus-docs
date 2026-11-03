import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// Osaurus for Windows. Pages live in windows/ and are served under /windows.
const sidebars: SidebarsConfig = {
  windowsSidebar: [
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
        { type: "doc", id: "installation", label: "Installation" },
        { type: "doc", id: "quickstart", label: "Quick Start" },
        { type: "doc", id: "mac-differences", label: "Windows and Mac" },
        { type: "doc", id: "troubleshooting", label: "Troubleshooting" },
      ],
    },
    {
      type: "category",
      label: "Using Osaurus",
      collapsed: false,
      items: [
        { type: "doc", id: "models", label: "Local Models" },
        { type: "doc", id: "claude-code", label: "Claude Code" },
        { type: "doc", id: "sandbox", label: "Sandbox" },
        { type: "doc", id: "mobile", label: "iPhone" },
        { type: "doc", id: "account", label: "Account" },
      ],
    },
    {
      type: "category",
      label: "Privacy & Trust",
      collapsed: false,
      items: [
        { type: "doc", id: "privacy-filter", label: "Privacy Filter" },
        { type: "doc", id: "data-and-privacy", label: "Your Data" },
      ],
    },
    {
      type: "category",
      label: "For Developers",
      collapsed: false,
      items: [
        { type: "doc", id: "connections", label: "Apps & Devices" },
        { type: "doc", id: "cli", label: "CLI" },
      ],
    },
  ],
};

export default sidebars;
