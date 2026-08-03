---
title: Tasks
sidebar_label: Tasks
description: What happens when you ask Osaurus to do something — a live to-do list, real tool calls, artifact cards — plus trusted-folder and Sandbox modes.
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

## Power-ups: trusted folder or Sandbox

By default, the agent has a strong general tool kit selected automatically based on your message — web search, fetch, your installed plugins. Two choices on the chat input bar give it more:

| Power-up | What it adds | When to use |
|---|---|---|
| **Trusted folder** | Scoped file/search/git tools for one folder | Editing code in a real repo, reorganizing a directory, summarizing a project |
| **Sandbox** | Shell access in an isolated environment — a Linux VM on macOS 26+, a Seatbelt-confined host runner on macOS 15 | Running scripts, installing packages, scraping URLs, building/testing |

These modes are **mutually exclusive**. Selecting a folder uses trusted-folder mode and disables Sandbox for that agent. Enabling Sandbox is also agent-scoped: it clears folder selections from visible chats using that agent, so host paths and folder tools disappear. Turn Sandbox off and reselect a folder when you want trusted-folder access again.

### Pick a trusted folder

Click the folder icon next to the input bar and pick a folder. The agent loads the folder's tree, manifest, and git status, and gets file tools scoped to just that folder. If Sandbox was active, folder selection switches the chat back to trusted-folder mode.

| Tool | What it does |
|---|---|
| `file_read` | Read a file (line ranges supported) — or point it at a directory to get a listing (skipping the obvious noise like `node_modules`) |
| `file_write` | Create or overwrite a file. Pass `dry_run: true` to preview the diff without writing. |
| `file_edit` | Make a precise edit to part of a file (also supports `dry_run` previews) |
| `file_search` | Fast text search across the folder, or find files by name glob |
| `file_operation_history` / `file_undo` | Review the session's file writes and edits, and revert individual operations |
| `shell_run` | Run a shell command — for builds, installs, `mv`/`cp`/`rm`/`mkdir` (asks before running) |
| `git_status` / `git_diff` / `git_commit` | When the folder is a git repo. `git_commit` asks before running. |

The folder choice is **per chat** and survives relaunch via macOS's security-scoped bookmarks — two windows can work against two different repos at once. The project's language (Swift, Node, Python, Rust, Go) is auto-detected from manifests; project-level guidance files (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`) are loaded automatically. Paths the agent uses must stay strictly under the folder — anything outside is rejected before execution.

Every applied write and edit is logged, and simple `shell_run` mutations (`mv`/`cp`/`rm`/`mkdir`) join the same log — so you (or the agent, via `file_undo`) can review and revert individual operations. Commands the log can't capture faithfully are flagged as not covered by undo rather than half-logged.

### Toggle the Sandbox

Toggle Sandbox on the input bar to give the agent shell access in an isolated environment. On **macOS 26+** that's a Linux VM (Apple Containerization framework, Alpine Linux) with each agent as its own Linux user; on **macOS 15** it falls back to a Seatbelt-confined host runner that can only write inside the sandbox workspace. [Sandbox Internals →](/sandbox)

What's available inside (Linux VM):

- Full POSIX userland: shell, coreutils, find, grep, sed, awk, tar
- Python (`pip`), Node.js (`npm`), system packages (`apk`)
- Compilers and build tools as needed
- Per-agent home at `/workspace/agents/{name}/` (mounted from your Mac)

Read-only sandbox tools are always available. Write, exec, install, and secret tools require `autonomous_exec` enabled on the agent.

Sandbox mode never exposes or mounts a host folder. Turn Sandbox off and choose the folder again to return to trusted-folder mode.

## Sharing artifacts

When the agent generates a file — image, chart, website, report, code — it surfaces in the chat as an **artifact card**. Files written to disk or the sandbox don't appear in the chat on their own; the card is how results reach the thread.

Artifacts are persisted under `~/.osaurus/artifacts/{session}/` and rendered inline.

## Where each mode shines

| You want to… | Mode |
|---|---|
| Ask a question, summarize, brainstorm | Plain (no folder, no Sandbox) |
| Edit code in a real repo | Trusted folder |
| Run a script, scrape a URL, install a package, build/test | Sandbox |

## Best practices

- **Be specific.** "Add a logout button to the navbar" beats "update the UI".
- **Pick the right power-up.** Trusted folder for code in a real repo. Sandbox for "run this", "scrape that", "install this". Switch between them when a task needs the other environment.
- **Trust the live checklist.** Watch it as the agent works — you'll catch anything heading the wrong direction early.
- **Trust the "Completed" summary.** If the task is partial, the agent will say so honestly — vague summaries like "done" or "looks good" are rejected.

---

Plugins, schedules, watchers, and the HTTP API all dispatch the same task experience. See [Plugin Authoring](/plugin-authoring), [Schedules](/schedules), [Watchers](/watchers), and [HTTP API](/api).

**Related:**

- [Sandbox Internals](/sandbox) — VM, plugin recipes, and security
- [Tools & Plugins](/tools) — what tools exist and how they're built
- [Tool Contract](/tool-contract) — the success/failure envelope every tool returns; full loop-tool schemas
- [Agents](/agents) — `autonomous_exec` flag and per-agent settings
