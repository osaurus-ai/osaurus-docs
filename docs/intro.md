---
title: Overview
sidebar_label: Overview
description: Osaurus is a free Mac app with a team of AI agents that remember you, do real work, and turn your repeat tasks into workflows you can schedule and share. Your data stays on your Mac. Open source.
slug: /
hide_title: true
---

<div className="docs-hero">
  <img className="docs-hero__mark" width="64" height="64" alt="" src="/img/osaurus-mark.svg" />
  <span className="eyebrow">Osaurus documentation</span>
  <h1 className="docs-hero__title">Own your AI.</h1>
  <p className="docs-hero__lede">A team of AI agents that remember you, do real work, and turn your repeat tasks into workflows — on your Mac, private, and open source.</p>
  <GitHubStats />
  <div className="docs-hero__actions">
    <a href="/installation" className="button button--primary button--lg">Install Osaurus</a>
    <a href="/quickstart" className="button button--secondary button--lg">Quick Start</a>
    <a href="/windows" className="button button--secondary button--lg">Osaurus for Windows</a>
  </div>
</div>

---

## Where do you want to go?

<JourneyCards>
  <JourneyCard to="/quickstart" title="Get started" icon="Rocket">
    Install in about a minute, choose how your AI runs — on your Mac, in the cloud, or with an account you have — and meet your team.
  </JourneyCard>
  <JourneyCard to="/workflows" title="Workflows" icon="Workflow">
    Turn a task you do every day into one click. Run it on a schedule, and share it with anyone using a link.
  </JourneyCard>
  <JourneyCard to="/chat" title="Use Osaurus" icon="MessageSquare">
    Open a chat from anywhere with ⌘;, hand jobs to your agents, and add memory, skills, voice, and image generation.
  </JourneyCard>
  <JourneyCard to="/devices" title="Your devices & team" icon="Users">
    Sync your chats to your iPhone and other Macs, and share agents and workflows with your team.
  </JourneyCard>
  <JourneyCard to="/security" title="Privacy & trust" icon="ShieldCheck">
    Everything stays on your Mac unless you choose otherwise. See exactly what is stored, what leaves, and when.
  </JourneyCard>
  <JourneyCard to="/architecture" title="Build with Osaurus" icon="Terminal">
    For developers: a local server that works with OpenAI, Anthropic, and Ollama apps, MCP in and out, a command-line tool, and plugins.
  </JourneyCard>
</JourneyCards>

---

## What is Osaurus?

