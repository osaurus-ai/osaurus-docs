---
title: Subagents
sidebar_label: Subagents
description: Delegate one task or a mixed batch to saved agents and local or remote models, with bounded concurrency and local-model residency safety.
---

# Subagents

Subagents let a chat delegate a bounded task to another model — **local or remote** — or to one of your saved agents, and get a compact result back without cluttering the conversation. Offload research to a bigger cloud model, hand a coding question to a specialist agent, or generate media, all mid-turn.

Every newly created custom agent is added to the built-in Orchestrator's spawn pool by default. The Orchestrator can create and delegate to a specialist in the same turn. Other parent agents still use their own explicit spawn pools and approval policies.

## Spawn tools

| Tool | What it does |
|---|---|
| `spawn_agent(input, agent)` | Delegate a task to one of your saved agents — it uses that agent's persona and allowed child tools |
| `spawn_model(input, model)` | Delegate to a bare model (no persona) — useful for "ask a bigger/faster model" moments |
| `spawn_batch(jobs)` | Fan out independent jobs across a mixed set of allowed agents and bare models |

The subagent runs its own bounded job and returns a single compact result. Its inner steps render live in the chat row but never enter your conversation's transcript, so context stays lean.

If the child shares files with `share_artifact`, Osaurus safely adopts them into the parent session. Artifact bytes do not enter the spawn result JSON; the files render as ordinary artifact cards in the parent conversation.

For `spawn_batch`, every job carries a stable ID, an `agent` or `model` target, and its own input. One batch can mix saved agents, local models, and remote models. Osaurus validates the whole batch first, asks for **one approval for the batch**, and returns one result per job in the same order as the input.

Three more capabilities share the same machinery and the same per-agent settings surface:

- **`image`** — generate or edit a picture inline; see [Image & Video Generation](/image-generation)
- **`video`** — quote and start a cloud text-to-video or image-to-video job, then return the finished video
- **`computer_use`** — drive a macOS app; see [Computer Use](/computer-use)
- **`browser_use`** — drive a persistent, isolated browser; see [Browser Use](/browser-use)

## Getting started

1. Open **Agents → Abilities → Subagents** on the agent you want to grant delegation. Configure the built-in agent under **Settings → Orchestrator**.
2. Enable **Spawn & Delegation** and pick the **spawnable pool** — which saved agents and models this agent may delegate to. The pool is searchable, and you can attach a note to each entry to tell the model when to use it.
3. Ask for something that benefits from delegation: *"Have the research agent summarize this paper, then continue."* For independent work, ask it to run the tasks as a batch.
4. Approve the first use. You can set Spawn to **Always Allow** in the same settings surface.

## Batch execution and residency

Delegation works in any direction — local to local, local to remote, remote to local, remote to remote. Only one case touches GPU memory: delegating from a local model to a **different** local model.

| Direction | Behavior |
|---|---|
| Local → same local model | Runs in place — no swap |
| Local → different local model (handoff on) | Unload the chat model, run the job, reload, continue |
| Local → different local model (handoff off) | Rejected up front — nothing is evicted |
| Local ↔ remote, remote ↔ remote | Runs in place |

**Local Orchestrator Handoff** is on by default. With handoff on, two large models never fight for memory; with it off, Osaurus refuses the delegation cleanly instead of erroring mid-run.

`spawn_batch` groups work by resolved model:

- Jobs using the **same local model** reuse one loaded model and can run concurrently through continuous batching.
- Jobs using **different local models** run as serial waves, so cold loads and residency handoffs never race.
- **Remote jobs** start independently and can overlap every local wave.
- Before each local wave, RAM admission considers the model footprint, per-child working memory, current engine occupancy, and continuous-batching capacity. A wave may be narrowed, split into subwaves, or refused before unloading a model.

Results still preserve the original job order, regardless of completion order.

### One concurrency setting

**Max subagents per batch** and **Server → Concurrent Sessions** are the same canonical setting (1–32). Changing either updates the other. It is a ceiling for accepted batch size and local fan-out; RAM admission, engine occupancy, continuous batching, and local-model grouping can reduce the concurrency of a particular wave.

## Per-agent configuration

Everything is scoped to the agent, in its **Subagents** tab:

- **Spawn & Delegation** — enable, plus separate allow-lists of spawnable agents and bare local or remote models
- **Permission** — Ask, Always Allow, or Deny; Ask produces one prompt for an entire `spawn_batch`
- **Child tools** — choose None or Read Only. A saved-agent child can receive the cancellation-audited subset of its enabled tools; a bare-model child has no target-agent tools. Read Only can additionally grant bounded `file_read` / `file_search` access.
- **Budgets** — delegate tokens, turns, tool calls, elapsed time, and the shared batch/concurrency limit
- **Image** — enable the `image` tool and pick the agent's image model
- **Video** — enable metered cloud video generation; spend consent is requested before a quoted job starts
- **Computer Use** — enable, autonomy ceiling, screen context ([details](/computer-use))
- **Browser Use** — enable, plus an optional model override ([details](/browser-use))
- **AppleScript** — enable the AppleScript subagent and pick its model

Spawn remains unavailable until its allow-list is configured. The Orchestrator's pool is seeded from your custom agents; the other delegation capabilities ship disabled until you enable them.

---

**Related:**

- [Agents](/agents) — creating and configuring agents
- [Image & Video Generation](/image-generation) — the `image` and `video` tools
- [Computer Use](/computer-use) — the `computer_use` subagent
- [Browser Use](/browser-use) — the `browser_use` subagent
- [Models](/models) — local and remote models a subagent can target
