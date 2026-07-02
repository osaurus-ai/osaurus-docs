---
title: Tasks
sidebar_label: Tasks
description: What happens when you ask Osaurus to do something — a live to-do list, real tool calls, artifact cards — plus the working folder and Sandbox power-ups.
sidebar_position: 5
---

# Tasks

This is what makes Osaurus more than a chat box. Ask the AI to *do* something — not just explain it — and it doesn't reply with a long paragraph and stop. It writes a plan, calls the tools it needs, surfaces the results, and finishes with a verified summary.

## What it looks like

When you give the agent a real task, here's what you'll see:

- **A live to-do list** appears in the chat and ticks off as it works
- **Tool calls** show up inline — the agent reads files, searches the web, runs a command, calls one of your plugins
- **Generated files** (images, charts, reports, code) appear as **artifact cards** you can click, copy, or save
- **A "Completed" summary** at the end with what was done and how it was verified
- **The agent only pauses to ask** when a question genuinely changes the outcome — otherwise it runs straight through

Every chat has this built in. The same chat window handles a quick question or a multi-step task — no modes to switch.

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

Three special tools drive that experience: a "todo" tool publishes the live checklist, a "clarify" tool pauses to ask one critical question, and a "complete" tool ends the run with a verified summary. None of this needs configuration. (For the formal schemas, see [Tool Contract → Loop tools](/tool-contract#loop-tools).)

## Power-ups: working folder and Sandbox

By default, the agent has a strong general tool kit selected automatically based on your message — web search, fetch, your installed plugins. Two toggles on the chat input bar give it more:

| Power-up | What it adds | When to use |
|---|---|---|
| **Working folder** | Scoped file/search/git tools for one folder | Editing code in a real repo, reorganizing a directory, summarizing a project |
| **Sandbox** *(macOS 26+)* | Shell access in an isolated Linux VM | Running scripts, installing packages, scraping URLs, building/testing |

Pick **one or the other** — they're mutually exclusive per chat.

### Pick a working folder

Click the folder icon next to the input bar and pick a folder. The agent loads the folder's tree, manifest, and git status, and gets file tools scoped to just that folder:

| Tool | What it does |
|---|---|
| `file_tree` | Show the folder structure (skipping the obvious noise like `node_modules`) |
| `file_read` | Read a file (line ranges supported) |
| `file_write` | Create or overwrite a file |
| `file_edit` | Make a precise edit to part of a file |
| `file_search` | Fast text search across the folder |
| `shell_run` | Run a shell command — for builds, installs, `mv`/`cp`/`rm`/`mkdir` (asks before running) |
| `git_status` / `git_diff` / `git_commit` | When the folder is a git repo. `git_commit` asks before running. |

Osaurus remembers your folder choice across launches via macOS's security-scoped bookmarks. The project's language (Swift, Node, Python, Rust, Go) is auto-detected from manifests; project-level guidance files (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`) are loaded automatically. Paths the agent uses must stay strictly under the folder — anything outside is rejected before execution.

Every write/exec/git-mutating call is logged so you can review or undo individual operations.

### Toggle the Sandbox (macOS 26+)

Toggle Sandbox on the input bar to give the agent shell access in an isolated Linux VM (Apple Containerization framework, Alpine Linux). Each agent gets its own Linux user with its own home directory.

What's available inside:

- Full POSIX userland: shell, coreutils, find, grep, sed, awk, tar
- Python (`pip`), Node.js (`npm`), system packages (`apk`)
- Compilers and build tools as needed
- Per-agent home at `/workspace/agents/{name}/` (mounted from your Mac)

Read-only sandbox tools are always available. Write, exec, install, and secret tools require `autonomous_exec` enabled on the agent. [Sandbox Internals →](/sandbox)

## Sharing artifacts

When the agent generates a file — image, chart, website, report, code — it surfaces in the chat as an **artifact card**. Files written to disk or the sandbox don't appear in the chat on their own; the card is how results reach the thread.

Artifacts are persisted under `~/.osaurus/artifacts/{session}/` and rendered inline.

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
- **Trust the live checklist.** Watch it as the agent works — you'll catch anything heading the wrong direction early.
- **Trust the "Completed" summary.** If the task is partial, the agent will say so honestly — vague summaries like "done" or "looks good" are rejected.

---

Plugins, schedules, watchers, and the HTTP API all dispatch the same task experience. See [Plugin Authoring](/plugin-authoring), [Schedules](/schedules), [Watchers](/watchers), and [HTTP API](/api).

**Related:**

- [Sandbox Internals](/sandbox) — VM, plugin recipes, host bridge, security
- [Tools & Plugins](/tools) — what tools exist and how they're built
- [Tool Contract](/tool-contract) — the success/failure envelope every tool returns; full loop-tool schemas
- [Agents](/agents) — `autonomous_exec` flag and per-agent settings
