---
title: Overview
sidebar_label: Overview
description: Osaurus is a free Mac app for AI assistants that remember you, do real work on your files, and keep your data on your Mac. Works offline. Open source.
slug: /
hide_title: true
---

<div className="docs-hero">
  <img className="docs-hero__mark" width="64" height="64" alt="" src="/img/osaurus-logo.svg" />
  <span className="eyebrow">Osaurus documentation</span>
  <h1 className="docs-hero__title">Own your AI.</h1>
  <p className="docs-hero__lede">Agents that remember, run real code, and stay reachable — on your Mac, offline, and open source.</p>
  <GitHubStats />
  <div className="docs-hero__actions">
    <a href="/installation" className="button button--primary button--lg">Install Osaurus</a>
    <a href="/quickstart" className="button button--secondary button--lg">Quick Start</a>
  </div>
</div>

---

## Where do you want to go?

<JourneyCards>
  <JourneyCard to="/quickstart" title="Get started" icon="Rocket">
    Install in about a minute, create your first assistant, and pick the AI it runs on — on your Mac, Apple Intelligence, or the cloud.
  </JourneyCard>
  <JourneyCard to="/chat" title="Use Osaurus" icon="MessageSquare">
    Open a chat from anywhere with ⌘;, make assistants for different jobs, and add memory, skills, voice, and image generation.
  </JourneyCard>
  <JourneyCard to="/architecture" title="Build with Osaurus" icon="Terminal">
    For developers: a local server that works with OpenAI, Anthropic, and Ollama apps, MCP in and out, a command-line tool, and plugins.
  </JourneyCard>
  <JourneyCard to="/security" title="Privacy & trust" icon="ShieldCheck">
    Everything stays on your Mac unless you choose otherwise. See exactly what is stored, what leaves, and when.
  </JourneyCard>
</JourneyCards>

---

## What is Osaurus?

