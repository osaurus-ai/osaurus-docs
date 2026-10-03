---
title: Quick Start
sidebar_label: Quick Start
description: Go from installing Osaurus to your first AI chat in about five minutes, step by step.
---

# Quick Start

This page takes you from a fresh install to your first AI chat in about five minutes. You'll install the app, create your first assistant, choose the AI it runs on, and say hello. All you need is a Mac with an M-series chip and macOS 15.5 or later.

<div style={{textAlign: 'center', margin: '2rem 0'}}>
<a href="https://osaurus.ai/" class="button button--primary button--lg">Download Osaurus</a>
&nbsp;&nbsp;
<a href="/installation" class="button button--secondary button--lg">All install options</a>
</div>

## Get started

### 1. Install

1. Download Osaurus from [osaurus.ai](https://osaurus.ai/).
2. Open the download and drag **Osaurus** into your **Applications** folder.
3. Open Osaurus. A quick way: press `⌘ Space`, type "Osaurus", and press Return.

Want to chat offline the moment it opens? Each release also has a larger **full** download (~3.6 GB) that includes the Raptor 0.6 model, so you skip the model download. Full guide: [Installation](/installation#pick-a-build).

### 2. Set up your first assistant

The first time you open Osaurus, three short screens walk you through setup:

1. **Welcome.** Click **Get started**. The checkbox below it lets you choose whether to share anonymous usage data.
2. **What should your first Dino be great at?** Your first [agent](/glossary#agent) (a saved AI assistant, nicknamed a "Dino") gets set up here. Pick a specialty — **Everyday helper**, **Research & writing**, or **Coding & development** — and give it a name and a picture. Then click **Create your Dino**. You can change all of this later, and make more agents anytime. [Agents →](/agents)
3. **Choose its AI.** Pick the [model](/glossary#model) (the AI "brain") your agent runs on, then click **Continue to Osaurus**. Your options are below.

If you installed the full download, the button on screen 2 reads **Create your Dino and start chatting**, and you skip screen 3 — Raptor 0.6 is already set up.

#### Your choices for the AI

- **A model that runs on your Mac (recommended).** Osaurus suggests one on a card marked **Picked for your Mac**. On most Macs that's **Raptor 0.6**. Macs with lots of memory get a bigger pick, and Macs with little memory get the lightest one that fits. Click **Download**, or **Change model** to choose another. You don't have to wait: you can continue while it downloads. A [local model](/glossary#local-model) like this works offline, and nothing you type leaves your Mac.
- **Osaurus Cloud.** Hosted models paid for with [credits](/glossary#credits). You get a free welcome credit to start. Click **Set up later** to start on [Osaurus Cloud](/glossary#osaurus-cloud) now and decide about a local model later.
- **An AI company account you already have.** Under **Prefer to connect your AI Provider?**, pick OpenAI, Anthropic, xAI, OpenRouter, or Gemini (**More** lists the rest). Paste your [API key](/glossary#api-key) (a password from that company), or sign in where offered.
- **Claude Code.** Use your existing Claude Code sign-in.
- **Custom.** Paste the web address of another compatible AI service, including one running on your own Mac.

You can add more models later in **Settings… → Local Models** or **Settings… → Providers**.

:::info[Identity and Sandbox are set up for you]
There's nothing else to set up. Osaurus quietly creates your [identity](/glossary#identity) (how it proves requests come from you) when you finish. When you have a minute, save your 24-word [recovery phrase](/glossary#recovery-phrase) from **Settings… → Identity → View recovery phrase**. It's what restores your identity on a new Mac. The [Sandbox](/glossary#sandbox), where agents can safely run code, sets itself up the first time an agent needs it. [Identity →](/identity) · [Sandbox →](/sandbox)
:::

### 3. Pick your Core Model

This is the one setting most people miss on day one. Open **Settings… (`⌘ ,`) → General → Core Model** and pick a model.

The [Core Model](/glossary#core-model) is a small model Osaurus uses behind the scenes:

- **Remembering things.** It turns your chats into short facts your AI can recall later. **If no Core Model is set, this doesn't happen and [memory](/glossary#memory) pauses.**
- **Picking the right tools.** It helps find the [tools](/glossary#tool) and [skills](/glossary#skill) that fit each message. Without a Core Model, your chat model does this instead.

Which one to pick:

| You have | Pick |
|---|---|
| macOS 26 or later | **foundation** ([Apple Intelligence](/glossary#apple-intelligence), free and on your Mac) |
| macOS 15.5 or later with a local model | The smallest, fastest model you've downloaded |
| Only cloud models | Any cheap, fast cloud model |

If **foundation** is available, it's almost always the right answer: it's free, fast, and never leaves your Mac.

:::tip
Choosing **Use chat model (default)** in this picker leaves the Core Model unset. That's fine for casual use, but **memory won't update**. Pick a specific model if you want memory and automatic tool picking to work in the background.
:::

### 4. Try your first chat

1. Press **`⌘;`** from anywhere on your Mac. The chat window appears.
2. Type something, like: *Hi! Tell me a fun fact about dinosaurs.*
3. Press Return. The reply appears as it's written.
4. Press `⌘;` again to hide the window.

## Have it actually do something

Agents can do real work, not just answer. Try this:

1. Press `⌘;` to open chat.
2. Click the **Folder** button on the message box and pick a folder you don't mind it changing. This becomes the chat's [Working Folder](/glossary#working-folder).
3. Ask: *"Summarize what's in this folder and add a README.md describing it."*

You'll see a to-do list tick off as the agent reads files and writes the new one. The new file shows up as a card in the chat. Every change is recorded, so you can review or undo it from the chat's **File Changes** panel.

Who does the work depends on the agent:

- **The [Orchestrator](/glossary#orchestrator)** (the agent every new chat starts with) can read the folder but doesn't write in it. It hands the writing to one of your own agents, which works in the same folder.
- **An agent you created** does the work itself.

New agents you create start with the Sandbox turned on, so they can run code safely. Picking a Working Folder for one of them turns its Sandbox off so it can work right in the folder, and the agent remembers that folder for its next chats. You can turn the Sandbox back on later in the agent's **Abilities** settings. [Tasks →](/agent-loop) · [Orchestrator →](/orchestrator)

## Try voice

Click the microphone in the message box and speak. Your voice is turned into text on your Mac and never leaves it. You can also set a shortcut key to dictate into any app on your Mac. [Voice →](/voice)

## What's next

**For everyday use:**

- [Chat](/chat) — the chat window, tabs, history, and shortcuts
- [Agents](/agents) — create assistants for different jobs
- [Mobile](/mobile) — pair the iPhone app and reach your agents from anywhere
- [Memory](/memory) — what your AI remembers and how
- [Skills](/skills) — ready-made know-how, loaded automatically
- [Voice](/voice) — dictation, wake words, and typing into any app
- [Themes](/themes) — change how the chat window looks

**For developers:**

- [HTTP API](/api) — OpenAI / Anthropic / Open Responses / Ollama compatible
- [SDK Examples](/sdk-examples) — Python, JavaScript, and more
- [CLI](/cli) — `osaurus` commands
- [Tools & Plugins](/tools) — extending Osaurus

**Care about privacy?** The whole story is on the [Privacy & Trust](/security) page.

**Need help?** Join the [Discord](https://discord.gg/osaurus) or open a [GitHub issue](https://github.com/osaurus-ai/osaurus/issues).

---

## Under the hood

- **Signing:** the app is Developer ID signed and notarized, so it opens without Gatekeeper warnings.
- **Onboarding steps:** Welcome → Create Agent → Configure AI. When a bundled model is ready (full build, and enough memory), the Configure AI step is skipped and the bundled model is set as the agent's brain. The first agent's specialty cards map onto the Assistant, Researcher, and Coder starter templates, which supply its system prompt.
- **Custom endpoints:** **Custom** accepts any OpenAI-compatible server URL. Local endpoints don't need a key. API keys are stored in the macOS Keychain.
- **Apple Foundation Models** stay available after onboarding but aren't offered in the first-run step, because onboarding prioritizes models that support tools and agent work.
- **Removed from onboarding:** the old plugin picker, walkthrough carousel, consent screen, and in-onboarding code redemption. After setup, manage native plugins in **Settings… → Tools & MCP → Plugins**, privacy choices in **Settings… → Privacy**, and credits in **Settings… → Credits**.
- **Identity key:** created on completion; it lives in your iCloud Keychain, gated by Face ID / Touch ID.
- **Sandbox:** configured with defaults and provisioned lazily the first time an agent needs it, so there's no surprise multi-GB download. It's a Linux VM on macOS 26+ and a Seatbelt-confined runner on macOS 15.
- **Core Model examples:** `foundation` on macOS 26+; a small local model such as `gemma-4-e2b-it-4bit`; or a cheap remote model such as `anthropic/claude-haiku-4-5`.
- **Voice:** transcription runs on-device on Apple's Neural Engine.
