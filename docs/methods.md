---
title: Methods
sidebar_label: Methods
description: Learned workflows agents save after successful runs — YAML tool-call sequences scored by success rate and loaded by the same RAG search as skills and tools.
---

# Methods

A **method** is a learned workflow. When an agent finishes a multi-step task, it can save the sequence of tool calls as a YAML body that future tasks reuse. Methods sit alongside [Skills](/skills) and [Tools](/tools) in the same RAG index — the preflight search picks all three together.

This page is the developer reference: what's in a method, how scoring works, where they're stored, and how the auto-selection mechanics around methods/tools/skills are tuned.

## What's in a method

| Property | Description |
|---|---|
| `name` | Display name |
| `description` | Brief description (used by RAG search) |
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

## Auto-selection mechanics (preflight search)

Before every chat message, a **preflight RAG search** runs across all enabled skills, methods, and tools. It uses hybrid BM25 + vector matching to find items relevant to the user's query, then injects matching skill instructions and method bodies into the system prompt.

The search runs through the configured **Core Model** (Settings → General → Core Model), and falls back to the active chat model when Core Model is unset. A small fast Core Model (`foundation` on macOS 26+, or `gemma-4-e2b-it-4bit`) keeps preflight cheap.

Search width controls how aggressively it pulls candidates per index:

| Mode | Methods | Tools | Skills | Best for |
|---|---|---|---|---|
| `off` | 0 | 0 | 0 | Disabling auto-selection entirely |
| `narrow` | 1 | 2 | 1 | Fastest responses, minimal context |
| `balanced` (default) | 3 | 5 | 2 | Most cases — good coverage at moderate cost |
| `wide` | 5 | 8 | 4 | Maximum coverage, larger prompts |

Set the mode in **Management → Settings → Capabilities**.

## Mid-conversation discovery

The agent can also expand its kit while a chat is in progress via two always-on tools:

| Tool | What it does |
|---|---|
| `capabilities_search` | Search methods, tools, and skills across all indexes in parallel |
| `capabilities_load` | Load a specific capability by ID into the active session |

Loading a method through `capabilities_load` automatically loads its referenced tools and skills.

## Storage

Methods live in `~/.osaurus/methods/methods.sqlite` (SQLCipher-encrypted if you've opted in to [storage encryption](/storage)).

## Browsing methods

There isn't a dedicated "Methods" tab in the app — methods live alongside skills in the same RAG index. To inspect what's been learned:

- **Management → Insights** shows when methods were loaded and whether they succeeded or failed
- The methods database is browsable via SQLite tools if you really need to dig in

## Skills, Methods, Tools — the comparison

| | Skills | Methods | Tools |
|---|---|---|---|
| **Source** | You author them or import from a marketplace | Agents save them after successful runs | Built-in plugins, native plugins, MCP providers |
| **Content** | Markdown instructions + reference files | YAML sequences of tool calls | Code (Swift, Rust, Python via MCP) |
| **What they do** | Add domain knowledge / methodology | Replay a known-good workflow | Take action (read files, run commands, call APIs) |
| **Loaded by** | RAG search (preflight + on-demand) | RAG search (preflight + on-demand) | RAG search; loading a method auto-loads its tools |
| **Token cost** | The skill's instructions text | The method's YAML body | Just the tool's spec (description + parameters) |

---

**Related:**

- [Skills](/skills) — user-facing skills documentation
- [Tools & Plugins](/tools) — what tools exist and how they're built
- [Agents](/agents) — capabilities are scoped per agent
