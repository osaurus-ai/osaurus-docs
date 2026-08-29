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

## Workspaces: trusted folder or Sandbox

By default, a custom agent has general capabilities plus sandboxed execution. The folder picker can instead grant one real Mac folder:

| Power-up | What it adds | When to use |
|---|---|---|
| **Trusted folder** | Scoped file/search/git tools for one folder | Editing code in a real repo, reorganizing a directory, summarizing a project |
| **Sandbox** | Shell access in an isolated environment — a Linux VM on macOS 26+, a Seatbelt-confined host runner on macOS 15 | Running scripts, installing packages, scraping URLs, building/testing |

These modes are **mutually exclusive**. Selecting a folder disables Sandbox for that agent before granting the host path; if the sandbox cannot be disabled safely, Osaurus clears the selection. Re-enable sandboxed execution later from **Agents → Abilities → Overview** or **Abilities → Sandbox**.

### Pick a trusted folder

Click the folder icon next to the input bar and pick a folder. The agent loads the folder's tree, manifest, and git status, disables its Sandbox setting, and gets file tools scoped to just that folder.

| Tool | What it does |
|---|---|
| `file_read` | Read a file (line ranges and an explicit `max_chars` cap supported) — or point it at a directory to get a listing (skipping obvious noise like `node_modules`) |
| `file_write` | Create or overwrite a file. Pass `dry_run: true` to preview the diff without writing. |
| `file_edit` | Make a precise edit, replace every match with `replace_all`, or apply an atomic `edits` array. Also supports `dry_run` previews. |
| `file_search` | Fast text search across the folder, or find files by name glob |
| `detect_pii` | Scan text files for personal information without changing them |
| `redact_file` | Replace detected values deterministically in one undoable pass |
| `file_operation_history` / `file_undo` | Review the session's file writes and edits, and revert individual operations |
| `shell_run` | Run a shell command — for builds, installs, `mv`/`cp`/`rm`/`mkdir` (asks before running) |
| `git_status` / `git_diff` / `git_commit` | When the folder is a git repo. `git_commit` asks before running. |

The folder choice is **per chat** and survives relaunch via macOS's security-scoped bookmarks — two windows can work against two different repos at once. The project's language (Swift, Node, Python, Rust, Go) is auto-detected from manifests; project-level guidance files (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`) are loaded automatically. Paths the agent uses must stay strictly under the folder — anything outside is rejected before execution.

Files under roughly 60,000 characters normally arrive in one read. Larger reads return a bounded continuation with guidance to use search, bulk edit, or redaction tools instead of paging an entire file through the model; automatic continuation is capped so a malformed task cannot loop forever.

Every applied write and edit is logged, and simple `shell_run` mutations (`mv`/`cp`/`rm`/`mkdir`) join the same log — so you (or the agent, via `file_undo`) can review and revert individual operations. Commands the log can't capture faithfully are flagged as not covered by undo rather than half-logged.

### Bulk edits and on-device redaction

For large or repetitive changes, the folder tools process the file directly instead of asking the model to re-emit its full contents:

- `file_edit` can replace all occurrences or validate and apply several edits atomically. If any requested edit fails, nothing is written and the operation creates no partial state.
- `detect_pii` returns detected spans grouped by category with line numbers.
- `redact_file` applies `[REDACTED X]` placeholders in one pass and records one `file_undo` entry.
- Both redaction tools accept per-call `custom_rules` for project-specific identifiers. These rules are ephemeral and do not alter the cloud-bound [Privacy Filter](/privacy-filter) configuration.

Detection uses the same local regex and Rampart engines as the Privacy Filter. If Rampart is not installed, an attended chat can offer the approximately 37 MB download and resume the call afterward. Declining, or running headlessly, falls back to regex-only detection with an explicit warning. Mutating redaction is denied on external surfaces, just like `file_edit`.

### Configure the Sandbox

New and legacy custom agents without an explicit opt-out start with Sandbox execution enabled where supported. Configure it under **Agents → Abilities → Overview** and **Abilities → Sandbox**. On **macOS 26+** it uses a Linux VM (Apple Containerization framework, Alpine Linux) with each agent as its own Linux user; on **macOS 15** it falls back to a Seatbelt-confined host runner that can only write inside the sandbox workspace. The built-in Orchestrator cannot use Sandbox directly. [Sandbox Internals →](/sandbox)

What's available inside (Linux VM):

- Full POSIX userland: shell, coreutils, find, grep, sed, awk, tar
- Python (`pip`), Node.js (`npm`), system packages (`apk`)
- Compilers and build tools as needed
- Per-agent home at `/workspace/agents/{name}/` (mounted from your Mac)

Read-only sandbox tools are always available. Write, exec, install, and secret tools require `autonomous_exec` enabled on the agent.

Sandbox mode never exposes or mounts a host folder. To work directly in a Mac folder, select it from chat; Osaurus disables Sandbox for that agent first.

## Sharing artifacts

When the agent generates a file — image, chart, website, report, code — it surfaces in the chat as an **artifact card**. Files written to disk or the sandbox don't appear in the chat on their own; the card is how results reach the thread.

Artifacts are persisted under `~/.osaurus/artifacts/{session}/` and rendered inline.

## Where each mode shines

| You want to… | Mode |
|---|---|
| Ask a question, summarize, brainstorm | Any mode; disable Sandbox in Abilities for a chat-only agent |
| Edit code in a real repo | Trusted folder |
| Run a script, scrape a URL, install a package, build/test | Sandbox |

## Best practices

- **Be specific.** "Add a logout button to the navbar" beats "update the UI".
- **Pick the right workspace.** Trusted folder for code in a real repo. Sandbox for isolated "run this", "scrape that", and "install this" work.
- **Trust the live checklist.** Watch it as the agent works — you'll catch anything heading the wrong direction early.
- **Trust the "Completed" summary.** If the task is partial, the agent will say so honestly — vague summaries like "done" or "looks good" are rejected.

---

Plugins, schedules, watchers, and the HTTP API all dispatch the same task experience. See [Plugin Authoring](/plugin-authoring), [Schedules](/schedules), [Watchers](/watchers), and [HTTP API](/api).

**Related:**

- [Sandbox Internals](/sandbox) — VM, plugin recipes, and security
- [Tools & Plugins](/tools) — what tools exist and how they're built
- [Tool Contract](/tool-contract) — the success/failure envelope every tool returns; full loop-tool schemas
- [Agents](/agents) — `autonomous_exec` flag and per-agent settings