Osaurus is a free Mac app for using AI. You chat with Osaurus, and it hands jobs to a small team of AI assistants (called [agents](/glossary#agent)) that look after your calendar, mail, files and research. They remember what matters to you, and they can turn the things you do every day into [workflows](/glossary#workflow) that run with one click. Your chats, memories and settings stay on your Mac.

You choose the AI "brain" (the [model](/glossary#model)) behind it all. It can be a [local model](/glossary#local-model) that runs on your Mac and works offline, Apple's built-in [Apple Intelligence](/glossary#apple-intelligence), or a more powerful [cloud model](/glossary#cloud-model) when you want one. Nothing leaves your Mac unless you pick a cloud model or turn on a feature that needs the internet.

Osaurus is open source, so anyone can check how it works. It's a native Mac app built for Apple's M-series chips.

:::tip[Your data, your Mac]
Your data is stored only on your Mac and is never sent anywhere unless you choose a cloud model or service. We can't read your conversations, and there are no backdoors. See [Security & Privacy](/security).
:::

## Get started

1. **Install Osaurus.** Download it from [osaurus.ai](https://osaurus.ai/) and drag it into your Applications folder. See [Installation](/installation).
2. **Choose how it runs.** The welcome window asks what matters most to you: privacy on your Mac, chatting right away, or an AI account you already have. See [Quick Start](/quickstart).
3. **Meet your team.** Your first chat introduces the team. Pick one and try a task. After that, press `⌘;` from anywhere on your Mac to open a chat. See [Chat](/chat).

---

## Workflows: do it once, run it forever

A [workflow](/workflows) is a task Osaurus remembers how to do. You describe it once, check that it works, and from then on it runs the same way every time, with one click or on a schedule.

Osaurus comes with seven, ready to go. For example:

- **Morning Brief**: today's events, what's due, and the mail that needs a reply, on one page.
- **Mail Triage**: your unread mail sorted into needs a reply, for your information, and can wait.
- **Meeting Prep**: who you're meeting, related notes, and recent mail with them, before your next meeting.

Want your own? Describe it in a chat, like "every Friday, write a short update about this week's meetings", and the [Architect](/glossary#architect) builds it for you. Then **share it with a link**: anyone with Osaurus can install it on their own Mac, with their own accounts. Your keys never leave yours.

[What workflows are →](/workflows) · [Build one →](/workflows-build) · [Share one →](/workflows-share)

---

## What you can do

A short tour of what Osaurus offers once it's installed.

### Everyday AI

- **A friendly first launch.** Choose how your AI runs: **Raptor 0.7**, a private model that runs on your Mac; [Osaurus Cloud](/glossary#osaurus-cloud), with nothing to download and free credit to start; or an AI account you already have, such as ChatGPT or Claude Code. The larger "full" installer comes with Raptor 0.7 already included.
- **A team, ready on day one.** **Planner** looks after your Calendar and Reminders, **Courier** your Mail, **Keeper** your Downloads and Notes, and **Scout** searches the web. On a Mac set up for coding, **Builder** works in one project folder. Each asks before it sends, changes, or deletes anything. See [Agents](/agents).
- **Osaurus, your starting point.** Every new chat starts with the [Orchestrator](/glossary#orchestrator), the assistant built into Osaurus. It answers questions, changes settings for you after you approve, runs your workflows, and hands bigger jobs to your team. Their results come back to the same chat. See [Orchestrator](/orchestrator).
- **A chat window you can open anywhere.** Press `⌘;` to talk to your AI, and press it again to hide it. The window keeps your chats, your agents, your [projects](/glossary#project), your workflows, and Settings in one place. See [Chat](/chat).
- **Assistants for any job.** Make your own agents by describing what they should do. Save one as a template, and share it as a file or a page. See [Agents](/agents) and [Agent Templates](/agent-templates).
- **Bring your own agent program.** Run an assistant on Claude Code or Pi instead of Osaurus's own loop, right from the chat's model picker. See [Runtimes](/harness-runtimes).
- **Voice.** Dictate in chat, start a chat hands-free by saying a [wake word](/glossary#wake-word), or hold a shortcut key to dictate into any app. Your voice is turned into text on your Mac. See [Voice](/voice).
- **Pictures and video.** Install a picture model to create and edit images fully offline, or choose a paid cloud service for images and video. See [Image & Video](/image-generation).
- **Light or dark.** Follow your Mac, or pick Light or Dark, and make the text bigger or smaller. See [Appearance](/appearance).

### Memory and your documents

- **Memory that learns from you.** Osaurus picks out useful facts from past chats and brings them up only when they're relevant. See [Memory](/memory).
- **Skills that load themselves.** Ready-made [skills](/glossary#skill) (playbooks for tasks like research, summarizing, or working with documents) kick in automatically when a task needs them. See [Skills](/skills).
- **Web search with no setup.** Osaurus can search the web right away and cite its sources. Adding a search service account can improve results. See [Web Search](/web-search).
- **Working Folders.** Give a chat one folder on your Mac (a [Working Folder](/glossary#working-folder)) and an agent can read and edit what's inside — including PDF, Word, Excel, and PowerPoint files. You can review and undo every change from the chat. See [Working in Chat](/agent-loop).
- **Apple apps, built in.** Calendar, Reminders, Contacts, Notes, Mail, Messages, Maps, Music, and Shortcuts work with your agents. Your team already uses the ones it needs, and Osaurus asks before anything is sent or deleted. See [Apple Apps](/apple-apps).

### Getting work done on its own

- **Workflows and Automations.** Run a workflow, an agent, or a quick question every morning, whenever a file lands in a folder, or when another app sends something. See [Workflows](/workflows) and [Automations](/automations).
- **A safe place to run code.** Agents and workflows can use the [Sandbox](/glossary#sandbox), a sealed-off area where they can run code and install software without touching the rest of your Mac. See [Sandbox](/sandbox).
- **Computer Use** *(experimental)*. Let an assistant use real Mac apps: fill in forms, change settings, or copy text off the screen. Risky actions need your OK first. See [Computer Use](/computer-use).
- **Browser Use.** Osaurus can browse sites where you're signed in, and your own agents can get their own private browser, with the same safety checks. See [Browser Use](/browser-use).
- **Teamwork between assistants.** An assistant can hand one job, or several at once, to your other assistants or to assistants your teammates share (these helpers are called [subagents](/glossary#subagent)). See [Subagents](/subagents).

### Privacy and staying connected

- **A Privacy Filter for cloud chats** *(experimental)*. Before a message goes to a cloud model, the [Privacy Filter](/glossary#privacy-filter) can find names, emails, and secrets on your Mac and hide them. See [Privacy Filter](/privacy-filter).
- **The Vault for your keys.** Every key, password and sign-in your agents and workflows use lives in one place on your Mac. See [Vault](/vault).
- **An Osaurus ID that's yours.** Osaurus gives you and each assistant a private identity, with no account or password. Your [Osaurus ID](/glossary#osaurus-id) signs the workflows you share and lets you log in to websites. See [Osaurus ID](/identity).
- **Your chats on all your devices.** Sync your chats between your Macs and the Osaurus iPhone app, end-to-end encrypted, and use your Mac's agents from your phone. See [Devices & Sync](/devices).
- **Remote Access.** Give one assistant a web address that outside apps can reach, without changing your router settings. See [Remote Access](/remote-access).
- **Workspaces for teams.** Share assistants and workflows with teammates, use theirs, and pay for cloud use from one shared pool of [credits](/glossary#credits). See [Workspaces](/workspaces).

[Get started in 5 minutes →](/quickstart)

---

## System requirements

- **macOS 15.5** or later
- A Mac with **[Apple Silicon](/glossary#apple-silicon)** (M1, M2, M3, or newer)

:::info[macOS 26 features]
**Apple Intelligence** models need macOS 26 (Tahoe) or later. The **Sandbox** works on both versions, but on macOS 26 it gets a fuller, more isolated setup, which a few workflows need.
:::

Coming from an earlier version? See [Upgrading from Osaurus Classic](/upgrading).

## Community

Osaurus is an independent project, built in public. Join us:

- [Discord](https://discord.gg/osaurus) — chat, feedback, show-and-tell
- [GitHub](https://github.com/osaurus-ai/osaurus) — issues, contributions, roadmap
- [Hugging Face](https://huggingface.co/OsaurusAI) — ready-to-use models tuned for Apple Silicon
- [store.osaurus.ai](https://store.osaurus.ai) — workflows and agents people have shared
- [Plugin Registry](https://github.com/osaurus-ai/osaurus-tools) — browse and submit tools
- [Blog](https://osaurus.ai/blog) — long-form thinking on personal AI

---

## Under the hood

### Why Osaurus exists

Inference is all you need. Everything else can be owned by you.

Models are getting cheaper and more interchangeable by the day. What's irreplaceable is the layer around them — your context, your memory, your tools, your identity. Other apps keep that layer on their servers. Osaurus keeps it on your Mac.

Osaurus is the AI harness for macOS. It sits between you and any model — local or cloud — and provides the continuity that makes AI personal: agents that remember, workflows that run the same way every time, real code in a sandbox, and reach from anywhere. It's native Swift on Apple Silicon (no Electron), MIT licensed, and signed at every boundary.

### Technical notes on the features above

- **Onboarding:** the "AI account you already have" path signs in to ChatGPT, Grok or OpenRouter, uses Claude Code, or takes an API key or any OpenAI-compatible endpoint. The starter team and the seven default workflows are created on fresh installs only.
- **The Orchestrator** routes work: it has no file tools, hands settings to the Configurator and workflow building to the Architect, runs workflows marked **Osaurus can run this for you** with `run_workflow`, and uses four built-in helpers (Research, Files, Browser, Code).
- **Workflows:** a fixed graph of steps with a typed input and output, built and tested with the Architect, stored as versioned templates, and published to store.osaurus.ai signed with your Osaurus ID.
- **Sandbox:** one Linux container per agent on macOS 26+ (a Seatbelt-confined runner on macOS 15). Workflows that run shell or Python get their own sandbox environment.
- **Subagents:** same-model local work runs side by side; different local models take turns, so two large models never fight for memory.
- **Privacy Filter:** an on-device classifier does the detection.
- **Osaurus ID:** a cryptographic address for you and each agent. Access keys (`osk-v1`) can be scoped per agent.
- **Remote Access:** a stable public URL via a secure tunnel through `agent.osaurus.ai` — no port forwarding, no ngrok.

### Build with Osaurus

Osaurus is also a local server. It speaks **OpenAI**, **Anthropic**, **Open Responses**, and **Ollama** APIs at the same port — so any SDK you already use just works. And it's a full **MCP server and client**, so Cursor, Claude Desktop, and other MCP harnesses get instant access to your installed tools.

- [HTTP API](/api) — endpoint reference, streaming, function calling, and workflow runs
- [SDK Examples](/sdk-examples) — Python, JavaScript, Anthropic SDK, Open Responses
- [CLI](/cli) — `osaurus serve`, `osaurus tools install/dev/create`, `osaurus mcp`
- [Tools & Plugins](/tools) — built-in tools, the live native-plugin registry, remote MCP providers, and a stable plugin ABI
- [Log in with Osaurus](/login-with-osaurus) — let people sign in to your site with their Osaurus ID
- [Apple Intelligence](/models/apple-intelligence) — using `foundation` with zero setup on macOS 26+

For the system view of how everything fits together, see [Architecture](/architecture).

### Platform details

Apple Foundation Models require macOS 26 (Tahoe) or later. The Sandbox uses a full Linux VM on macOS 26; on macOS 15 it falls back to a Seatbelt-confined backend. Workflow packages installed with `apk` need the Linux sandbox.
