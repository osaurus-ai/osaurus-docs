---
title: Agent Loop
sidebar_label: Agent Loop
description: How chats actually get work done — todos, tool calls, file outputs, runs in the background. Plus working folders and the Sandbox toggle that unlock more capability.
sidebar_position: 5
---

# Agent Loop

This is the part that makes Osaurus more than a chat box. When you ask the AI to *do* something — not just explain something — it doesn't reply with a long paragraph and stop. It writes a plan, calls the tools it needs, runs them, surfaces the results, and finishes with a verified summary.

## Get things done

Here's what the agent does for you in a typical task:

- **Writes a markdown todo list** you can watch tick off as it works
- **Calls tools** to do the actual work — file ops, search, git, shell, web fetch, your custom plugins
- **Surfaces generated files** as artifact cards in the chat (images, charts, reports, code)
- **Pauses to ask** only when a question genuinely changes the outcome
- **Runs in the background** when you delegate the work via Schedules, Watchers, or plugins

Every chat in Osaurus is an agent loop. You describe what you want, the agent figures out the steps, calls the tools it needs, and shows you the result. The same chat window handles a quick question or a multi-step task — no modes to switch.

## The loop in one glance

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────────┐
│  user input  │ ──▶ │ agent thinks │ ──▶ │ tool calls + replies │
└──────────────┘     └──────────────┘     └──────────────────────┘
                            ▲                       │
                            │                       │
                            └───── todo / clarify ──┘
                                          │
                                   complete(summary)
                                          │
                                          ▼
                                     loop ends
```

The agent uses three special "loop tools" to drive the inline UI: **`todo`** publishes the plan, **`complete`** ends the loop with a verified summary, and **`clarify`** pauses to ask one critical question. They're available in every chat.

## Power-ups: working folder and Sandbox

By default, the agent has a strong general tool kit selected automatically based on your message — web search, fetch, your installed plugins. Two toggles on the chat input bar give it more:

| Power-up | What it adds | When to use |
|---|---|---|
| **Working folder** | Scoped file/search/git tools for one folder | Editing code in a real repo, reorganizing a directory, summarizing a project |
| **Sandbox** *(macOS 26+)* | Shell access in an isolated Linux VM | Running scripts, installing packages, scraping URLs, building/testing |

Pick **one or the other** — they're mutually exclusive per chat.

### Pick a working folder

Click the folder icon next to the input bar and pick a folder. The agent loads the folder's tree, manifest, and git status, and gets these tools scoped to just that folder:

| Tool | What it does |
|---|---|
| `file_tree` | List directory structure with project-aware ignore patterns |
| `file_read` | Read a file (supports line ranges and tail mode) |
| `file_write` | Create or overwrite a file |
| `file_edit` | Surgical exact-string replacement |
| `file_search` | ripgrep-style search across the folder |
| `shell_run` | Run a shell command (requires approval) — for builds, installs, `mv`/`cp`/`rm`/`mkdir` |
| `git_status` / `git_diff` / `git_commit` | When the folder is a git repo. `git_commit` requires approval. |

macOS issues a security-scoped bookmark so the choice persists across launches. Project type (Swift, Node, Python, Rust, Go) is auto-detected from manifests; project-level guidance files (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`) are loaded automatically. Paths the agent uses must stay strictly under the folder — anything outside is rejected before execution.

Every write/exec/git-mutating call is logged so you can review or undo individual operations.

### Toggle the Sandbox (macOS 26+)

Toggle Sandbox on the input bar to give the agent shell access in an isolated Linux VM (Alpine, Apple Containerization framework). Each agent gets its own Linux user with its own home directory.

What's available inside:

- Full POSIX userland: shell, coreutils, find, grep, sed, awk, tar
- Python (`pip`), Node.js (`npm`), system packages (`apk`)
- Compilers and build tools as needed
- Per-agent home at `/workspace/agents/{name}/` (mounted from your Mac via VirtioFS)

Read-only sandbox tools are always available. Write, exec, install, and secret tools require `autonomous_exec` enabled on the agent. [Sandbox Internals →](/sandbox)

## The three loop tools (briefly)

These are the tools the agent uses to drive the chat UI. The chat layer intercepts their results and renders the inline experience.

- **`todo`** — publishes or updates the plan as a markdown checklist. The list lives in the chat and ticks off as the agent works. Each call replaces the whole list.
- **`complete`** — ends the loop with a summary of what was done and how it was verified. Becomes a "Completed" banner in the chat. Placeholder summaries (`done`, `ok`, `looks good`) are rejected so the agent can't fake completion.
- **`clarify`** — pauses the loop and asks one critical question. Optional one-tap answer chips (`options[]`) make the answer a single click. Used only for questions that genuinely change the outcome.

For the full schemas and validator behavior, see the [Tool Contract](/tool-contract).

## Sharing artifacts

If the agent generates a file — image, chart, website, report, code — it surfaces it in the chat as an **artifact card** via `share_artifact`. The user does not see arbitrary files written to disk or to the sandbox; this card is how the result reaches the chat thread.

Artifacts are persisted under `~/.osaurus/artifacts/{session}/` and rendered inline. See [Tool Contract → share_artifact](/tool-contract) for the spec.

## Where each mode shines

| You want to… | Mode |
|---|---|
| Ask a question, summarize, brainstorm | Plain (no folder, no sandbox) |
| Edit code in a real repo | Working folder |
| Run a script, scrape a URL, install a package, build/test | Sandbox |
| Refactor across many files, then run tests | Working folder + delegate execution to your local tooling |

## Best practices

- **Be specific.** "Add a logout button to the navbar" beats "update the UI".
- **Pick the right power-up.** Working folder for code in a real repo. Sandbox for "run this", "scrape that", "install this". Neither for plain Q&A.
- **Let the model use `todo`.** It costs almost nothing and gives you a live progress view.
- **Trust `complete`.** If the task is partial, the agent should say so honestly — the validator rejects "done" / "looks good".

---

Plugins, schedules, watchers, and the HTTP API all dispatch the same loop. See [Plugin Authoring](/plugin-authoring), [Schedules](/schedules), [Watchers](/watchers), and [HTTP API](/api).

**Related:**

- [Sandbox Internals](/sandbox) — VM, plugin recipes, host bridge, security
- [Tools & Plugins](/tools) — what tools exist and how they're built
- [Tool Contract](/tool-contract) — the success/failure envelope every tool returns
- [Agents](/agents) — `autonomous_exec` flag and per-agent settings
