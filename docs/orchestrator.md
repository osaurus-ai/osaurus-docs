---
title: Orchestrator
sidebar_label: Orchestrator
description: The built-in chief-of-staff agent that configures Osaurus, creates specialists, delegates work, and returns their results to one conversation.
---

# Orchestrator

The **Osaurus Orchestrator** is the built-in agent and the main place to start work. Instead of making you switch agents manually, it can configure the app, create a specialist, delegate a bounded task, and return the specialist's result and artifacts to the same conversation.

## Configure it

Open **Settings → Orchestrator**. This page consolidates:

- **Identity** — the display name shown in chat and the agent picker
- **Persona** — your instructions for how the Orchestrator should behave
- **Generation defaults** — temperature and maximum output tokens
- **Delegation** — the custom agents and models it may spawn

The built-in definition remains protected, and the Orchestrator never gets Sandbox access. Your name, persona, and delegation choices are user configuration and can be changed or exported.

## How delegation works

Every custom-agent creation path registers the new agent in the Orchestrator's spawn pool:

- creating or duplicating an agent in the UI;
- applying a declarative configuration;
- importing an agent bundle; or
- restoring a backup.

Existing installs are seeded once. If you later remove an agent from the pool, Osaurus preserves that decision; it does not continually refill an intentionally empty pool.

When a task needs a specialist, the Orchestrator can:

1. inspect the available configuration and agents;
2. create or update a specialist with `osaurus_config`, subject to plan review and approval;
3. activate that specialist in the current chat turn;
4. call `spawn_agent` or `spawn_batch`; and
5. summarize the result and surface any child `share_artifact` files in the parent chat.

Delegated children cannot recursively spawn more agents. They run with their own model, prompt, allowed read-only child tools, budgets, and safety settings. See [Subagents](/subagents).

## Configuration tools

The Orchestrator uses three compact built-ins:

| Tool | Purpose |
|---|---|
| `osaurus_inspect` | Read current state and schema-backed configuration details |
| `osaurus_config` | Plan and apply a YAML/JSON desired-state change after review |
| `osaurus_help` | Read the product guide bundled with your installed version |

`osaurus_config` uses the same planner and applier as the CLI and loopback HTTP API. The approval card shows the calculated change before anything is written, and completion claims are checked against the real apply result.

The declarative `active_agent` field selects the agent for new chats. It does not redirect the current turn; current-turn specialist work uses `spawn_agent` or `spawn_batch`.

For repeatable setup across Macs, export the full desired state and keep it in source control without its secrets:

```bash
osaurus config export > osaurus-config.yaml
osaurus config plan osaurus-config.yaml
osaurus config apply osaurus-config.yaml
```

[Declarative configuration →](/configuration#declarative-configuration)

---

**Related:**

- [Agents](/agents) — create and configure specialists
- [Subagents](/subagents) — delegation pools, permissions, budgets, and model residency
- [Configuration](/configuration) — declarative YAML/JSON, CLI, and loopback API
- [Tasks](/agent-loop) — tools, folders, Sandbox, and artifacts
