---
title: Subagents
sidebar_label: Subagents
description: Let one agent hand a job to another — your own agents or ones teammates share — and get the answer back in the same chat, with you in control of who, how many, and how long.
---

# Subagents

A [subagent](/glossary#subagent) is an agent that another agent brings in to handle one job and report back. Handing off work like this is called [delegation](/glossary#delegation). It lets one chat use the right specialist for each part of a task — a coding question to your coding agent, three research questions at once to your research agent — while your chat stays short and tidy.

You don't need to set anything up to start: every agent you create can already be used by the [Orchestrator](/glossary#orchestrator), the agent built into Osaurus. Just ask it to hand something off.

## Get started

1. Choose which agent will do the handing off:
   - **The Orchestrator:** open **Settings… (`⌘ ,`) → Orchestrator → Subagents**.
   - **An agent you created:** open it in **Settings… → Agents**, go to **Abilities → Subagents**, and turn on **Delegate to subagents**.
2. Under **Allowed subagents**, choose who it may hand work to: **Add agent**, **Add shared agent**, or **Add all agents**. Don't have any specialists yet? **Create starter agents** makes a Coder, a Researcher, and a Writer using your current model, and adds them.
3. In a chat, ask for something that benefits from a specialist: *"Have the research agent summarize this paper, then continue."* For separate tasks, ask it to run them at the same time.

## What happens when an agent hands off work

- **The specialist works in its own separate chat**, with its own instructions, model, tools, and [Working Folder](/glossary#working-folder). It sends back a short answer.
- **You see its progress live** in your chat, but its step-by-step work isn't added to your conversation. That keeps your chat focused and leaves room for the model to think.
- **Files it makes come back to your chat** as cards you can open, just like files from any agent.
- **No folder of its own?** It works in the folder of the agent that handed it the job. For the Orchestrator, that's the [Orchestrator's Working Folder](/orchestrator#working-folder).
- **Specialists can't hand work on** to other agents, and they can't ask you questions directly. If one needs something from you, it says so in its answer, and you can reply through the main chat.
- **Every job is logged** in **Settings… → Orchestrator → Delegations**.

Ways to hand off work:

| You ask for | What happens |
|---|---|
| **One job** | One specialist works on it; the answer comes back in the same reply. |
| **Several jobs at once** | They run together as one batch, after **one** approval. Answers come back in the order they were asked. |
| **A follow-up** | The same specialist picks up where it left off. |
| **A background job** | The agent keeps going right away; the answer arrives later as a new message. |

### Teammates' shared agents

Agents your teammates share in a [workspace](/glossary#workspace) you've joined can be handed work just like your own. They're added to the Orchestrator's **Allowed subagents** as the workspace loads, appear as *Name@Workspace*, and run on your teammate's Mac. Osaurus asks you before using a teammate's agent, unless you change that setting.

### Pictures, video, and controlling apps

The same system powers several abilities on agents you create:

- **Image** — create or edit a picture right in the chat. See [Image & Video Generation](/image-generation).
- **Video** — get a price, then make a video in the cloud from text or a picture, and bring back the finished video.
- **Computer Use** — use another Mac app. See [Computer Use](/computer-use).
- **Browser Use** — use its own private web browser. See [Browser Use](/browser-use).
- **AppleScript** — automate Mac apps with scripts.

Turn these on in an agent's **Abilities → Subagents** tab; they're off until you do. The Orchestrator doesn't use them itself. Add an agent that has them to the Orchestrator's **Allowed subagents**, and it hands that work over.

## Settings

The same settings appear in **Settings… → Orchestrator → Subagents** and on each agent's **Abilities → Subagents** tab.

| Setting | What it controls |
|---|---|
| **Allowed subagents** | Which agents this one may hand work to, including teammates' shared agents. Deleting an agent removes it from every list. |
| **Permission** | Whether to **Ask**, **Deny**, or **Always Allow** before using one of your agents. The default is **Always Allow**. With **Ask**, you approve once per batch. |
| **Permission for shared (workspace) agents** | The same choice for teammates' agents. The default is **Ask**. |
| **Limits** | How much one specialist may do: **Max output tokens per subagent** (how long its answer can be; default 8192 [tokens](/glossary#token)), **Max turns per subagent** (how many steps it can take; default 24), **Time limit per subagent (seconds)** (default 900, which is 15 minutes), **Max local subagents at once** (default 3), and **Max remote subagents at once** (default 8). |
| **Advanced** | Use one model for every specialist. Leave it on **Use each agent's model** unless you need this. |

**Max local subagents at once** is how many specialists running on models on your Mac may work at the same time. It shares one value with **Concurrent Sessions** in **Settings… → Server → Settings → Concurrency & Batching → Concurrent Sessions**; changing either one changes the other. Concurrent Sessions starts out automatic (the field is left empty): Osaurus picks a value that suits your Mac's memory, and it may differ from the default of 3. It's a maximum: Osaurus may run fewer at once if memory is tight.

An agent's **Abilities → Subagents** tab also has the **Image** (with its picture model), **Video**, **Computer Use**, **Browser Use**, and **AppleScript** cards described above.

## Local models and memory

Handing off works in any direction: an agent on a [local model](/glossary#local-model) or a [cloud model](/glossary#cloud-model) can hand work to a specialist on either. Only one case needs care: an agent on a local model handing work to a specialist on a **different** local model. Two big models loaded at once can use up your Mac's memory, so Osaurus manages it for you.

Two settings in **Settings… → Orchestrator → Subagents → Local Models & Memory** control this. They apply to every agent that hands off work:

| Setting | Default | What it does |
|---|---|---|
| **Swap local models for subagents** | On | Osaurus puts away the first model, runs the specialist's model, then brings the first one back and carries on. Turning this off keeps both loaded, which uses more memory. |
| **Check memory before delegating** | On | Osaurus checks there's enough memory before loading anything, and runs fewer specialists at once — or none — if there isn't. Turning this off skips the checks, and Osaurus may run out of memory or quit unexpectedly. |

How each kind of specialist runs:

| Specialist's model | What happens |
|---|---|
| Same local model as the agent handing off | Shares the model that's already loaded, with no swapping. Several can run at once. If memory is tight, each gets less room so it can still run, just more slowly. |
| A different local model | Swapped in and out as described above, one at a time. With swapping off, both stay loaded. |
| A cloud model, or the agent handing off uses a cloud model | Runs without affecting the models on your Mac |

If a specialist won't fit, Osaurus says so **before** unloading anything, so your current model stays ready.

## Troubleshooting

- **The agent won't hand off work.** Check that **Delegate to subagents** is on (for agents you created) and that the specialist is in **Allowed subagents**.
- **Fewer specialists run at once than I set.** Osaurus lowers the number when memory is tight, or when **Concurrent Sessions** is set lower.
- **A specialist stopped before finishing.** It hit a limit. Raise **Max turns per subagent**, **Time limit per subagent (seconds)**, or **Max output tokens per subagent**.
- **I keep getting asked before a teammate's agent runs.** Change **Permission for shared (workspace) agents** to **Always Allow**.
- **"Not enough memory" for a specialist.** Use the same model as the main agent, a smaller model, or a cloud model.

---

## Under the hood

### `spawn_agent`

`spawn_agent(input, agent)` is the one delegation tool. The worker runs as a real chat session of the target agent — its system prompt, model, tools, and Working Folder — and returns a compact summary plus a `session_id`.

| Pattern | How it works |
|---|---|
| **One task** | One `spawn_agent` call; the result comes back into the turn |
| **A wave** | Several `spawn_agent` calls in one message run as one wave: **one approval**, shared limits, results in call order |
| **Follow up** | `continue: <session_id>` sends the next message to that same worker. A worker that needs something from you ends with `NEEDS INPUT:`; answer it the same way. |
| **Background** | `background: true` returns immediately; the result arrives later as a follow-up message |

Workers get their agent's full tool surface, except they can't spawn further agents or call `clarify` directly. There's no separate tool-call cap — the turn, token, and time limits bound a run. The worker's inner steps render live in the chat row but never enter the parent transcript. Files shared with `share_artifact` are adopted into the parent session and render as ordinary artifact cards.

Media and automation capabilities use the same machinery: `image`, `video`, `computer_use`, `browser_use`, and an AppleScript subagent.

### Concurrency

- **Max local subagents at once** and the Server's **Concurrent Sessions** are the same setting (range 1–32). In Automatic mode (field left empty), the value mirrors the resolved Memory Safety profile and isn't stored as an explicit override.
- It's the BatchEngine ceiling for same-model local waves; RAM admission checks and current engine occupancy can run a smaller wave.
- With **Continuous Batching** off, each local model runs one job at a time even if Concurrent Sessions is higher.
- **Max remote subagents at once** covers cloud, provider, and shared workspace subagents (range 1–32).

### Model residency

- **Check memory before delegating** checks available memory and each worker's working-memory cost before anything loads, and splits or refuses a wave when needed.
- A memory check refuses before evicting anything: if a worker won't fit, the parent's model stays loaded and the agent reports the shortfall.
- Workers on different local models run in sequence so loads never race; cloud workers overlap freely.
- The same swap setting governs local image jobs and context compaction that use a different local model.

---

**Related:**

- [Orchestrator](/orchestrator) — the built-in agent that hands off work by default
- [Agents](/agents) — creating and configuring agents
- [Workspaces](/workspaces) — sharing agents with your team
- [Image & Video Generation](/image-generation) — the `image` and `video` tools
- [Computer Use](/computer-use) — the `computer_use` subagent
- [Browser Use](/browser-use) — the `browser_use` subagent
- [Models](/models) — local and cloud models agents can run on