Osaurus is a free Mac app for using AI. You chat with AI assistants (called [agents](/glossary#agent)) that remember what matters to you, work on your files, and can be reached from your phone. Your chats, memories, and settings stay on your Mac.

You choose the AI "brain" (the [model](/glossary#model)) behind each assistant. It can be a [local model](/glossary#local-model) that runs on your Mac and works offline, Apple's built-in [Apple Intelligence](/glossary#apple-intelligence), or a more powerful [cloud model](/glossary#cloud-model) when you want one. Nothing leaves your Mac unless you pick a cloud model or turn on a feature that needs the internet.

Osaurus is open source, so anyone can check how it works. It's a native Mac app built for Apple's M-series chips.

:::tip[Your data, your Mac]
Your data is stored only on your Mac and is never sent anywhere unless you choose a cloud model or service. We can't read your conversations, and there are no backdoors. See [Security & Privacy](/security).
:::

## Get started

1. **Install Osaurus.** Download it from [osaurus.ai](https://osaurus.ai/) and drag it into your Applications folder. See [Installation](/installation).
2. **Create your first assistant.** A short setup screen asks what your first assistant should be good at, then which AI it should use. See [Quick Start](/quickstart).
3. **Start chatting.** Press `⌘;` from anywhere on your Mac to open a chat. See [Chat](/chat).

---

## What you can do

A short tour of what Osaurus offers once it's installed.

### Everyday AI

- **A guided first launch.** Three quick screens help you name your first assistant and choose its AI. Osaurus suggests a local model that suits your Mac (Raptor 0.6 on most Macs). You can also start on [Osaurus Cloud](/glossary#osaurus-cloud) with a free welcome credit, use your own account with an AI company, or use your Claude Code sign-in. Want to skip the model download? The larger "full" installer comes with Raptor 0.6 already included.
- **A chat window you can open anywhere.** Press `⌘;` to talk to your AI, and press it again to hide it. Tabs, a sidebar of your assistants and [projects](/glossary#project), and saved history keep longer work organized.
- **The Orchestrator, your starting point.** Every new chat starts with the [Orchestrator](/glossary#orchestrator), the assistant built into Osaurus. It answers questions about the app, changes settings for you after you approve, creates specialist assistants, and hands them work. Their results come back to the same chat. Its answers about Osaurus come from the guide that ships with your version of the app.
- **Assistants for different jobs.** Make a coding partner, a research helper, or a file organizer. Each has its own instructions, look, and history. See [Agents](/agents).
- **Voice.** Dictate in chat, start a chat hands-free by saying a [wake word](/glossary#wake-word), or hold a shortcut key to dictate into any app. Your voice is turned into text on your Mac. See [Voice](/voice).
- **Pictures and video.** Install a picture model to create and edit images fully offline, or choose a paid cloud service for images and video. See [Image Generation](/image-generation).
- **Themes.** Light and dark looks that you can fully customize. See [Themes](/themes).

### Memory and your documents

- **Memory that learns from you.** Osaurus picks out useful facts from past chats and brings them up only when they're relevant. See [Memory](/memory).
- **Skills that load themselves.** Ready-made [skills](/glossary#skill) (playbooks for tasks like research, summarizing, or working with documents) kick in automatically when a task needs them. See [Skills](/skills).
- **Web search with no setup.** Every assistant can search the web right away. Adding a search service account can improve results. See [Web Search](/web-search).
- **Working Folders.** Give a chat one folder on your Mac (a [Working Folder](/glossary#working-folder)) and the assistant can read and edit what's inside — including PDF, Word, Excel, and PowerPoint files. You can review and undo every change from the chat. The assistant remembers the folder for your next chat. See [Tasks](/agent-loop).
- **Apple apps, built in.** Calendar, Reminders, Contacts, Notes, Mail, Messages, Maps, Music, and Shortcuts can be turned on for each assistant. They're off until you turn them on, and Osaurus asks before anything is sent or deleted. See [Apple Apps](/apple-apps).

### Getting work done on its own

- **A safe place to run code.** New assistants you create can use the [Sandbox](/glossary#sandbox), a sealed-off area where they can run code and install software without touching the rest of your Mac. Giving an assistant a Working Folder turns its Sandbox off, so it works in one place or the other. See [Sandbox](/sandbox).
- **Computer Use** *(experimental)*. Let an assistant use real Mac apps: fill in forms, change settings, or copy text off the screen. Risky actions need your OK first. See [Computer Use](/computer-use).
- **Browser Use.** Give an assistant its own private web browser so it can visit sites, read pages, and fill in forms, with the same safety checks. See [Browser Use](/browser-use).
- **Teamwork between assistants.** An assistant can hand one job, or several at once, to your other assistants or to assistants your teammates share (these helpers are called [subagents](/glossary#subagent)). Osaurus keeps them from running out of memory. See [Subagents](/subagents).
- **Schedules and Watchers.** Run an assistant at set times, or whenever files in a folder change. Handy for a daily journal, tidying screenshots, or an end-of-day summary. See [Schedules](/schedules) and [Watchers](/watchers).

### Privacy and staying connected

- **A Privacy Filter for cloud chats** *(experimental)*. Before a message goes to a cloud model, the [Privacy Filter](/glossary#privacy-filter) can find names, emails, and secrets on your Mac and hide them. You review what was hidden, and if something goes wrong it stops the send rather than leak. See [Privacy Filter](/privacy-filter).
- **An identity that's yours.** Osaurus gives you and each assistant a private [identity](/glossary#identity), with no account or password. You can create [access keys](/glossary#access-key) that let other apps use one assistant, and cancel them anytime. See [Identity](/identity).
- **Public Links.** Give one assistant a web address that outside apps can reach, without changing your router settings. See [Public Links](/relay).
- **Your assistants on your iPhone.** Pair the Osaurus iPhone app with a 6-digit code and chat with your assistants from anywhere. The connection is encrypted, and the work still happens on your Mac. See [Mobile](/mobile).
- **Workspaces for teams.** Share an assistant with teammates, use theirs, and pay for cloud use from one shared pool of [credits](/glossary#credits). Shared assistants keep running on their owner's Mac. See [Workspaces](/workspaces).

[Get started in 5 minutes →](/quickstart)

---

## System requirements

- **macOS 15.5** or later
- A Mac with **[Apple Silicon](/glossary#apple-silicon)** (M1, M2, M3, or newer)

:::info[macOS 26 features]
**Apple Intelligence** models need macOS 26 (Tahoe) or later. The **Sandbox** works on both versions, but on macOS 26 it gets a fuller, more isolated setup.
:::

## Community

Osaurus is an independent project, built in public. Join us:

- [Discord](https://discord.gg/osaurus) — chat, feedback, show-and-tell
- [GitHub](https://github.com/osaurus-ai/osaurus) — issues, contributions, roadmap
- [Hugging Face](https://huggingface.co/OsaurusAI) — ready-to-use models tuned for Apple Silicon
- [Plugin Registry](https://github.com/osaurus-ai/osaurus-tools) — browse and submit tools
- [Blog](https://osaurus.ai/blog) — long-form thinking on personal AI

---

## Under the hood

### Why Osaurus exists

Inference is all you need. Everything else can be owned by you.

Models are getting cheaper and more interchangeable by the day. What's irreplaceable is the layer around them — your context, your memory, your tools, your identity. Other apps keep that layer on their servers. Osaurus keeps it on your Mac.

Osaurus is the AI harness for macOS. It sits between you and any model — local or cloud — and provides the continuity that makes AI personal: agents that remember, execute autonomously, run real code, and stay reachable from anywhere. It's native Swift on Apple Silicon (no Electron), MIT licensed, and signed at every boundary.

### Technical notes on the features above

- **Onboarding:** the "your own provider" path accepts an API key or any OpenAI-compatible endpoint. Identity is set up silently on completion.
- **Working Folders:** the agent gets file, search, shell, and git tools scoped to that one directory.
- **Sandbox:** new custom agents start with sandboxed execution enabled where supported, and can run shell, Python, and Node in isolation — a Linux VM on macOS 26+, a Seatbelt-confined runner on macOS 15. Picking a Working Folder turns Sandbox off for that agent before granting host access.
- **Subagents:** same-model local work runs side by side; different local models take turns, so two large models never fight for memory.
- **Privacy Filter:** an on-device classifier does the detection.
- **Identity:** a cryptographic address for you and each agent. Access keys (`osk-v1`) can be scoped per agent.
- **Public Links:** a stable public URL via a secure tunnel through `agent.osaurus.ai` — no port forwarding, no ngrok.

### Build with Osaurus

Osaurus is also a local server. It speaks **OpenAI**, **Anthropic**, **Open Responses**, and **Ollama** APIs at the same port — so any SDK you already use just works. And it's a full **MCP server and client**, so Cursor, Claude Desktop, and other MCP harnesses get instant access to your installed tools.

- [HTTP API](/api) — endpoint reference, streaming, function calling
- [SDK Examples](/sdk-examples) — Python, JavaScript, Anthropic SDK, Open Responses
- [CLI](/cli) — `osaurus serve`, `osaurus tools install/dev/create`, `osaurus mcp`
- [Tools & Plugins](/tools) — built-in tools, the live native-plugin registry, remote MCP providers, and a stable v1–v6 ABI
- [Apple Intelligence](/models/apple-intelligence) — using `foundation` with zero setup on macOS 26+

For the system view of how everything fits together, see [Architecture](/architecture).

### Platform details

Apple Foundation Models require macOS 26 (Tahoe) or later. The Sandbox uses a full Linux VM on macOS 26; on macOS 15 it falls back to a Seatbelt-confined backend.
