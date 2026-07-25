---
title: Memory
sidebar_label: Memory
description: Your AI remembers what matters and forgets the noise — privately, on your Mac. Identity facts, pinned takeaways, and per-session digests, never leaving your machine.
---

# Memory

Talking to an assistant that forgets you the moment a chat ends gets old fast. Osaurus keeps a small, useful memory of who you are and what you've worked on — entirely on your Mac. It's like a smart secretary who knows your context, not a tape recorder of every sentence.

Memory is on by default and runs in the background. Most messages get **zero extra context** added; some get a tight ~800-token block of the most relevant facts.

## Quick start

1. Open **Settings (`⌘ ,`) → General → Core Model** and pick a model. **This is the one knob that turns memory on.**
2. Open the Management window (`⌘ ⇧ M`) → **Memory** to confirm it's enabled (it is by default).
3. Just chat. Sessions are distilled into compact memory in the background once they end.

No tagging. No "save this". No prompting tricks.

:::warning[Memory needs a Core Model]
Memory writes happen through your **Core Model** — a small, fast model dedicated to background work. **Without one set, nothing gets distilled into memory.**

On macOS 26+, the default is Apple's on-device `foundation` model — zero setup. On older macOS, pick one explicitly in **Settings → General → Core Model**. `gemma-4-e2b-it-4bit` is a great local default; `anthropic/claude-haiku-4-5` works if you have a cloud provider connected.
:::

## What your AI remembers

Memory has four layers, from most-stable to most-detailed:

### Identity — who you are

Stable facts about you. Two flavors:

- **Your overrides** — things you've told Osaurus explicitly: *"My name is Terence", "Always reply in English", "I prefer tabs over spaces"*. These always show up in context. Edit them in **Memory → Your Overrides**.
- **Auto-derived narrative** — a short summary the system writes for itself based on your conversations: *"User builds Swift apps for macOS, prefers Postgres, lives in PT timezone"*. Refreshed in the background.

### Pinned facts — takeaways worth keeping

Specific facts pulled from past sessions worth remembering: *"Working on a Tauri-based note app", "Allergic to tree nuts", "Daughter's name is Maya"*. Each fact has a relevance score that decays over time — facts you stop using fade out, facts that come up repeatedly stay sharp. Surfaced only when relevant to the current message.

### Episodes — per-session digests

When a chat ends, Osaurus writes a one-to-three-sentence summary of what happened: the topics, the decisions, any action items. That digest is what gets surfaced when you say things like *"what did we discuss yesterday?"*

### Transcript — raw conversation history

Your chats are kept verbatim, but they're **not** injected into context by default. They're only read when you ask for literal recall (*"what exactly did I say about…"*) or as a search fallback.

## When memory shows up in your chats

Memory doesn't tag along on every message. A relevance gate decides per-turn:

- *"What did we talk about last week?"* → episode digest
- *"What's my name?"* / *"Remember when…"* → identity
- A turn that mentions a person/project/topic from past chats → pinned facts
- *"What were my exact words?"* → transcript fallback
- A regular question with no recall signal → **no memory injected at all**

When something does get added, it's compact (≤ 800 tokens by default) and prepended to your message, plus your tiny always-on identity overrides.

## Managing your memory

Open **Management → Memory** to:

- View **identity** (auto-derived content + manual overrides)
- Browse **pinned facts** with relevance bars and use counts
- Browse **episodes** for the active agent
- See **per-agent counts** and processing stats
- Click **Sync Now** to flush any pending memory updates immediately
- Click **Run Consolidation Now** to trim and re-rank in one pass
- Edit your **identity overrides**
- Use the **danger zone** to wipe memory (irreversible)

### Adding identity overrides

Identity overrides always appear in context — use them for stable facts the model should never forget.

1. **Memory → Your Overrides → Add**
2. Enter a fact (*"I prefer tabs over spaces", "Reply in English", "My company uses a monorepo"*)

Done. The next message in any chat with this agent will include it.

## Memory is per-agent

Each agent has its own memory. Your Code Assistant doesn't carry over context from your Therapy Buddy. Identity overrides are also per-agent unless you set them globally. If you want a fully stateless agent, flip **Disable memory** on it — nothing is injected on read, nothing is recorded on write. [Agents →](/agents)

## Privacy

Everything stays on your Mac:

- The memory database lives only on your Mac, protected at rest by FileVault — with opt-in SQLCipher encryption if you want more. See [Storage](/storage).
- The "extract memory from this session" step runs through your **Core Model** — by default, Apple's on-device `foundation` on macOS 26+, which means even that step never touches the network.
- Set a remote model as your Core Model only if you explicitly want memory distillation to use it.

[Security & Privacy →](/security)

## Under the hood

Curious about the pipeline, the consolidation math, the HTTP API, or the search backend? See [Memory Internals](/memory-internals).

---

**Related:**

- [Agents](/agents) — memory is scoped per agent
- [Agent DB & Self-Scheduling](/agent-db) — per-agent structured storage, separate from conversational memory
- [Storage & Encryption](/storage) — how the SQLite databases are protected
- [Memory Internals](/memory-internals) — the developer-facing deep dive
