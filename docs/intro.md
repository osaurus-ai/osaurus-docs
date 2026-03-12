---
title: Overview
sidebar_label: Overview
description: The native macOS harness for AI agents — any model, persistent memory, autonomous execution, cryptographic identity. Built in Swift. Fully offline. Open source.
sidebar_position: 1
slug: /
hide_title: true
---

# Osaurus

<p align="center">
  <img width="120" height="120" alt="Osaurus" src="/img/osaurus.svg" />
</p>

<p align="center">
  <strong>Own your AI.</strong>
</p>

<p align="center" class="badges">
  <a href="https://github.com/osaurus-ai/osaurus"><img src="https://img.shields.io/github/stars/osaurus-ai/osaurus?style=flat-square&color=000000" alt="Stars" /></a>
  <a href="https://github.com/osaurus-ai/osaurus/releases"><img src="https://img.shields.io/github/v/release/osaurus-ai/osaurus?sort=semver&style=flat-square&color=000000" alt="Release" /></a>
  <a href="https://github.com/osaurus-ai/osaurus/releases"><img src="https://img.shields.io/github/downloads/osaurus-ai/osaurus/total?style=flat-square&color=000000" alt="Downloads" /></a>
  <a href="https://github.com/osaurus-ai/osaurus/blob/main/LICENSE"><img src="https://img.shields.io/github/license/osaurus-ai/osaurus?style=flat-square&color=000000" alt="License" /></a>
</p>

---

## Why Osaurus?

**Inference is all you need. Everything else can be owned by you.**

Models are getting cheaper and more interchangeable by the day. What's irreplaceable is the layer around them — your context, your memory, your tools, your identity. Others keep that layer on their servers. Osaurus keeps it on your machine.

Osaurus is the AI harness for macOS. It sits between you and any model — local or cloud — and provides the continuity that makes AI personal: agents that remember, execute autonomously, run real code, and stay reachable from anywhere. The models are interchangeable. The harness is what compounds.

Works fully offline with local models. Connect to any cloud provider when you want more power. Nothing leaves your Mac unless you choose.

### Our Beliefs

- **Local-first, not local-only** — Your machine is the source of truth. Run models locally for privacy and speed. Reach out to cloud providers when you need more power. The choice is always yours.

- **Context is yours** — The layer that makes AI personal — your preferences, patterns, history — should be portable and private. Switch providers without losing what the AI has learned about you.

- **AI as amplification** — The goal is not to replace human agency, but to amplify it. AI absorbs cognitive overhead — tedium, complexity, context-switching — so your attention goes where it matters.

- **The network is optional** — Your AI tools should work on an airplane, in a coffee shop with unreliable WiFi, or simply when you don't want to depend on someone else's infrastructure.

- **Free as in freedom** — Osaurus is open source, MIT licensed. Some things should exist as public goods. This is one of them.

---

## What Osaurus Does

Osaurus is the native AI harness for macOS — **local-first, privacy-respecting, provider-agnostic**. Not a single app that tries to do everything, but a foundation where focused capabilities compound when composed.

- **Run AI locally** — Download models and run them entirely on your Mac. No internet required, no data leaves your device.
- **Connect to any provider** — Use OpenAI, Anthropic, Gemini, xAI/Grok, Venice AI, OpenRouter, Ollama, or LM Studio when you need cloud capabilities. Switch freely.
- **Chat from anywhere** — Press ⌘; to open a beautiful chat overlay. No browser needed.
- **Extend with tools** — 20+ native plugins give AI access to your filesystem, browser, mail, calendar, git repos, and more.
- **Run code safely** — Agents execute in an isolated Linux VM with shell, Python, Node.js, and compilers — zero risk to your Mac.
- **Own your identity** — Every participant gets a cryptographic address. Actions are signed and verifiable without a central authority.
- **Access from anywhere** — Expose agents to the public internet via secure tunnels. No port forwarding needed.
- **Build an ecosystem** — Skills, agents, schedules, watchers, and tools that work together — discovered, installed, and composed based on what you need.

Native Swift on Apple Silicon. No Electron. No compromises.

---

## For Everyone

