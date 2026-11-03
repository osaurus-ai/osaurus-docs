---
title: Windows and Mac
sidebar_label: Windows and Mac
description: What Osaurus for Windows shares with Osaurus for Mac, what works differently, and what isn't on Windows.
---

# Windows and Mac

Osaurus for Windows is its own app, written for Windows, so it isn't identical to the Mac app. It shares the ideas, your [account](/glossary#identity), and the local server other apps talk to. Most of the Mac pages on this site describe features Windows has too, but menu names, file paths, and how models run differ. This page lists the differences, for version 0.1.9.

## Works the same way

These work as the Mac pages describe; only the menu path differs (the Mac's **Settings…** is **Settings** at the bottom of the agent sidebar on Windows):

- [Chat](/chat)
- [iPhone pairing](/windows/mobile), [Public Links](/relay), and the [Secure Channel](/secure-channel)
- The [Osaurus Router](/osaurus-router) and Osaurus Cloud
- The [HTTP API](/api) on `http://127.0.0.1:1337`, with the same OpenAI, Anthropic, Ollama, and MCP endpoints
- [Osaurus Bundles](/bundles) and declarative [Configuration](/configuration), through the [`osaurus` command](/windows/cli)

## Works differently

| | Mac | Windows |
|---|---|---|
| Settings | **Settings…** window (`⌘,`) | **Settings** tab, opened from the bottom of the agent sidebar |
| [Local models](/windows/models) | MLX models on Apple Silicon | GGUF models through llama.cpp, on an NVIDIA graphics card (CUDA), any recent graphics card (Vulkan), or the processor. Choose in **Settings → Models → Local engine → Accelerator** |
| [Sandbox](/windows/sandbox) | A Linux virtual machine | Linux through WSL, or a Windows engine with no setup (Windows 11 24H2 with the August 2026 update). See **Settings → Sandbox** |
| [Claude Code](/windows/claude-code) | A [Runtime](/harness-runtimes) | A provider: **Settings → Providers → Add provider → Use Claude Code**. Needs the `claude` command installed and signed in |
| Data folder | `~/.osaurus` | `%LOCALAPPDATA%\osaurus` |
| Secrets | macOS Keychain | Encrypted database, key protected by Windows DPAPI; bundle secrets in Credential Manager |
| Command line | [`osaurus`](/cli) | [`osaurus`](/windows/cli), with a few differences |
| Updates | Sparkle, in the app | Microsoft Store |

These features work much as on the Mac, with differences in where things are and what's included. Each Windows page lists them:

- [Agents](/windows/agents), including templates, sharing, the Orchestrator, and delegation
- [Memory](/windows/memory)
- [Browser Use](/windows/browser) and [Web Search](/windows/web-search)
- [Skills, Commands & MCP](/windows/skills-and-mcp)
- [Schedules & Watchers](/windows/automation), including wake-ups and the private database
- [Agent Channels](/windows/channels) and [Workspaces](/windows/workspaces)

## Windows-specific

- **Model fit.** Each local model shows whether it fits your PC: **Runs well**, **Tight fit**, **GPU + RAM** (part of it runs from system memory), or **Too large**, judged against what your graphics card has free right now.
- **[Contained commands](/windows/sandbox#contained-commands-in-your-folder).** In a folder you attach, an agent's commands can be kept to that folder, unable to read your other files or credentials (Windows 11 24H2 with the August 2026 update). Each agent can turn this off in its own settings.
- **System tray.** Closing the window keeps Osaurus running in the tray, and **Settings → Behavior → Start at login** starts it there when you sign in.
- **Privacy Filter on by default.** Personal details are replaced before anything goes to a cloud model, and Osaurus shows you what you typed before it's sent. See [Privacy Filter](/windows/privacy-filter).
- **Crash reports on by default.** Turn them off in **Settings → Data & privacy → Send crash reports**. Usage data is sent only if you agree during setup.

## Not on Windows

These are Mac features with no Windows version:

- [Apple Intelligence](/models/apple-intelligence)
- [Computer Use](/computer-use)
- [Apple Apps](/apple-apps)
- [Shortcuts, Spotlight & Siri](/app-intents)

Release notes for each Windows version are posted in the [community forum](https://community.osaurus.ai/tag/windows/2).
