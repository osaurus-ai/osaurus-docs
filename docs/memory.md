---
title: Memory
sidebar_label: Memory
description: Your AI remembers what matters and forgets the noise — privately, on your Mac. Facts about you, key takeaways, and short summaries of past chats, never leaving your machine.
---

# Memory

Talking to an assistant that forgets you the moment a chat ends gets old fast. Osaurus keeps a small, useful [memory](/glossary#memory) of who you are and what you've worked on — entirely on your Mac. Think of it as a smart secretary who knows your context, not a tape recorder of every sentence.

Memory is on by default and works in the background. It needs a [Core Model](/glossary#core-model) — a small helper model Osaurus uses behind the scenes — which is set up for you on macOS 26 and later.

## Get started

1. Open **Settings…** (`⌘ ,`) → **General → Core Model** and check a model is picked. **Memory only works when a Core Model is set.**
2. Open **Settings… → Memory** to confirm it's turned on (it is by default).
3. Just chat. When a chat ends, Osaurus saves what's worth remembering in the background.

No tagging. No "save this". No special prompts.

:::warning[Memory needs a Core Model]
Osaurus saves memories using your **Core Model**, a small, fast model kept for background work. **Without one, nothing gets saved to memory.**

On macOS 26 and later, the default is Apple's built-in **Foundation** model (see [Apple Intelligence](/models/apple-intelligence)) — nothing to set up. On older macOS, pick one in **Settings… → General → Core Model**. `gemma-4-e2b-it-4bit` is a great [local model](/glossary#local-model) choice; `anthropic/claude-haiku-4-5` works if you've connected a cloud [provider](/glossary#provider).
:::

## What your AI remembers

Memory has four layers, from the most stable to the most detailed:

### Identity — who you are

Lasting facts about you. Two kinds:

- **Your overrides** — things you've told Osaurus directly: *"My name is Terence", "Always reply in English", "I prefer tabs over spaces"*. These are always included. Edit them in **Memory → Your Overrides**.
- **A short automatic summary** — Osaurus writes this for itself from your conversations: *"User builds Swift apps for macOS, prefers Postgres, lives in PT timezone"*. It refreshes in the background.

### Pinned facts — takeaways worth keeping

Specific facts from past chats that are worth remembering: *"Working on a Tauri-based note app", "Allergic to tree nuts", "Daughter's name is Maya"*. Facts you stop mentioning slowly fade; facts that keep coming up stay sharp. They only appear when they're relevant to what you're asking.

### Episodes — short chat summaries

When a chat ends, Osaurus writes a one-to-three-sentence summary of what happened: the topics, decisions, and to-dos. That's what it uses when you ask things like *"what did we discuss yesterday?"*

### Transcript — the full conversation

Your chats are kept word for word, but they **aren't** added to new chats by default. Osaurus only reads them when you ask for exact wording (*"what exactly did I say about…"*) or when nothing else turns up.

## When memory shows up in your chats

Memory doesn't tag along on every message. For each message, Osaurus decides whether anything is worth adding:

- *"What did we talk about last week?"* → a chat summary
- *"What's my name?"* / *"Remember when…"* → identity
- A message that mentions a person, project, or topic from past chats → pinned facts
- *"What were my exact words?"* → the full transcript
- A regular question with nothing to recall → **no memory added at all**

Most messages get nothing extra. When something is added, it's short, along with your always-on identity overrides.

## Managing your memory

Open **Settings… → Memory** to:

- See your **identity** (the automatic summary plus your overrides)
- Browse **pinned facts**, with bars showing how relevant each one is and how often it's used
- Browse **episodes** (chat summaries) for the active agent
- See counts for each agent and processing stats
- Click **Sync** to save any pending memory updates right away
- Click **Run Now** under **Configuration** to tidy up memory in one go; **Last run** shows when it last finished
- Edit your **identity overrides**
- Use the **danger zone** to erase memory (this can't be undone)

### Tidying up

Every so often, Osaurus tidies memory: old facts fade, near-duplicates are merged, and old summaries are cleared out. This happens in the background **at most once per Consolidation Interval** (every 24 hours by default).

Osaurus remembers when it last tidied, even if you quit, update, or restart. If it's overdue, it catches up about a minute after you open the app. It waits while a model is answering you and tries again later. **Run Now** tidies immediately.

### Adding identity overrides

Identity overrides are always included — use them for lasting facts the AI should never forget.

1. Go to **Memory → Your Overrides → Add**.
2. Enter a fact (*"I prefer tabs over spaces", "Reply in English", "My company uses a monorepo"*).

Done. Your next message in any chat with this agent includes it.

## Memory is per-agent

Each [agent](/glossary#agent) has its own memory. Your Code Assistant doesn't carry over what your Therapy Buddy knows. Identity overrides are also per-agent unless you set them for everyone. For an agent that remembers nothing, turn on **Disable memory** for it — nothing is added to its chats, and nothing is saved. [Agents →](/agents)

The exception is a **[project](/projects)**: chats inside a project share one memory across every agent used there. A fact from one chat is remembered in another right away — even by agents whose own memory is off. (They read and add to the project's memory without building any personal memory.)

## Privacy

Everything stays on your Mac:

- Your memory is stored only on your Mac, protected by [FileVault](/glossary#filevault), with extra encryption available if you want it. See [Storage](/storage).
- Saving memories runs on your **Core Model**. By default that's Apple's built-in Foundation model on macOS 26 and later, so even that step never uses the internet.
- Only choose a [cloud model](/glossary#cloud-model) as your Core Model if you're happy for memory-saving to use it.

[Security & Privacy →](/security)

---

## Under the hood

- **Injection budget:** when memory is added to a message, it's a compact block of at most about 800 [tokens](/glossary#token) by default, prepended to your message along with your identity overrides. Most messages get zero extra context.
- **Relevance gate:** a per-turn gate picks which layer (if any) to inject, based on recall signals in the message.
- **Distillation:** sessions are distilled into memory in the background after they end, through the Core Model.
- **Fact scoring:** each pinned fact has a relevance score that decays over time and is boosted by use.
- **Consolidation:** decaying stale facts, merging near-duplicates, and pruning old episodes. The last-run time persists across restarts; scheduled passes wait while a model is generating, and **Run Now** skips both the interval and that wait.
- **Storage:** the memory database is SQLite, with opt-in SQLCipher encryption. See [Storage & Encryption](/storage).

For the full pipeline, the consolidation math, the HTTP [API](/glossary#api), and the search backend, see [Memory Internals](/memory-internals).

---

**Related:**

- [Agents](/agents) — memory is kept per agent
- [Agent DB & Self-Scheduling](/agent-db) — an agent's own organized records, separate from memory
- [Storage & Encryption](/storage) — how the databases are protected
- [Memory Internals](/memory-internals) — the developer deep dive
