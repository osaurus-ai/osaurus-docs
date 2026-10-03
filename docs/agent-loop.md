---
title: Tasks
sidebar_label: Tasks
description: What happens when you ask Osaurus to do something — a live to-do list, real actions, and files you can open — plus how to give an agent a folder on your Mac or a safe place to run code.
---

# Tasks

Osaurus can do things, not just talk about them. Ask an [agent](/glossary#agent) to *do* something and it makes a plan, takes the steps needed, shows you the results, and finishes with a summary of what it did. To work on your files, give it a [Working Folder](/glossary#working-folder); to run code safely, it uses the [Sandbox](/glossary#sandbox).

## Get started

1. Press **`⌘;`** to open a chat.
2. *(Optional)* To let the agent work on your files, click **Folder** in the message box and pick a folder.
3. Ask for something to be done, like *"Turn these meeting notes into a Word document"* or *"Find the three biggest files in this folder."*
4. Watch the to-do list as the agent works. If it needs to do something important, it shows an [approval](/glossary#approval) card; click **Allow** or **Deny**.
5. When it's done, read the summary and open any files it made from the cards in the chat.

There's nothing to switch on. Every chat handles both quick questions and longer tasks.

## What you'll see

- **A to-do list** appears in the chat and ticks off as the agent works.
- **Each action shows up in the chat** — reading a file, searching the web, running a command, or using one of your [plugins](/glossary#plugin). These actions are called [tools](/glossary#tool).
- **Files it makes** (pictures, charts, reports, code) appear as cards you can click, copy, or save. These are called [artifacts](/glossary#artifact).
- **A "Completed" summary** at the end says what was done and how it was checked.
- **It only stops to ask** when the answer really changes the result. Otherwise it keeps going.

If you click **Deny** on an approval card, or a safety rule blocks an action, the task stops there and the chat tells you why. The agent doesn't pretend the action happened.

If you change an agent's tools while a chat is open — turning on an Apple app or installing a plugin, say — the change applies from your **next message**. You don't need to start a new chat.

## Working Folder or Sandbox

An agent can work in one of two places:

| Place | What it gives the agent | Use it for |
|---|---|---|
| **Working Folder** | Access to one real folder on your Mac: reading, searching, creating, and editing files, plus version-history tools for code | Editing code, drafting and revising documents, tidying a folder, summarizing a project |
| **Sandbox** | A sealed-off area where it can run code and install software without touching the rest of your Mac | Running scripts, installing software, pulling data from websites, building and testing code |

New agents you create start with the Sandbox on, where your Mac supports it. You can use **one or the other, never both**. Picking a folder turns that agent's Sandbox off first. To turn it back on later, go to the agent's settings: **Settings… → Agents → (your agent) → Abilities → Overview**, or **Abilities → Sandbox**.

The [Orchestrator](/glossary#orchestrator) (the agent built into Osaurus) can have a Working Folder too, set with the same **Folder** button or in **Settings… → Orchestrator → Working Folder**. It can only **read** that folder. Agents it hands work to that have no folder of their own work inside it and can make changes.

### Pick a Working Folder

Click **Folder** in the message box and choose a folder. The agent gets a quick overview of what's inside, and from then on it can only touch files in that folder.

**The agent can ask for a folder itself.** If the chat has no folder and the task needs one (say, *"save this report as a Word document"*), the agent opens the same folder picker and tells you why it needs one. Pick a folder and the agent carries on. Cancel and the chat continues without a folder; the agent stops and won't ask again until you do.

**The agent remembers its folder.** Each chat keeps its own folder, even after you restart the app, so two windows can work in two different folders at once. A new chat with the same agent starts in the last folder you used with it. Inside a [project](/glossary#project) that has its own folder, the project's folder is used instead. You can always pick a different folder or clear it.

What the agent can do in the folder:

- Read text and code, and pull the content out of PDF, Word, PowerPoint, and Excel files.
- Create files, including Word, Excel, PDF, and PowerPoint documents.
- Edit files, including existing Word, Excel, PowerPoint, and PDF documents, keeping their formatting.
- Copy and search files.
- Find personal details in files and hide them (see [below](#bulk-edits-and-on-device-redaction)).
- Run commands, after asking you first.
- In a code repository, see what changed and save a new version, after asking you first.

It can't touch anything outside the folder.

### Review and undo file changes

Osaurus saves a copy of each file before and after the agent changes it — whether the agent edited it directly, ran a command, or worked in the Sandbox. So you can always go back.

1. Click the inspector button at the right end of the chat toolbar.
2. Choose **File Changes**.
3. Use **Timeline** to see every change in order, or **Files** to see the end result for each file.
4. Choose **Revert** (undo one change), **Revert File** (put one file back), **Roll Back to Before This** (undo a change and everything after it), or **Revert All**.

Under a reply that changed files, click **N files changed · View changes** to jump straight there. You can undo a revert, too. You can also ask the agent to undo something.

To choose how long these copies are kept, go to **Settings… → General → Advanced → Data & Storage → File History**. Deleting a chat always deletes its saved copies.

### Bulk edits and on-device redaction

For big or repetitive changes, the agent edits the file directly instead of rewriting it from scratch:

- **Change every match at once**, or make several edits together. If any one of them fails, nothing is changed.
- **Find personal details.** The agent can scan files for names, emails, phone numbers, and other [personal information](/glossary#pii), and tell you where they are.
- **Hide personal details.** It can replace them with placeholders like `[REDACTED EMAIL]` in one step, which you can undo.
- **Your own rules.** You can tell it to also hide project-specific things, like customer IDs. These rules apply only to that request and don't change your [Privacy Filter](/glossary#privacy-filter) settings.

This all happens on your Mac, using the same detection as the Privacy Filter. The first time, Osaurus may offer an extra download (about 37 MB) for better detection. If you decline, it uses simpler pattern matching and tells you so.

### Configure the Sandbox

The [Sandbox](/glossary#sandbox) is a sealed-off area where an agent can run programs, install software, and build code without touching the rest of your Mac. New agents you create have it turned on where supported.

To change it, open **Settings… → Agents**, pick the agent, and go to **Abilities → Overview** and **Abilities → Sandbox**. You can control whether it can install software, reach the internet, and more. See [Sandbox permissions](/agents#sandbox-permissions).

The Sandbox works on macOS 15 and later. On macOS 26 and later, it's a fully separate mini computer inside your Mac, with each agent in its own space; on macOS 15, it's a locked-down area on your Mac that can only write inside its own folder.

The Sandbox never gets access to your own folders. To work on files in a folder on your Mac, pick it with **Folder** in the chat instead; Osaurus turns the Sandbox off for that agent first. The Orchestrator never uses the Sandbox. [Sandbox →](/sandbox)

## Sharing artifacts

When the agent makes a file — a picture, chart, web page, report, or code — it shows up in the chat as a card. Click it to open, copy, or save it.

Files the agent saves into a folder or the Sandbox don't appear in the chat by themselves. The card is how the agent hands you a result.

## Where each mode shines

| You want to… | Use |
|---|---|
| Ask a question, summarize, brainstorm | Either one. For a chat-only agent, turn the Sandbox off in its Abilities. |
| Edit code in a real project, or write and revise Word, Excel, PowerPoint, or PDF files | Working Folder |
| Run a script, pull data from a website, install software, build or test code | Sandbox |

## Best practices

- **Be specific.** "Add a logout button to the navigation bar" beats "update the UI".
- **Pick the right place.** A Working Folder for code or documents in a real folder; the Sandbox for "run this", "fetch that", or "install this" work.
- **Watch the to-do list.** You'll spot anything going the wrong way early, and can click **Stop**.
- **Trust the summary.** If a task is only partly done, the agent says so. Vague summaries like "done" aren't accepted.

## Troubleshooting

- **The agent can't see my files.** Give the chat a Working Folder with **Folder** in the message box.
- **The agent can't run code.** It's using a Working Folder, which turns the Sandbox off. Clear the folder, then turn the Sandbox back on in the agent's **Abilities**.
- **The task stopped partway.** You (or a safety rule) declined an action. The chat says which one. Ask again if you want it to try a different way.
- **A new chat opened in an old folder.** The agent remembers the last folder you used with it. Pick a different one, or clear it, with **Folder**.

---

## Under the hood

### The loop

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

Three loop tools drive the experience: `todo` publishes the live checklist, `clarify` pauses to ask one critical question, and `complete` ends the run with a verified summary. None of this needs configuration. For the formal schemas, see [Tool Contract → Loop tools](/tool-contract#loop-tools).

Plugins, schedules, watchers, and the HTTP API all dispatch the same task experience. See [Plugin Authoring](/plugin-authoring), [Schedules](/schedules), [Watchers](/watchers), and [HTTP API](/api).

### Working Folder details

On selection, the agent loads the folder's tree, manifest, and git status, its Sandbox setting is disabled, and it gets file tools scoped to that folder. If the Sandbox can't be disabled safely, Osaurus clears the folder selection.

The folder persists per chat via macOS security-scoped bookmarks. A fresh chat with no folder of its own is seeded with the agent's sticky Working Folder (`Agent.workingFolderBookmark`, remembered from the Folder chip or the agent editor); the Orchestrator's folder is adopted the same way. A project folder replaces that agent-default seed, but never a folder the chat picked itself, and a chat restored from history keeps its own persisted folder.

The project's language (Swift, Node, Python, Rust, Go) is auto-detected from manifests, and guidance files (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`) are loaded automatically. Paths must stay strictly under the folder; anything outside is rejected before execution.

**`prompt_working_folder`** opens the folder picker with the agent's reason. The chosen folder is attached to the chat and remembered on the agent, like the chip. On cancel, the turn ends with a short notice and the picker won't reopen until you ask again. This tool only appears in an attended chat on a custom agent with no folder and no Sandbox — never over the HTTP API, in plugins, channels, schedules, watchers, or delegated subagents.

| Tool | What it does |
|---|---|
| `file_read` | Read a file (line ranges, `tail_lines`, and an explicit `max_chars` cap supported) — or point it at a directory to get a listing (skipping obvious noise like `node_modules`). PDF, Word, PowerPoint, and Excel files are extracted to text; PDFs carry `--- Page N of M ---` markers and accept `pages: "3"` or `pages: "3-5"`. `mode: "structure"` lists the paragraphs, cells, slides, or pages `file_edit` can address. |
| `file_write` | Create, overwrite, or append to a text file — or generate a document by extension: `.docx`/`.pdf` from Markdown or HTML, `.xlsx` from CSV/TSV or JSON rows, `.pptx` from Markdown. Pass `dry_run: true` to preview the diff without writing. |
| `file_edit` | Make a precise edit, replace every match with `replace_all`, or apply an atomic `edits` array. Tolerates whitespace and curly-quote drift when the match is unique. Edits existing `.docx`/`.xlsx`/`.pptx`/`.pdf` files in place with `operations`, keeping formatting. Also supports `dry_run` previews. |
| `file_copy` | Copy one file byte for byte — the binary-safe way to duplicate a document or image. Undoable. |
| `file_search` | Fast text search across the folder (including inside PDF/Word/PowerPoint/Excel content), or find files by name glob. Results page with `offset`; file listings report a `total` and `next_offset` so the agent can say "350 files" instead of "the first 50". |
| `detect_pii` | Scan text files for personal information without changing them |
| `redact_file` | Replace detected values deterministically in one undoable pass |
| `file_operation_history` / `file_undo` | Review the session's file writes and edits, and revert individual operations |
| `shell_run` | Run a shell command — for builds, installs, `mv`/`cp`/`rm`/`mkdir` (asks before running) |
| `git_status` / `git_diff` / `git_commit` | When the folder is a git repo. `git_commit` asks before running. |

Files under roughly 60,000 characters normally arrive in one read. Larger reads return a bounded continuation with guidance to use search, bulk edit, or redaction tools instead of paging an entire file through the model; automatic continuation is capped so a malformed task cannot loop forever. Line numbers in reads and search results always refer to the file's real lines.

### File history

Snapshots are taken for changes made through the file tools, `shell_run`, or sandbox tools. The agent can review and revert them with `file_operation_history` and `file_undo`.

### Redaction details

- `file_edit` can replace all occurrences or validate and apply several edits atomically. If any requested edit fails, nothing is written and no partial state is created.
- `detect_pii` returns detected spans grouped by category with line numbers.
- `redact_file` applies `[REDACTED X]` placeholders in one pass and records one `file_undo` entry.
- Both redaction tools accept per-call `custom_rules`. These are ephemeral and don't alter the cloud-bound Privacy Filter configuration.
- Detection uses the same local regex and Rampart engines as the Privacy Filter. If Rampart isn't installed, an attended chat can offer the ~37 MB download and resume the call afterward. Declining, or running headlessly, falls back to regex-only detection with an explicit warning.
- Mutating redaction is denied on external surfaces, just like `file_edit`.

### Sandbox details

New and legacy custom agents without an explicit opt-out start with Sandbox execution enabled where supported. On **macOS 26+** it uses a Linux VM (Apple Containerization framework, Alpine Linux) with each agent as its own Linux user. On **macOS 15** it falls back to a Seatbelt-confined host runner that can only write inside the sandbox workspace. [Sandbox Internals →](/sandbox)

What's available inside (Linux VM):

- Full POSIX userland: shell, coreutils, find, grep, sed, awk, tar
- Python (`pip`), Node.js (`npm`), system packages (`apk`)
- Compilers and build tools as needed
- Per-agent home at `/workspace/agents/{name}/` (mounted from your Mac)

Read-only sandbox tools are always available. Write, exec, install, and secret tools require `autonomous_exec` enabled on the agent. Sandbox mode never exposes or mounts a host folder.

The Orchestrator's Working Folder access is limited to `file_read` and `file_search`.

### Artifacts

The agent surfaces files with `share_artifact`. Artifacts are persisted under `~/.osaurus/artifacts/{session}/` and rendered inline.

---

**Related:**

- [Sandbox Internals](/sandbox) — the VM, plugin recipes, and security
- [Tools & Plugins](/tools) — what tools exist and how they're built
- [Tool Contract](/tool-contract) — the success/failure envelope every tool returns; full loop-tool schemas
- [Agents](/agents) — `autonomous_exec` and per-agent settings
