---
title: Working Folders & Sandbox
sidebar_label: Working Folders & Sandbox
description: Every chat is an agent loop. Point it at a folder for safe file tools, toggle the Sandbox for a Linux VM with shell access.
sidebar_position: 9
---

# Working Folders & Sandbox

Every chat in Osaurus is an **agent loop** — the agent picks a model, writes a markdown todo list, calls tools, and finishes with a verified summary or pauses to ask one critical question.

There's no separate "Work Mode" or "Agent" tab any more. The same chat window handles a one-line question and a multi-step refactor. What changes is the **tool kit**:

- **Pick a working folder** → the agent gets safe file, search, and git tools scoped to that folder
- **Toggle the Sandbox** *(macOS 26+)* → the agent gets shell access in an isolated Linux VM
- **Neither** → plain Q&A with whatever skills, methods, and tools the RAG search picks

The two modes are **mutually exclusive**: turning on the Sandbox clears the folder, picking a folder disables sandbox autonomous exec.

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

The agent uses three special "loop tools" to drive the chat UI: `todo` (publishes the plan), `complete` (ends the loop with a verified summary), and `clarify` (pauses and asks a critical question with optional one-tap options). They're available in every chat — folder, sandbox, or plain.

## Working folders

Selecting a folder gives the agent file/search/git tools scoped to just that folder. macOS issues a security-scoped bookmark, so the choice persists across launches.

### Picking a folder

1. Click the folder icon next to the input bar
2. Pick a folder
3. The agent loads the folder's tree, manifest, and git status into context
4. New tools become available: `file_tree`, `file_read`, `file_write`, `file_edit`, `file_search`

If the folder is a recognized project, you also get `shell_run` (for things like `npm install` or `mv`/`cp`/`rm`/`mkdir`). If it's a git repo, you also get `git_status`, `git_diff`, and `git_commit`.

### What's auto-detected

| Project | Detected manifests | Default ignores |
|---|---|---|
| Swift | `Package.swift` | `.build`, `DerivedData`, `Pods`, `.swiftpm`, `*.xcodeproj`, `*.xcworkspace` |
| Node | `package.json` | `node_modules`, `dist`, `.next`, `build`, `.cache` |
| Python | `pyproject.toml`, `setup.py`, `requirements.txt` | `__pycache__`, `.venv`, `venv`, `*.pyc`, `.pytest_cache`, `.mypy_cache` |
| Rust | `Cargo.toml` | `target` |
| Go | `go.mod` | `vendor` |
| Unknown | — | — |

`.git` is always ignored. Project-level guidance (`.hermes.md`, `HERMES.md`, `AGENTS.md`, `CLAUDE.md`, `.cursorrules`) is loaded automatically (first found wins, capped at 20 KB).

### Folder tools

| Tool | What it does |
|---|---|
| `file_tree` | List directory structure with project-aware ignore patterns |
| `file_read` | Read a file (supports line ranges and tail mode) |
| `file_write` | Create or overwrite a file |
| `file_edit` | Surgical exact-string replacement |
| `file_search` | ripgrep-style search across the folder |
| `shell_run` | Run a shell command (requires approval) — for builds, installs, `mv`/`cp`/`rm`/`mkdir` |
| `git_status` / `git_diff` / `git_commit` | If the folder is a git repo. `git_commit` requires approval. |

Every write/exec/git-mutating call is logged so you can review or undo individual operations.

### Path safety

Paths must be relative to the working folder. After `..`/`.` standardization they must stay strictly under the folder. Anything outside is rejected by the path sanitizer with a structured error the model can self-correct on.

## The Sandbox toggle (macOS 26+)

The Sandbox is a shared Linux VM (Alpine, Apple Containerization framework) where each agent gets its own Linux user and home directory. Toggle it on the input bar to give the active agent shell access.

### What's in the VM

- Full POSIX userland: shell, coreutils, find, grep, sed, awk, tar, …
- Python (`pip`), Node.js (`npm`), system packages (`apk`)
- Compilers and build tools as needed
- Per-agent home at `/workspace/agents/{name}/` (mounted from your Mac via VirtioFS)

### Sandbox tools

| Category | Tools | Notes |
|---|---|---|
| Read-only (always) | `sandbox_read_file`, `sandbox_search_files` | `target="content"` (rg) or `target="files"` (glob) |
| Write (autonomous_exec) | `sandbox_write_file`, `sandbox_edit_file` | Exact-string `old_string` → `new_string` for `edit` |
| Exec (autonomous_exec) | `sandbox_exec`, `sandbox_process`, `sandbox_execute_code` | `background:true` on `sandbox_exec` for servers/long jobs; manage via `sandbox_process` (poll/wait/kill) |
| Package install | `sandbox_install`, `sandbox_pip_install`, `sandbox_npm_install` | apk / pip / npm with auto-recovery |
| Secrets | `sandbox_secret_check`, `sandbox_secret_set` | Stored in macOS Keychain; user prompted for missing values |
| Plugins | `sandbox_plugin_register` | Requires `pluginCreate` permission |

