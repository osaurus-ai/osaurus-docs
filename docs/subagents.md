---
title: Subagents
sidebar_label: Subagents
description: Let one agent hand a job to another — your own agents, the built-in helpers, or agents teammates share — and get the answer back in the same chat, with you in control of who, how many, and how long.
---

# Subagents

A [subagent](/glossary#subagent) is an agent that another agent brings in to handle one job and report back. Handing off work like this is called [delegation](/glossary#delegation). It lets one chat use the right specialist for each part of a task, while your chat stays short and tidy.

For example, ask Osaurus *"What's on my calendar tomorrow, and are there any unread emails from Sam?"* It hands the calendar part to Planner and the mail part to Courier, then gives you one answer.

You don't need to set anything up to start. Every agent you create can already be handed work by the [Orchestrator](/glossary#orchestrator), the built-in assistant (named "Osaurus" unless you renamed it). Just ask.

## Two ways work gets handed off

- **The Orchestrator** doesn't do hands-on work itself. It passes each job to the right place: one of your agents, one of the four built-in [helpers](/glossary#helpers) (**Research**, **Files**, **Browser** and **Code**), or a saved [workflow](/workflows) marked **Osaurus can run this for you**. Questions and changes about Osaurus itself go to the [Configurator](/glossary#configurator), and new multi-step jobs go to the [Architect](/glossary#architect), which builds a small workflow on the spot. See [Orchestrator](/orchestrator).
- **Agents you create** can hand work to other agents too, once you turn on **Delegate to subagents** for them. They can send several jobs at once and follow up with the same specialist.

## Get started

### Choose who the Orchestrator can hand work to

1. Open **Settings → Agents → Delegation**. (Settings is the gear at the bottom of the narrow strip on the left edge of the window, or press **⌘,**.)
2. Under **Allowed subagents**, check the list. Every agent you create joins it automatically. To add one back, use **Add agent**, **Add shared agent**, or **Add all agents**.
3. Don't have any agents yet? Click **Create starter agents**. It makes the starter team on your current model and adds them: **Planner** (Calendar and Reminders), **Courier** (Mail, and never sends without asking), **Keeper** (Downloads and Notes, read only), **Scout** (web research), and **Builder** (one project folder, only on Macs with developer tools).
4. In a chat with Osaurus, just ask: *"Have Scout find three reviews of this laptop."*

### Let one of your agents hand off work

1. Open **Settings → Agents** and pick the agent.
2. Go to **Abilities → Subagents** and turn on **Delegate to subagents**.
3. Under **Allowed subagents**, click **Add agent** or **Add shared agent**. An empty list keeps delegation off for this agent.
4. In a chat with that agent, ask for something that needs a specialist: *"Have Scout research this, then write up the summary."* For separate jobs, ask it to run them at the same time.

## What happens when work is handed off

- **The specialist works in its own separate chat**, with its own instructions, model, tools, and [Working Folder](/glossary#working-folder). It sends back a short answer.
- **You see its progress** as a card in your chat, but its step-by-step work isn't added to your conversation. That keeps your chat focused and leaves room for the model to think.
- **Files it makes come back to your chat** as cards you can open, just like files from any agent.
- **No folder of its own?** It works in the folder of the chat that handed it the job. For the Orchestrator, that's the Orchestrator's Working Folder (see [Working in Chat](/agent-loop)).
- **Specialists can't hand work on** to other agents, and they can't ask you questions directly. If one needs something from you, it says so in its answer, and you can reply through the main chat.
- **Every job the Orchestrator hands off is logged** in **Settings → Agents → Orchestrator → Delegations**.

Ways an agent you created can hand off work:

| You ask for | What happens |
|---|---|
| **One job** | One specialist works on it; the answer comes back in the same reply. |
| **Several jobs at once** | They run together as one batch, after **one** approval. Answers come back in the order they were asked. |
| **A follow-up** | The same specialist picks up where it left off. |
| **A background job** | The agent keeps going right away; the answer arrives later as a new message. |

If you find yourself handing off the same jobs in the same order again and again, save the whole thing as a [workflow](/workflows). It then runs the same way every time.

### Teammates' shared agents

Agents your teammates share in a [workspace](/glossary#workspace) you've joined can be handed work just like your own. They're added to **Allowed subagents** as the workspace loads, appear as *Name@Workspace*, and run on your teammate's Mac. That means your request leaves your Mac and goes to theirs, and it uses the workspace's [credits](/glossary#credits). Osaurus asks you before using a teammate's agent, unless you change that setting.

### Pictures, video, and controlling apps

The same system powers several abilities on agents you create:

- **Image** — create or edit a picture right in the chat. See [Image & Video Generation](/image-generation).
- **Video** — get a price, then make a video in the cloud from text or a picture, and bring back the finished video.
- **Computer Use** — use another Mac app. See [Computer Use](/computer-use).
- **Browser Use** — use its own private web browser. See [Browser Use](/browser-use).
- **AppleScript** — automate Mac apps with scripts.

Turn these on in an agent's **Abilities → Subagents**; they're off until you do. The Orchestrator doesn't have these switches. To use them from Osaurus, add an agent that has them to **Allowed subagents** in **Settings → Agents → Delegation**, and the Orchestrator hands that work over.

## Settings

The Orchestrator's settings are in **Settings → Agents → Delegation**. Each agent you create has the same settings in its own **Abilities → Subagents**.

| Setting | What it controls |
|---|---|
| **Allowed subagents** | Which agents this one may hand work to, including teammates' shared agents. Deleting an agent removes it from every list. |
| **Permission** | Whether to **Ask**, **Deny**, or **Always Allow** before using one of your agents. The default is **Always Allow**; each agent still asks before anything sensitive. With **Ask**, you approve once per batch. |
| **Permission for shared (workspace) agents** | The same choice for teammates' agents. The default is **Ask**. |
| **Limits** | How much one specialist may do: **Max output tokens per subagent** (how long its answer can be; default 8192 [tokens](/glossary#token)), **Max turns per subagent** (how many steps it can take; default 24), **Time limit per subagent (seconds)** (default 900, which is 15 minutes), **Max local subagents at once**, and **Max remote subagents at once** (default 8). |
| **Advanced** | **Agent-target model override** runs every specialist on one model. Leave it on **Use each agent's model** unless you need this. |

**Max local subagents at once** is how many specialists running on models on your Mac may work at the same time. It shares one value with **Settings → Server → Concurrency & Batching → Concurrent Sessions**; changing either one changes the other. Concurrent Sessions starts out automatic: Osaurus picks a value that suits your Mac's memory. It's a maximum, and Osaurus may run fewer at once if memory is tight.

**Max remote subagents at once** covers specialists that run in the cloud or on a teammate's Mac.

## Local models and memory

Handing off works in any direction: an agent on a [local model](/glossary#local-model) or a [cloud model](/glossary#cloud-model) can hand work to a specialist on either. Only one case needs care: an agent on a local model handing work to a specialist on a **different** local model. Two big models loaded at once can use up your Mac's memory, so Osaurus manages it for you.

Two settings in **Settings → Agents → Delegation → Local Models & Memory** control this. They apply to the Orchestrator and every agent you create:

| Setting | Default | What it does |
|---|---|---|
| **Swap Local Models for Subagents** | On | Osaurus puts away the first model, runs the specialist's model, then brings the first one back and carries on. Turning this off keeps both loaded, which uses more memory. |
| **Check Memory Before Delegating** | On | Osaurus checks there's enough memory before loading anything, and runs fewer specialists at once — or none — if there isn't. Turning this off skips the checks, and Osaurus may run out of memory or quit unexpectedly. |

How each kind of specialist runs:

| Specialist's model | What happens |
|---|---|
| Same local model as the agent handing off | Shares the model that's already loaded, with no swapping. Several can run at once. If memory is tight, each gets less room so it can still run, just more slowly. |
| A different local model | Swapped in and out as described above, one at a time. With swapping off, both stay loaded. |
| A cloud model, or the agent handing off uses a cloud model | Runs without affecting the models on your Mac |

If a specialist won't fit, Osaurus says so **before** unloading anything, so your current model stays ready.

## Troubleshooting

- **My agent won't hand off work.** Check that **Delegate to subagents** is on in its **Abilities → Subagents**, and that the specialist is in its **Allowed subagents**.
- **Osaurus won't hand work to one of my agents.** Check that the agent is in **Allowed subagents** in **Settings → Agents → Delegation**. If none of your agents is there, click **Add all agents**.
- **Fewer specialists run at once than I set.** Osaurus lowers the number when memory is tight, or when **Concurrent Sessions** is set lower.
- **A specialist stopped before finishing.** It hit a limit. Raise **Max turns per subagent**, **Time limit per subagent (seconds)**, or **Max output tokens per subagent**.
- **I keep getting asked before a teammate's agent runs.** Change **Permission for shared (workspace) agents** to **Always Allow**.
- **"Not enough memory" for a specialist.** Use the same model as the main agent, a smaller model, or a cloud model.
- **An agent can't be handed work.** Agents that run on a [runtime](/harness-runtimes) like Claude Code can't take delegated work yet. Agents showing [Needs setup](/glossary#needs-setup) are refused until you finish their setup (see [Agent Templates](/agent-templates)).

---

## Under the hood

### How the Orchestrator delegates

The Orchestrator has no `spawn_agent` tool. It hands tool work to `run_workflow`: each agent on its **Allowed subagents** list, and each built-in helper (Research, Files, Browser, Code), runs as a one-step workflow that takes the user's message as its task. Saved workflows are offered to `run_workflow` only when marked **Osaurus can run this for you**. Osaurus questions and setting changes go to `configurator_handoff`; new multi-step work goes to `architect_handoff`. See [Orchestrator](/orchestrator).

The Orchestrator's delegation settings are stored in `~/.osaurus/config/agent-delegation.json` and can be set declaratively with `delegation` (for example `delegation.spawnable_agents`, which **replaces** the whole list). An agent created with `orchestrator_spawnable: false` doesn't join the list. Removing a teammate's shared agent leaves a tombstone so it doesn't rejoin when re-shared.

### `spawn_agent`

`spawn_agent(input, agent)` is the delegation tool for agents you create with **Delegate to subagents** on. The worker runs as a real chat session of the target agent — its system prompt, model, tools, and Working Folder — and returns a compact summary plus a `session_id`.

| Pattern | How it works |
|---|---|
| **One task** | One `spawn_agent` call; the result comes back into the turn |
| **A wave** | Several `spawn_agent` calls in one message run as one wave: **one approval**, shared limits, results in call order. Calls beyond the limit are refused with a retryable result and sent in the next message. |
| **Follow up** | `continue: <session_id>` sends the next message to that same worker. A worker that needs something from you ends with `NEEDS INPUT:`; answer it the same way. |
| **Background** | `background: true` returns immediately; the result arrives later as a follow-up message. Background workers don't count toward the wave, and stopping the launching turn stops them too. |

Workers get their agent's full tool surface, except they can't spawn further agents or call `clarify` directly. There's no separate tool-call cap — the turn, token, and time limits bound a run. The worker's inner steps never enter the parent transcript; deliverables are listed in `artifact_paths`. Files shared with `share_artifact` are adopted into the parent session and render as ordinary artifact cards. Results from teammates' shared agents come back as a digest plus small shared files (a few MB in total).

Media and automation capabilities use the same machinery: `image`, `video`, `computer_use`, `browser_use`, and an AppleScript subagent.

### Concurrency

- **Max local subagents at once** and the Server's **Concurrent Sessions** are the same setting (range 1–32). In Automatic mode, the value mirrors the resolved Memory Safety profile and isn't stored as an explicit override; the stored fallback is 3.
- It's the BatchEngine ceiling for same-model local waves; RAM admission checks and current engine occupancy can run a smaller wave.
- With **Continuous Batching** off, each local model runs one job at a time even if Concurrent Sessions is higher.
- **Max remote subagents at once** covers cloud, provider, and shared workspace subagents (range 1–32, default 8).

### Model residency

- **Check Memory Before Delegating** checks available memory and each worker's working-memory cost before anything loads, and splits or refuses a wave when needed. The estimate counts every production compute weight a model loads, and the RAM gauge uses the same capacity accounting.
- A memory check refuses before evicting anything: if a worker won't fit, the parent's model stays loaded and the agent reports the shortfall.
- Workers on different local models run in sequence so loads never race; cloud workers overlap freely.
- The same swap setting governs local image jobs and context compaction that use a different local model.

---

**Related:**

- [Orchestrator](/orchestrator) — the built-in assistant that routes work to your agents and helpers
- [Agents](/agents) — creating and configuring agents
- [Workflows](/workflows) — save a hand-off you repeat as a task Osaurus remembers
- [Workspaces](/workspaces) — sharing agents with your team
- [Image & Video Generation](/image-generation) — the `image` and `video` tools
- [Computer Use](/computer-use) — the `computer_use` subagent
- [Browser Use](/browser-use) — the `browser_use` subagent
- [Models](/models) — local and cloud models agents can run on
