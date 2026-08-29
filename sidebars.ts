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
        { type: "doc", id: "installation", label: "Installation" },
        { type: "doc", id: "quickstart", label: "Quick Start" },
      ],
    },
    {
      type: "category",
      label: "Using Osaurus",
      collapsed: false,
      items: [
        { type: "doc", id: "chat", label: "Chat" },
        { type: "doc", id: "orchestrator", label: "Orchestrator" },
        { type: "doc", id: "agents", label: "Agents" },
        { type: "doc", id: "projects", label: "Projects" },
        { type: "doc", id: "agent-loop", label: "Tasks" },
        { type: "doc", id: "subagents", label: "Subagents" },
        { type: "doc", id: "image-generation", label: "Image & Video" },
        { type: "doc", id: "computer-use", label: "Computer Use" },
        { type: "doc", id: "browser-use", label: "Browser Use" },
        { type: "doc", id: "web-search", label: "Web Search" },
        { type: "doc", id: "voice", label: "Voice" },
        { type: "doc", id: "text-to-speech", label: "Text-to-Speech" },
        { type: "doc", id: "app-intents", label: "Shortcuts, Spotlight & Siri" },
        { type: "doc", id: "claude-plugins", label: "Claude Plugins" },
        { type: "doc", id: "themes", label: "Themes" },
      ],
    },
    {
      type: "category",
      label: "Models & Knowledge",
      collapsed: true,
      items: [
        { type: "doc", id: "models", label: "Models" },
        { type: "doc", id: "models/apple-intelligence", label: "Apple Intelligence" },
        { type: "doc", id: "osaurus-router", label: "Osaurus Router" },
        { type: "doc", id: "memory", label: "Memory" },
        { type: "doc", id: "knowledge", label: "Knowledge" },
        { type: "doc", id: "skills", label: "Skills" },
      ],
    },
    {
      type: "category",
      label: "Automation",
      collapsed: true,
      items: [
        { type: "doc", id: "schedules", label: "Schedules" },
        { type: "doc", id: "watchers", label: "Watchers" },
        { type: "doc", id: "agent-db", label: "Agent DB & Self-Scheduling" },
      ],
    },
    {
      type: "category",
      label: "Sharing & Access",
      collapsed: true,
      items: [
        { type: "doc", id: "identity", label: "Identity" },
        { type: "doc", id: "relay", label: "Public Links" },
        { type: "doc", id: "secure-channel", label: "Secure Channel" },
        { type: "doc", id: "agent-channels", label: "Agent Channels" },
      ],
    },
    {
      type: "category",
      label: "Privacy & Trust",
      collapsed: true,
      items: [
        { type: "doc", id: "security", label: "Security & Privacy" },
        { type: "doc", id: "privacy-filter", label: "Privacy Filter" },
        { type: "doc", id: "telemetry", label: "Telemetry" },
      ],
    },
    {
      type: "category",
      label: "For Developers",
      collapsed: true,
      items: [
        { type: "doc", id: "architecture", label: "Architecture" },
        { type: "doc", id: "api", label: "HTTP API" },
        { type: "doc", id: "sdk-examples", label: "SDK Examples" },
        { type: "doc", id: "cli", label: "CLI" },
        { type: "doc", id: "integrations", label: "Integrations" },
        {
          type: "category",
          label: "Tools & Plugins",
          collapsed: true,
          items: [
            { type: "doc", id: "tools", label: "Tools & Plugins" },
            { type: "doc", id: "plugin-authoring", label: "Plugin Authoring" },
            { type: "doc", id: "tool-contract", label: "Tool Contract" },
            { type: "doc", id: "methods", label: "Methods" },
            { type: "doc", id: "sandbox", label: "Sandbox Internals" },
          ],
        },
        {
          type: "category",
          label: "Providers",
          collapsed: true,
          items: [
            { type: "doc", id: "remote-providers", label: "Remote Providers" },
            { type: "doc", id: "remote-mcp-providers", label: "Remote MCP Providers" },
          ],
        },
        {
          type: "category",
          label: "Configuration",
          collapsed: true,
          items: [
            { type: "doc", id: "configuration", label: "Configuration" },
            { type: "doc", id: "global-proxy", label: "Global Proxy" },
            { type: "doc", id: "storage", label: "Storage & Encryption" },
          ],
        },
        {
          type: "category",
          label: "Internals",
          collapsed: true,
          items: [
            { type: "doc", id: "memory-internals", label: "Memory Internals" },
            { type: "doc", id: "identity-internals", label: "Identity Cryptography" },
            { type: "doc", id: "inference-runtime", label: "Inference Runtime" },
            { type: "doc", id: "watcher-internals", label: "Watcher Internals" },
            { type: "doc", id: "developer-tools", label: "Developer Tools" },
            { type: "doc", id: "developer", label: "Building from Source" },
          ],
        },
      ],
    },
  ],
};

export default sidebars;
