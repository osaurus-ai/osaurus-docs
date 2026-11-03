---
title: Windows and Mac
sidebar_label: Windows and Mac
description: What Osaurus for Windows shares with Osaurus for Mac, what works differently, and what isn't on Windows yet.
---

# Windows and Mac

Osaurus for Windows is its own app, written for Windows, so it isn't identical to the Mac app. It shares the ideas, your [account](/glossary#identity), and the local server other apps talk to. Most of the Mac pages on this site describe features Windows has too, but menu names, file paths, and how models run differ. This page lists the differences, for version 0.1.9.

## Works the same way

These work as the Mac pages describe; only the menu path differs (the Mac's **Settings…** is **Settings** at the bottom of the agent sidebar on Windows):

- [Chat](/chat), [Agents](/agents), [Agent Templates](/agent-templates), the [Orchestrator](/orchestrator), and [Subagents](/subagents)
- [Memory](/memory) and [Skills](/skills)
- [Browser Use](/browser-use) and [Web Search](/web-search)
- [Schedules](/schedules), [Watchers](/watchers), and [Agent DB & Self-Scheduling](/agent-db)
- [Workspaces](/workspaces), [Mobile](/mobile) pairing, [Public Links](/relay), the [Secure Channel](/secure-channel), and [Agent Channels](/agent-channels)
- The [Osaurus Router](/osaurus-router) and Osaurus Cloud
- The [HTTP API](/api) on `http://127.0.0.1:1337`, with the same OpenAI, Anthropic, Ollama, and MCP endpoints
- [Osaurus Bundles](/bundles) and declarative [Configuration](/configuration), through the [`osaurus` command](/windows/cli)

## Works differently

| | Mac | Windows |
|---|---|---|
| Settings | **Settings…** window (`⌘,`) | **Settings** tab, opened from the bottom of the agent sidebar |
| Local models | MLX models on Apple Silicon | GGUF models through llama.cpp, on an NVIDIA graphics card (CUDA), any recent graphics card (Vulkan), or the processor. Choose in **Settings → Models → Local engine → Accelerator** |
| Sandbox | A Linux virtual machine | Linux through WSL, or a Windows engine with no setup (Windows 11 24H2 with the August 2026 update). See **Settings → Sandbox** |
| Claude Code | A [Runtime](/harness-runtimes) | A provider: **Settings → Providers → Add provider → Use Claude Code**. Needs the `claude` command installed and signed in |
| Data folder | `~/.osaurus` | `%LOCALAPPDATA%\osaurus` |
| Secrets | macOS Keychain | Encrypted database, key protected by Windows DPAPI; bundle secrets in Credential Manager |
| Command line | [`osaurus`](/cli) | [`osaurus`](/windows/cli), with a few differences |
| Updates | Sparkle, in the app | Microsoft Store |

## Windows-specific

- **Model fit.** Each local model shows whether it fits your PC: **Runs well**, **Tight fit**, **GPU + RAM** (part of it runs from system memory), or **Too large**, judged against what your graphics card has free right now.
- **Contained commands.** In a folder you attach, an agent's commands can be kept to that folder, unable to read your other files or credentials (Windows 11 24H2 with the August 2026 update). Each agent can turn this off in its own settings.
- **System tray.** Closing the window keeps Osaurus running in the tray, and **Settings → Behavior → Start at login** starts it there when you sign in.
- **Privacy Filter on by default.** Personal details are replaced before anything goes to a cloud model, and Osaurus shows you what you typed before it's sent. See **Settings → Privacy filter**.
- **Crash reports on by default.** Turn them off in **Settings → Data & privacy → Send crash reports**. Usage data is sent only if you agree during setup.

## Not on Windows

These are Mac features with no Windows version:

- [Apple Intelligence](/models/apple-intelligence)
- [Computer Use](/computer-use)
- [Apple Apps](/apple-apps)
- [Shortcuts, Spotlight & Siri](/app-intents)

## Not in this release yet

These are being built for Windows and aren't in version 0.1.9:

- [Image & Video](/image-generation) generation
- [Voice](/voice) and [Text-to-Speech](/text-to-speech)
- [Projects](/projects) and [Knowledge](/knowledge)
- [Runtimes](/harness-runtimes) other than Claude Code

Release notes for each Windows version are posted in the [community forum](https://community.osaurus.ai/tag/windows/2).