Whether you're a writer, researcher, student, or just curious about AI—Osaurus makes it easy to get started without any technical setup.

### Chat Interface

Press **⌘;** anywhere on your Mac to open a glass-styled chat overlay. Ask questions, get help with writing, brainstorm ideas. Press the hotkey again to dismiss. No browser tabs, no context switching—just you and your AI assistant.

[Learn more about the chat interface →](/chat-interface)

### Agents

Create custom AI assistants tailored to different tasks. A Code Assistant with access to your files. A Research Helper that can search the web. A Creative Writer with higher creativity settings. Each agent remembers its own personality, tools, and visual theme.

[Learn more about agents →](/agents)

### Memory

Your AI remembers what matters. Osaurus automatically extracts knowledge from conversations — preferences, decisions, facts, relationships — and brings relevant context into every new interaction. Everything stays local in a SQLite database on your Mac.

[Learn more about memory →](/memory)

### Skills

Extend your AI with reusable capabilities. Import skills from GitHub repositories or local files—research methodologies, debugging frameworks, creative techniques. Skills add domain expertise that works with any agent, and only load when you need them.

[Learn more about skills →](/skills)

### Schedules

Automate recurring AI tasks. Set up daily journal prompts, weekly report generation, or monthly goal reviews. Schedules run on a timer with your chosen agent, so helpful routines happen without you remembering to trigger them.

[Learn more about schedules →](/schedules)

### Watchers

Monitor folders for file system changes and automatically trigger AI tasks when files are added, modified, or removed. Set up a Downloads organizer, a screenshot manager, or automated processing for any folder—Watchers keep working in the background so you don't have to.

[Learn more about watchers →](/watchers)

### Work Mode

Execute complex, multi-step tasks autonomously. Organize files, conduct deep research across the web, automate repetitive workflows, or build features across a codebase. Work Mode uses your installed tools and skills, breaking down requests into trackable issues and working through them step by step — even in the background.

[Learn more about Work Mode →](/work-mode)

### Sandbox

Agents execute code in an isolated Linux VM powered by Apple's Containerization framework. Full dev environment — shell, Python, Node.js, compilers, package managers — with zero risk to your Mac. Each agent gets its own Linux user and home directory. Extend with simple JSON plugin recipes, no Xcode or code signing required.

[Learn more about Sandbox →](/sandbox)

### Identity

Every participant in Osaurus — you, your agents, and your devices — gets a cryptographic address. Authority flows from your master key down to each agent, forming a verifiable chain of trust. Create portable access keys for external tools and MCP clients, scope them per-agent, and revoke them at any time. No central authority needed.

[Learn more about Identity →](/identity)

### Voice Input

Speak naturally and watch your words appear in real-time. On-device transcription via FluidAudio on Apple's Neural Engine — completely private, works offline. Enable VAD Mode to activate your assistant hands-free with a wake phrase.

[Learn more about voice input →](/voice)

### Multi-Window

Work with multiple independent chat windows, each with its own agent and conversation. Run a Code Assistant in one window while researching in another. Pin important conversations to stay on top.

[Learn more about multi-window →](/multi-window)

---

## For Developers

Osaurus provides the infrastructure for building AI-powered applications on macOS.

### OpenAI-Compatible API

Drop-in replacement for OpenAI's API. Use existing SDKs and tools—Python, JavaScript, LangChain, or any OpenAI-compatible client—without changing your code.

```bash
curl http://127.0.0.1:1337/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "llama-3.2-3b-instruct-4bit", "messages": [{"role":"user","content":"Hello!"}]}'
```

[View API reference →](/api)

### MCP Server

