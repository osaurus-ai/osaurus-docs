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

A short wizard greets you on first launch and walks through five quick steps.

### Welcome

The hero screen. Click **Get Started**.

### Create your agent

Pick a name and a starter template (you can change everything later). An agent is a saved configuration — a system prompt, theme, default model, memory of its own. You can always come back and create more. [Agents →](/agents)

If you want to skip and use the default Osaurus agent, click **Skip for now**.

### Configure your AI

Pick how you want to run models:

| Option | Best for | Setup |
|---|---|---|
| **Apple Foundation** *(macOS 26+)* | Zero setup, fast on Apple Neural Engine | Built in |
| **Local model (MLX)** | Privacy-first, runs offline | Download a model from the picker — `Gemma 4 E2B it 4bit` is the recommended starter (~1.5 GB) |
| **Cloud provider** | Frontier-class models | Paste an API key for OpenAI, Anthropic, xAI, or OpenRouter |

You can always add more later from **Management → Models** or **Management → Providers**.

### Set up identity

Osaurus creates a key for you (and your future agents) the first time it runs — silently, nothing to write down. It lives in your iCloud Keychain, gated by Face ID / Touch ID. When you have a minute, save your **24-word recovery phrase** from **Management → Identity → View recovery phrase** — it's what restores your identity on a new Mac.

This step is skippable but recommended — it unlocks access keys and Public Links later. [Identity →](/identity)

### How it works

A short carousel covers what you can do once you're in: tasks, the Sandbox, personalization, and privacy. After you finish, the chat overlay opens and you're ready to go.

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

On macOS 26+, toggle the **Sandbox** for shell access in an isolated Linux VM — handy for running scripts, scraping URLs, or trying out a package. [Tasks →](/agent-loop)

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