The agent's [`autonomous_exec` flag](/agents) controls whether write/exec/install/secret tools are available. Read-only tools are always on.

### Anti-confusion cheat sheet

Inside the sandbox, prefer the dedicated tool over a shell command:

| Don't | Do |
|---|---|
| `cat`/`head`/`tail` in `sandbox_exec` | `sandbox_read_file` |
| `grep`/`rg`/`find`/`ls` in `sandbox_exec` | `sandbox_search_files` |
| `sed`/`awk` | `sandbox_edit_file` |
| `echo`/heredoc to write files | `sandbox_write_file` |
| `&` / `nohup` / `disown` | `sandbox_exec(background:true)` + `sandbox_process` |

Reserve `sandbox_exec` for builds, installs, processes, network calls, and any work without a dedicated tool. For three or more tool calls with logic between them, `sandbox_execute_code` runs a Python script that imports the same tools as helpers.

### Configuration

**Management → Sandbox → Container → Resources:**

| Setting | Range | Default |
|---|---|---|
| CPUs | 1–8 | 2 |
| Memory | 1–8 GB | 2 GB |
| Network | outbound / none | outbound |
| Auto-Start | on / off | on |

Changes require a container restart. Config file: `~/.osaurus/config/sandbox.json`.

[Sandbox Internals →](/sandbox)

## The three loop tools

Every chat (folder, sandbox, plain) has these three tools available. The chat UI intercepts their results to drive the inline experience.

### `todo` — publish or update the plan

Required field: `markdown` (a Markdown checklist where items begin with `- [ ]` or `- [x]` / `- [X]`).

Each call **replaces the entire list** — no merging. The agent uses this for tasks with more than two obvious steps; it skips it for trivial work.

### `complete` — end the loop

Required field: `summary` (≥ ~30 chars of meaningful prose; placeholders like `done`, `ok`, `looks good` are rejected).

The summary becomes a "Completed" banner in the chat. If the task is genuinely partial, the agent should say so honestly in the summary instead of pretending it finished.

### `clarify` — pause and ask one critical question

Required field: `question`. Optional `options[]` (up to 6 short choices, each ≤80 chars) and `allowMultiple`.

When `clarify` fires, the chat pauses with a bottom-pinned overlay. If `options` is set, the user gets one-tap chips. Otherwise it's a free-form text input. The user's answer dispatches as the next user turn.

`clarify` is reserved for genuinely blocking ambiguity. For minor preferences, the agent picks a sensible default and continues.

## Sharing artifacts

If the agent generates a file, image, chart, website, or report, it must call `share_artifact` to surface it as an artifact card in the chat. The user does not see arbitrary files written to disk or to the sandbox — `share_artifact` is the only way for them to reach the chat thread.

| Field | Description |
|---|---|
| `path` | Path to an existing file/dir (the file must exist before this call) |
| `content` | Inline text/markdown to share without writing a file first |
| `filename` | Required when `content` is set; defaults to the basename of `path` otherwise |
| `description` | Brief human-readable description |

Artifacts are persisted under `~/.osaurus/artifacts/{session}/` and rendered inline in the chat thread.

## Where each mode shines

| You want to… | Mode |
|---|---|
| Ask a question, summarize, brainstorm | Plain (no folder, no sandbox) |
| Edit code in a real repo | Working folder |
| Run a script, scrape a URL, install a package, build/test | Sandbox |
| Refactor across many files, then run tests | Working folder + ask the agent to delegate execution to your local tooling |

## Headless / HTTP / plugin use

Plugins and HTTP API callers reach the same loop through the agent dispatcher. Each dispatched task runs as a background chat session — same engine, same loop tools, same intercepts. Sessions are tagged with their source (`chat`, `plugin`, `http`, `schedule`, `watcher`) so you can audit what spawned each conversation in the chat sidebar.

The OpenAI-compatible HTTP endpoint (`/v1/chat/completions`) is intentionally **stateless** — it returns `tool_calls` to the client and lets the client execute them, so Osaurus drops cleanly behind harnesses that already manage their own tool loop. For server-side autonomous loops, use `POST /agents/{id}/run`. [API reference →](/api)

## Best practices

- **Be specific.** "Add a logout button to the navbar" beats "update the UI".
- **Pick the right backend.** Working folder for code in a real repo. Sandbox for "run this", "scrape that", "install this". Neither for plain Q&A.
- **Let the model use `todo`.** It costs almost nothing and gives you a live progress view.
- **Trust `complete`.** If the task is partial, the agent should say so honestly — the validator rejects "done" / "looks good".

---

**Related:**

- [Sandbox Internals](/sandbox) — VM, plugin recipes, host bridge, security
- [Tools & Plugins](/tools) — what tools exist and how they're built
- [Tool Contract](/tool-contract) — the success/failure envelope every tool returns
- [Agents](/agents) — `autonomous_exec` flag and per-agent settings