Osaurus is a full [Model Context Protocol](https://modelcontextprotocol.io/) server. Connect it to Cursor, Claude Desktop, or any MCP client to give AI access to your installed tools.

```json
{
  "mcpServers": {
    "osaurus": {
      "command": "osaurus",
      "args": ["mcp"]
    }
  }
}
```

[Learn more about MCP & tools →](/tools)

### Relay

Expose your local agents to the public internet via secure WebSocket tunnels through `agent.osaurus.ai`. Each agent gets a unique public URL based on its cryptographic address — no port forwarding, no ngrok, no configuration needed. Share agents with teammates, connect remote MCP clients, or receive webhooks to a locally running agent.

[Learn more about Relay →](/relay)

### Native Tools

20+ native plugins built in Swift and Rust — not Python scripts. Mail, Calendar, Vision, macOS Use, XLSX, PPTX, Browser, Music, Git, Filesystem, Search, Fetch, and more. Instant startup (under 10ms vs 200ms+), lower memory usage, and true multi-threaded performance.

| Aspect       | Python MCPs                 | Native Swift Tools    |
| ------------ | --------------------------- | --------------------- |
| Startup      | ~200ms (venv + interpreter) | Under 10ms            |
| Memory       | Higher baseline + GC pauses | Precise ARC control   |
| Dependencies | Requires Python runtime     | Self-contained binary |

Plugins support v1 (tools only) and v2 (full host API) ABIs — register HTTP routes, serve web apps, persist data in SQLite, dispatch agent tasks, and call inference through any model.

[Browse the tool registry →](/tools)

### Compatible APIs

Drop-in endpoints for existing tools and SDKs:

| API       | Endpoint                                    |
| --------- | ------------------------------------------- |
| OpenAI    | http://127.0.0.1:1337/v1/chat/completions   |
| Anthropic | http://127.0.0.1:1337/anthropic/v1/messages |
| Ollama    | http://127.0.0.1:1337/api/chat              |

All prefixes supported (`/v1`, `/api`, `/v1/api`). Full function calling with streaming tool call deltas.

[View API reference →](/api)

### Smart Context Management

Most AI tools load everything upfront—all skills, all tool definitions—burning thousands of tokens before you even ask a question. Osaurus uses **two-phase capability selection** instead.

The AI sees a lightweight catalog first (names and descriptions), then loads full definitions only for what it actually needs. This saves **~80% of context space**, leaving more room for your conversation and better reasoning.

| Approach    | Context Cost  | What Happens                    |
| ----------- | ------------- | ------------------------------- |
| Traditional | ~5,000 tokens | All capabilities loaded upfront |
| **Osaurus** | ~1,000 tokens | Catalog first, load on demand   |

This means you can have dozens of skills and tools available without paying the cost until they're used.

[Learn more about skills →](/skills) · [Learn more about tools →](/tools)

### Apple Foundation Models

On macOS 26 (Tahoe), access Apple's system models with zero configuration:

```bash
curl http://127.0.0.1:1337/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "foundation", "messages": [{"role":"user","content":"Hello!"}]}'
```

[Learn more about Apple Intelligence →](/models/apple-intelligence)

### Performance

Osaurus delivers fast inference on Apple Silicon.

| Metric              | Osaurus     | Ollama      | LM Studio   |
| ------------------- | ----------- | ----------- | ----------- |
| Time to First Token | 87ms        | 33ms        | 113ms       |
| Throughput          | 554 chars/s | 430 chars/s | 588 chars/s |
| Total Time          | 1.24s       | 1.62s       | 1.22s       |

_Benchmarked with Llama 3.2 3B Instruct 4bit, averaged over 20 runs on M2 Pro._

[View detailed benchmarks →](/benchmarks)

---

## System Requirements

- **macOS 15.5** or later
- **Apple Silicon** (M1, M2, M3, or newer)

:::info macOS 26 Features
Apple Foundation Models and the Sandbox (agent code execution in an isolated Linux VM) require macOS 26 (Tahoe) or later.
:::

---

## Get Started

Ready to try Osaurus? Installation takes less than a minute.

<p align="center">
  <a href="/installation" class="button button--primary button--lg">Install Osaurus</a>
</p>

Or jump straight to the [Quick Start guide →](/quickstart)

---

## Community

Osaurus is an indie project, built in public. Join us:

- [Discord](https://discord.gg/dinoki) — Get help and share projects
- [GitHub](https://github.com/osaurus-ai/osaurus) — Report issues and contribute
- [Plugin Registry](https://github.com/osaurus-ai/osaurus-tools) — Browse and submit tools
- [Blog](https://osaurus.ai/blog) — Read about our vision and roadmap
