---
title: Subagents
sidebar_label: Subagents
description: Delegate a bounded task to another model or a saved agent mid-conversation — spawn_agent and spawn_model, with automatic residency handoff on local models.
---

# Subagents

Subagents let a chat delegate a bounded task to another model — **local or remote** — or to one of your saved agents, and get a compact result back without cluttering the conversation. Offload research to a bigger cloud model, hand a coding question to a specialist agent, or generate an image, all mid-turn.

Delegation is **off by default**, approved on first use, and configured per agent.

## The two spawn tools

| Tool | What it does |
|---|---|
| `spawn_agent(input, agent)` | Delegate a task to one of your saved agents — it runs with that agent's prompts, tools, and context |
| `spawn_model(input, model)` | Delegate to a bare model (no persona) — useful for "ask a bigger/faster model" moments |

The subagent runs its own bounded job and returns a single compact result. Its inner steps render live in the chat row but never enter your conversation's transcript, so context stays lean.

Two more capabilities share the same machinery and the same per-agent settings surface:

- **`image`** — generate or edit a picture inline; see [Image Generation](/image-generation)
- **`computer_use`** — drive a macOS app; see [Computer Use](/computer-use)

## Getting started

1. Open **Agents → Configure → Subagents** on the agent you want to grant delegation (the main chat has its own Subagents tab too).
2. Enable **Spawn & Delegation** and pick the **spawnable pool** — which saved agents and models this agent may delegate to. The pool is searchable, and you can attach a note to each entry to tell the model when to use it.
3. Ask for something that benefits from delegation: *"Have the research agent summarize this paper, then continue."*
4. Approve the first use. You can set individual targets to always-allow in the same tab.

## Residency handoff

Delegation works in any direction — local to local, local to remote, remote to local, remote to remote. Only one case touches GPU memory: delegating from a local model to a **different** local model.

| Direction | Behavior |
|---|---|
| Local → same local model | Runs in place — no swap |
| Local → different local model (handoff on) | Unload the chat model, run the job, reload, continue |
| Local → different local model (handoff off) | Rejected up front — nothing is evicted |
| Local ↔ remote, remote ↔ remote | Runs in place |

The **Local Orchestrator Handoff** toggle (on by default) lives in **Settings → Subagents**, next to the RAM-safety preflight and the image load policy. With handoff on, two large models never fight for memory; with it off, Osaurus refuses the delegation cleanly instead of erroring mid-run.

## Per-agent configuration

Everything is scoped to the agent, in its **Subagents** tab:

- **Spawn & Delegation** — enable, plus the allow-list of spawnable agents and models
- **Image** — enable the `image` tool and pick the agent's image model
- **Computer Use** — enable, autonomy ceiling, screen context ([details](/computer-use))
- **AppleScript** — enable the AppleScript subagent and pick its model

Every capability ships disabled on every agent, so nothing can delegate until you say so.

---

**Related:**

- [Agents](/agents) — creating and configuring agents
- [Image Generation](/image-generation) — the `image` subagent
- [Computer Use](/computer-use) — the `computer_use` subagent
- [Models](/models) — local and remote models a subagent can target
