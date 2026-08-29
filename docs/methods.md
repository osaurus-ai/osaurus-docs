---
title: Methods
sidebar_label: Methods
description: Learned workflows agents save after successful runs — YAML tool-call sequences scored by success rate and loaded on demand alongside skills and tools.
---

# Methods

A **method** is a learned workflow. When an agent finishes a multi-step task, it can save the sequence of tool calls as a YAML body that future tasks reuse. Methods sit alongside [Skills](/skills) and [Tools](/tools) in the same capability index — the agent discovers and loads all three through the same mechanism.

This page is the developer reference: what's in a method, how scoring works, where they're stored, and how capability discovery around methods/tools/skills works.

## What's in a method

| Property | Description |
|---|---|
| `name` | Display name |
| `description` | Brief description (used by capability discovery) |
| `triggerText` | Optional phrases that activate this method ("deploy to staging", "publish post") |
| `body` | The YAML workflow — step-by-step tool calls with logic between them |
| `toolsUsed` / `skillsUsed` | Auto-extracted from `body` so loading the method auto-loads its dependencies |
| `tokenCount` | Estimated cost for context budgeting |
| `version` | Bumped on every edit |

Loading a method automatically loads its referenced tools and skills. So an agent that starts with research skills can pull in a "deploy to staging" method (and the tools that method uses) without you doing anything.

## Scoring

Methods are scored using a recency-weighted success rate:

```
score = successRate × recencyWeight
recencyWeight = 1.0 / (1.0 + daysSinceUsed / 30.0)
```

Each time a method is used, the system records a `MethodEvent` (`loaded`, `succeeded`, `failed`) and recalculates the score. High-quality, recently-used methods rank higher in search results — so the workflows that actually work float to the top automatically.

## How capabilities are selected

Each agent has a tool mode (in the agent's **Capabilities** settings). In **Auto** mode (the default), the model starts each session with a small, fixed always-loaded hot set and expands it on demand from your enabled capabilities. In **Manual** mode, all enabled capabilities are sent to the model every turn.

## Mid-conversation discovery

In Auto mode, the agent expands its kit while a chat is in progress via two always-on tools:

| Tool | What it does |
|---|---|
| `capabilities_discover` | Search enabled methods, tools, and skills in one call; returns ranked IDs like `tool/shell_run` or `skill/plot-data` |
| `capabilities_load` | Load specific capabilities by ID into the active session |

Loading a method through `capabilities_load` automatically loads its referenced tools and skills.

## Storage

Methods live in `~/.osaurus/methods/methods.sqlite` (SQLCipher-encrypted if you've opted in to [storage encryption](/storage)).

## Browsing methods

There isn't a dedicated "Methods" tab in the app — methods live alongside skills in the same capability index. To inspect what's been learned:

- **Management → Insights** shows when methods were loaded and whether they succeeded or failed
- The methods database is browsable via SQLite tools if you really need to dig in

## Skills, Methods, Tools — the comparison

| | Skills | Methods | Tools |
|---|---|---|---|
| **Source** | You author them or import from a marketplace | Agents save them after successful runs | Built-in plugins, native plugins, MCP providers |
| **Content** | Markdown instructions + reference files | YAML sequences of tool calls | Code (Swift, Rust, Python via MCP) |
| **What they do** | Add domain knowledge / methodology | Replay a known-good workflow | Take action (read files, run commands, call APIs) |
| **Loaded by** | On-demand discovery (`capabilities_discover` / `capabilities_load`) | On-demand discovery | Hot set + on-demand discovery; loading a method auto-loads its tools |
| **Token cost** | The skill's instructions text | The method's YAML body | Just the tool's spec (description + parameters) |

---

**Related:**

- [Skills](/skills) — user-facing skills documentation
- [Tools & Plugins](/tools) — what tools exist and how they're built
- [Agents](/agents) — capabilities are scoped per agent
