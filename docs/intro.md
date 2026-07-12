---
title: Overview
sidebar_label: Overview
description: The native Mac harness for AI — agents that remember, run real code, and stay reachable. Built in Swift. Works offline. Open source.
slug: /
hide_title: true
---

# Osaurus

<p style={{textAlign: "center"}}>
  <img width="96" height="96" alt="Osaurus" src="/img/osaurus-logo-blue.svg" />
</p>

<p style={{textAlign: "center"}}>
  <strong>Own your AI.</strong>
</p>

<GitHubStats />

<p style={{textAlign: "center", marginTop: "16px"}}>
  <a href="/installation" className="button button--primary button--lg" style={{marginRight: "12px"}}>Install Osaurus</a>
  <a href="/quickstart" className="button button--secondary button--lg">Quick Start</a>
</p>

---

## Where do you want to go?

<JourneyCards>
  <JourneyCard to="/quickstart" title="Get started" icon="Rocket">
    Install in under a minute, create your first agent, and pick a model — local, Apple Foundation, or cloud.
  </JourneyCard>
  <JourneyCard to="/chat" title="Use Osaurus" icon="MessageSquare">
    Chat from anywhere with ⌘;, build agents for different jobs, add memory, skills, voice, and image generation.
  </JourneyCard>
  <JourneyCard to="/architecture" title="Build with Osaurus" icon="Terminal">
    OpenAI-, Anthropic-, and Ollama-compatible local server, MCP in and out, a CLI, and a stable plugin ABI.
  </JourneyCard>
  <JourneyCard to="/security" title="Privacy & trust" icon="ShieldCheck">
    Everything stays on your Mac, signed at every boundary. See exactly what is stored and what leaves — and when.
  </JourneyCard>
</JourneyCards>

---

## Inference is all you need. Everything else can be owned by you.

Models are getting cheaper and more interchangeable by the day. What's irreplaceable is the layer around them — your context, your memory, your tools, your identity. Other apps keep that layer on their servers. Osaurus keeps it on your Mac.

Osaurus is the AI harness for macOS. It sits between you and any model — local or cloud — and provides the continuity that makes AI personal: agents that remember, execute autonomously, run real code, and stay reachable from anywhere.

Works fully offline with local models. Connect to any cloud provider when you want more power. Nothing leaves your Mac unless you choose. Native Swift on Apple Silicon. No Electron. MIT licensed.

:::tip[Your data, your Mac]
Stored only on your Mac, signed at every boundary, never sent anywhere unless you explicitly choose a cloud provider. We can't read your conversations and there are no backdoors — see [Security & Privacy](/security).
:::

---

## What you get

A short tour of the things you can do once Osaurus is installed.

### Everyday AI

- **A guided first launch.** A five-step onboarding walks you through creating your first agent, picking a model (local, Apple Foundation, or cloud), and setting up identity. No config files.
- **A chat overlay you can open anywhere.** Press `⌘;` to talk to your AI; press it again to dismiss. No browser tab, no context switch.
- **Agents that fit different jobs.** A coding partner, a research assistant, a file organizer — each with its own prompt, theme, and history.
- **Voice input.** Dictate in chat, talk to an agent hands-free with a wake word, or hold a hotkey to dictate into any app — all on-device.
- **Image generation, fully offline.** Install a local image model and create or edit pictures right in the chat — nothing is sent to a server.
- **Themes.** Built-in light/dark, fully editable, importable as JSON.

### Memory & knowledge

- **Memory that learns from you.** Past conversations are distilled into compact facts and surfaced only when relevant — no firehose of irrelevant context.
- **Skills that load themselves.** Packaged expertise — research, debugging, writing styles — that surface automatically when the task calls for them.
- **Working folders.** Point a chat at a folder and the agent gets safe file, search, and git tools — scoped to just that directory.

### Autonomy & automation

- **A Linux Sandbox** *(macOS 26+)*. Toggle it on and the agent can run real code — shell, Python, Node — in an isolated VM with zero risk to your Mac.
- **Computer Use** *(experimental)*. Let an agent drive real macOS apps — fill forms, flip settings, extract on-screen text — with every action gated by a safe-by-default confirmation policy.
- **Subagents.** Delegate a bounded task to another model or a saved agent mid-conversation and get a compact result back — local models hand off memory automatically.
- **Schedules and Watchers.** Run an agent on a timer, or whenever a folder changes. Useful for daily journals, screenshot organizers, end-of-day commits.

### Privacy & reach

- **A Privacy Filter for cloud prompts** *(experimental)*. An on-device classifier scrubs names, emails, and secrets out of anything you send to a cloud provider — you review what's redacted, and it blocks the send rather than leak.
- **Identity that's yours.** A cryptographic address for you and each of your agents. Issue access keys for outside tools, scope them per-agent, revoke them whenever.
- **Public links without ports.** Give one agent a stable public URL via a secure tunnel through `agent.osaurus.ai` — no port forwarding, no ngrok.

[Get started in 5 minutes →](/quickstart)

---

## Build with Osaurus

Osaurus is also a local server. It speaks **OpenAI**, **Anthropic**, **Open Responses**, and **Ollama** APIs at the same port — so any SDK you already use just works. And it's a full **MCP server and client**, so Cursor, Claude Desktop, and other MCP harnesses get instant access to your installed tools.

- [HTTP API](/api) — endpoint reference, streaming, function calling
- [SDK Examples](/sdk-examples) — Python, JavaScript, Anthropic SDK, Open Responses
- [CLI](/cli) — `osaurus serve`, `osaurus tools install/dev/create`, `osaurus mcp`
- [Tools & Plugins](/tools) — 20+ native plugins (Mail, Calendar, Vision, Browser, Git, …) and a stable v1–v6 ABI for building your own
- [Apple Intelligence](/models/apple-intelligence) — using `foundation` with zero setup on macOS 26+

For the system view of how everything fits together, see [Architecture](/architecture).

---

## System requirements

- **macOS 15.5** or later
- **Apple Silicon** (M1, M2, M3, or newer)

:::info[macOS 26 features]
The **Sandbox** (running agent code in an isolated Linux VM) and **Apple Foundation Models** require macOS 26 (Tahoe) or later.
:::

---

## Community

Osaurus is an indie project, built in public. Join us:

- [Discord](https://discord.gg/osaurus) — chat, feedback, show-and-tell
- [GitHub](https://github.com/osaurus-ai/osaurus) — issues, contributions, roadmap
- [Hugging Face](https://huggingface.co/OsaurusAI) — curated quantizations for Apple Silicon
- [Plugin Registry](https://github.com/osaurus-ai/osaurus-tools) — browse and submit tools
- [Blog](https://osaurus.ai/blog) — long-form thinking on personal AI
