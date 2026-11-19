---
title: Windows and Mac
sidebar_label: Windows and Mac
description: What Osaurus for Windows shares with Osaurus for Mac, what works differently, and what isn't on Windows.
---

# Windows and Mac

Osaurus for Windows is its own app, written for Windows, so it isn't identical to the Mac app. It shares the ideas, your [Osaurus ID](/glossary#osaurus-id), and the local server other apps talk to. Most features exist on both, but menu names, file paths, and how models run differ. This page lists the differences, for Windows version 1.0.4.

## Works the same way

These work as the Mac pages describe. The Windows pages linked here give the Windows menu paths:

- [Workflows](/windows/workflows), built with the [Architect](/glossary#architect), and shared as a file or on the Osaurus store
- [Projects](/windows/projects) and [Memory](/windows/memory)
- The [Orchestrator](/windows/agents#the-orchestrator) and its helpers
- [Devices & Sync](/windows/devices), with the same pairing and end-to-end encryption as the Mac
- The [Secure Channel](/secure-channel), when another Osaurus or a teammate talks to one of your agents
- The [Osaurus Router](/osaurus-router) and Osaurus Cloud
- The [HTTP API](/api) on `http://127.0.0.1:1337`, with the same OpenAI, Anthropic, Ollama, and MCP endpoints
- [Osaurus Bundles](/bundles) and declarative [Configuration](/configuration), through the [`osaurus` command](/windows/cli). A configuration exported on a Mac applies on Windows; settings that only make sense on a Mac are listed instead of refusing the file.

## Works differently

| | Mac | Windows |
|---|---|---|
| Settings | Inside the main window (the gear on the navigation rail, or `⌘,`) | Inside the main window, from **Settings** at the bottom of the sidebar, in nine sections. See [Chat](/windows/chat) |
| [Local models](/windows/models) | MLX models on Apple Silicon | GGUF models through llama.cpp, on an NVIDIA graphics card (CUDA), any recent graphics card (Vulkan), or the processor. See **Settings → Models → Models** |
| [Images and video](/windows/images) | Made on your Mac | Made on your graphics card |
| [Knowledge](/windows/knowledge) | Each agent searches the folders you tick for it | Each project searches the folders it turns on |
| Plugins | Native [plugins](/tools) and [Claude Plugins](/claude-plugins) | No native plugins. Paste a Claude plugin's link into a chat and Osaurus installs its skills; see [Skills, Commands & MCP](/windows/skills-and-mcp) |
| [Sandbox](/windows/sandbox) | A Linux virtual machine | Linux through WSL, or a Windows engine with no setup (Windows 11 24H2 with the August 2026 update). See **Settings → Tools → Sandbox** |
| [Claude Code](/windows/claude-code) and other agent programs | [Runtimes](/harness-runtimes) | Providers, under **Settings → Models → Providers**. GitHub Copilot and Antigravity are there too: see [Coding plans](/windows/coding-plans) |
| Secrets | The [Vault](/vault), in the macOS Keychain | Encrypted in Osaurus's database, with the key protected by Windows; bundle secrets in Credential Manager. There is no Vault page |
| Reaching your agents from elsewhere | [Remote Access](/remote-access) and public links | Your own devices through [Devices & Sync](/windows/devices); shared agents through [Apps & Devices](/windows/connections) and [Workspaces](/windows/workspaces). There is no Remote Access page |
| Data folder | `~/.osaurus` | `%LOCALAPPDATA%\osaurus` |
| Command line | [`osaurus`](/cli) | [`osaurus`](/windows/cli), with a few differences |
| Updates | In the app (Sparkle) | Microsoft Store |

## Windows-specific

- **Model fit.** Each local model shows whether it fits your PC, judged against what your graphics card has free right now, and its settings page shows where it will run and how fast it should be. See [Local Models](/windows/models).
- **[Contained commands](/windows/sandbox).** In a folder you attach, an agent's commands can be kept to that folder, unable to read your other files or credentials (Windows 11 24H2 with the August 2026 update).
- **[Coding plans](/windows/coding-plans).** Use GitHub Copilot or Antigravity with your own subscription. They work only through Osaurus's tools, so they follow the same approvals as any other agent.
- **Notification area.** Closing the window keeps Osaurus running in the notification area, and **Settings → General → Behavior → Start at login** starts it there when you sign in.
- **Privacy Filter on by default.** Personal details are replaced before anything goes to a cloud model, and Osaurus shows you what you typed before it's sent. See [Privacy Filter](/windows/privacy-filter).
- **Crash reports on by default.** Turn them off in **Settings → Privacy → Data**. Usage data is shared unless you untick its box during setup (it starts ticked), and you can turn it off there too. See [Your Data](/windows/data-and-privacy).

## Not on Windows

These are Mac features with no Windows version:

- [Apple Intelligence](/models/apple-intelligence)
- [Computer Use](/computer-use)
- [Apple Apps](/apple-apps)
- [Shortcuts, Spotlight & Siri](/app-intents)
- Meeting transcription (on the Mac, part of [Voice](/voice))
- [Log in with Osaurus](/login-with-osaurus) for your own apps
- [Upgrading from Classic](/upgrading), which only applies to older Mac versions

Each version's release notes are in the app under **Settings → About**.
