---
title: Quick Start
sidebar_label: Quick Start
description: Five minutes from install to your first AI conversation. Here's what you'll do, in order.
---

# Quick Start

Five minutes from a fresh Mac to a working AI you own. Here's the whole flow.

<div style={{textAlign: 'center', margin: '2rem 0'}}>
<a href="https://osaurus.ai/" class="button button--primary button--lg">Download Osaurus</a>
&nbsp;&nbsp;
<a href="/installation" class="button button--secondary button--lg">All install options</a>
</div>

## 1. Install

Grab the DMG from [osaurus.ai](https://osaurus.ai/), drag it into your Applications folder, and launch it from Spotlight (`⌘ Space` → "Osaurus"). That's it.

The app is signed and notarized, so it opens without security warnings. Full guide: [Installation](/installation).

## 2. Walk through onboarding

A short wizard greets you on first launch and walks through six quick steps.

### Welcome

The hero screen. This is also where the (optional, anonymous) usage-analytics opt-in lives. Click **Get Started**.

### Meet your dino

Name your agent — your "dino." An agent is a saved configuration: a system prompt, theme, default model, memory of its own. One tap; you can rename and customize it anytime in Settings, and create more later. [Agents →](/agents)

### Give your dino a brain

Osaurus **recommends the best local model your Mac can run** — the pick is based on your machine's memory, so a mainstream Mac and a maxed-out one get different (equally sensible) defaults. A **Change** control lets you pick another local model if you'd rather.

You don't have to wait for the download: **Osaurus Cloud is included with a free welcome credit**, so you can skip the download and start chatting on hosted models immediately — or use Cloud while the local model downloads in the background.

Prefer your own provider? **Use an API key** drills into OpenAI, Anthropic, and friends, plus a local Ollama server or any custom OpenAI-compatible endpoint. You can always add more later from **Management → Models** or **Management → Providers**.

### Add a few tools

An optional picker for starter plugins — file access, shell, Calendar, Reminders, Messages. All optional, and you can add or remove any of them later from **Management → Plugins**.

### A quick tour

A three-card carousel: agents do real work with tools, each dino remembers your context, and your data stays on your device.

### One last thing

A crash-report sharing toggle (on by default, and anonymized), then **Finish** — the chat overlay opens and you're ready to go.

:::info[Identity and Sandbox are automatic]
There's no identity or sandbox step anymore. Your **identity key** is created silently on completion — it lives in your iCloud Keychain, gated by Face ID / Touch ID. When you have a minute, save your **24-word recovery phrase** from **Management → Identity → View recovery phrase**; it's what restores your identity on a new Mac. The **Sandbox** is configured with defaults and provisions itself lazily the first time an agent actually needs it — no surprise multi-GB download. [Identity →](/identity) · [Sandbox →](/sandbox)
:::

## 3. Pick your Core Model

This is the one knob most people miss on day one. Open **Settings (`⌘ ,`) → General → Core Model** and pick a model.

### Why it matters

The Core Model is a small, lightweight model Osaurus uses for **background work**:

- **Remembering things** — distills your conversations into compact facts the AI can recall later. **Without a Core Model set, this never runs and memory pauses.**
- **Picking the right tools** — surfaces the relevant tools and skills for each message. Falls back to your chat model when Core Model is unset.

### What to pick

If `foundation` is available, that's the right answer 99% of the time — it's free, fast, and never leaves your Mac. Otherwise:

| You have | Pick |
|---|---|
| macOS 26+ | `foundation` (Apple's on-device model) |
| macOS 15.5+ with a local model | The smallest fast model you've downloaded (e.g. `gemma-4-e2b-it-4bit`) |
| Cloud-only setup | Any cheap, fast remote model (e.g. `anthropic/claude-haiku-4-5`) |

:::tip
Choosing **Use chat model (default)** in this picker leaves Core Model unset. That's fine for ad-hoc usage, but **memory won't update**. Pick an explicit model if you want memory and auto-selected tools working in the background.
:::

## 4. Try your first chat

Press **`⌘;`** from anywhere on your Mac. The chat overlay appears.

Type something:

> *Hi! Tell me a fun fact about dinosaurs.*

Press Enter. You'll see the response stream in real-time. Press `⌘;` again to dismiss.

### Have it actually do something

Try giving the agent a real task — it'll write a plan, use tools, and bring back the result:

1. Press `⌘;` to open chat
2. Click the folder icon next to the input bar and pick a folder you don't mind it touching
3. Ask: *"Summarize what's in this folder and add a `README.md` describing it."*

You'll see a live to-do list appear and tick off as the agent reads files, drafts the README, and writes it. The new file shows up as an artifact card right in the chat.

Toggle the **Sandbox** for shell access in an isolated environment (a Linux VM on macOS 26+, a Seatbelt-confined runner on macOS 15) — handy for running scripts, scraping URLs, or trying out a package. [Tasks →](/agent-loop)

### Try voice

Click the microphone in the input bar and speak. Transcription happens entirely on-device via Apple's Neural Engine — your voice never leaves your Mac. Or set up the global Transcription Mode hotkey to dictate into any app on your Mac. [Voice →](/voice)

## What's next

Now that you're set up:

**For everyday use:**

- [Chat](/chat) — overlay, multi-window, sessions, shortcuts
- [Agents](/agents) — create specialized assistants for different tasks
- [Memory](/memory) — what your AI remembers and how
- [Skills](/skills) — reusable expertise, automatically loaded
- [Voice](/voice) — dictate, wake-words, global transcription
- [Themes](/themes) — make the chat overlay yours

**For developers:**

- [HTTP API](/api) — OpenAI / Anthropic / Open Responses / Ollama compatible
- [SDK Examples](/sdk-examples) — Python, JavaScript, and more
- [CLI](/cli) — `osaurus` commands
- [Tools & Plugins](/tools) — extending Osaurus

**Care about privacy?** The whole story is on the [Privacy & Trust](/security) page.

**Need help?** Join the [Discord](https://discord.gg/osaurus) or open a [GitHub issue](https://github.com/osaurus-ai/osaurus/issues).
