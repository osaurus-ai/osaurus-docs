---
title: Quick Start
sidebar_label: Quick Start
description: What happens the first time you open Osaurus, the one setting that activates memory and auto-tools, and your first conversation.
sidebar_position: 3
---

# Quick Start

This page walks you through what actually happens the first time you open Osaurus, then the one setting you'll want to flip after onboarding, then your first conversation.

## 1. Install

```bash
brew install --cask osaurus
```

Or grab the [latest DMG](https://github.com/osaurus-ai/osaurus/releases/latest). Full notes: [Installation](/installation).

## 2. First launch

Open Osaurus from Spotlight (`⌘ Space` → "Osaurus"). On 0.17.7+ you'll see a brief **"Securing your data"** overlay — that's the [storage encryption migration](/storage), it usually finishes in under a second.

Then a wizard opens. There are five steps:

### Welcome

The hero screen. Click **Get Started**.

### Create your agent

Pick a name and a starter template (you can change everything later). An agent is a saved configuration — system prompt, theme, default model, memory of its own. You can always come back and add more. [Agents →](/agents)

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

Osaurus generates a cryptographic master key the first time it runs. The key lives in your iCloud Keychain, gated by Face ID / Touch ID. A one-time **recovery code** is shown — **write this down somewhere safe**, it's the only thing that can recover your identity if you lose access to your Mac.

This step is skippable but recommended — it unlocks Identity, access keys, and Relay later. [Identity & Access →](/identity)

### How it works

A four-page carousel covers: the Agent Loop, the Sandbox, personalization (memory and skills), and privacy. After you finish, the chat overlay opens and you're ready to go.

## 3. Set your Core Model

This is the one knob that everyone misses. Open **Settings (`⌘ ,`) → General → Core Model** and pick a model.

### Why it matters

The Core Model is a small, lightweight inference target Osaurus uses for **background work**:

- **Memory distillation** — turns your conversations into compact pinned facts and episodes. **Without a Core Model set, distillation never runs and memory pauses.**
- **Capability auto-selection** — picks the right tools, skills, and methods for each turn. Falls back to your chat model when Core Model is unset.

### What to pick

| You have | Pick |
|---|---|
| macOS 26+ | `foundation` (Apple's on-device model — zero overhead) |
| macOS 15.5+ with a small local model | The smallest fast model you've downloaded (e.g. `gemma-4-e2b-it-4bit`) |
| Cloud-only setup | Any cheap, fast remote model (e.g. `anthropic/claude-haiku-4-5`) |

If `foundation` is available, that's the right answer 99% of the time. It's free, fast, and never leaves your Mac.

:::tip
Choosing **Use chat model (default)** in this picker leaves Core Model unset. That's fine for ad-hoc usage, but **memory will not distill**. Pick an explicit model if you want memory and auto-tools to work in the background.
:::

## 4. Try your first chat

Press **`⌘;`** from anywhere on your Mac. The chat overlay appears.

Type something:

> *Hi! Tell me a fun fact about dinosaurs.*

Press Enter. You'll see the response stream in real-time. Press `⌘;` again to dismiss.

### Try the Agent Loop

Every chat in Osaurus is an agent loop — the model can write a markdown todo list, call tools, and finish with a verified summary. To see it in action:

1. Press `⌘;` to open chat
2. Click the folder icon next to the input bar and pick a folder you don't mind it touching
3. Ask: *"Summarize what's in this folder and add a `README.md` describing it."*

The agent gets file/search/git tools scoped to that folder, writes a plan, executes it, and surfaces the new `README.md` as an artifact card.

On macOS 26+, toggle the **Sandbox** instead of picking a folder to give the agent shell access in an isolated Linux VM. [Working folders & Sandbox →](/agent-loop)

### Try voice

Click the microphone in the input bar and speak. Real-time transcription happens entirely on-device via Apple's Neural Engine. Or set up the global Transcription Mode hotkey to dictate into any app on your Mac. [Voice Input →](/voice)

## What's next

Now that you're set up:

**For everyday use:**

- [Chat](/chat) — overlay, multi-window, sessions, shortcuts
- [Agents](/agents) — create specialized assistants for different tasks
- [Memory](/memory) — what your AI remembers and how
- [Skills & Methods](/skills) — reusable expertise, automatically loaded
- [Voice Input](/voice) — dictate, wake-words, global transcription
- [Themes](/themes) — make the chat overlay yours

**For developers:**

- [HTTP API](/api) — OpenAI / Anthropic / Open Responses / Ollama compatible
- [SDK Examples](/sdk-examples) — Python, JavaScript, and more
- [CLI](/cli) — `osaurus` commands
- [Tools & Plugins](/tools) — extending Osaurus

**Care about privacy?** The whole story is on the [Security & Privacy](/security) page.

**Need help?** Join the [Discord](https://discord.gg/osaurus) or open a [GitHub issue](https://github.com/osaurus-ai/osaurus/issues).
