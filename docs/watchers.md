---
title: Watchers
sidebar_label: Watchers
description: Have your AI react when files change — sort downloads as they arrive, rename screenshots, or save a snapshot of your notes when you stop editing.
---

# Watchers

Some tasks shouldn't wait for you to ask. Drop a file into Downloads and you want it sorted. Take a screenshot and you want it renamed and filed. Stop editing your notes and you want the changes saved. Watchers do that.

A watcher keeps an eye on a folder. When files appear or change, it hands the work to one of your own [agents](/glossary#agent). Where [Schedules](/schedules) run on a clock, watchers react to what's happening on your Mac.

## Get started

1. Open **Settings…** (`⌘ ,`) → **Watchers**.
2. Click **Create Watcher**.
3. Fill in:
   - **Name** — for example, "Downloads Organizer"
   - **Watched Folder** — click **Browse** and pick a folder
   - **Instructions** — describe what the AI should do when something changes
   - **Agent** — pick one of your own agents (or a shared [workspace](/glossary#workspace) agent) to do the task. The [Orchestrator](/glossary#orchestrator) can't run watchers.
4. Choose:
   - **Recursive** — also watch the folders inside it?
   - **Responsiveness** — how soon to react after a change (see below)
5. Click **Create Watcher** to save it.

The watcher starts right away, and its card shows a **Watching** badge.

You can also ask the Orchestrator to create, change, pause, resume, or delete a watcher for you — it makes a custom agent first if you don't have one. For folders macOS protects, use **Browse** in the editor so Osaurus gets permission to use them.

## Responsiveness

How long should the watcher wait after a change before acting? Pick what fits:

| Setting | Reacts after | Best for |
|---|---|---|
| **Fast** | ~0.2 seconds | Screenshots, single files, quick edits |
| **Balanced** *(default)* | ~1 second | Most folders |
| **Patient** | ~3 seconds | Large downloads, many files at once |
| **Relaxed** | ~1 minute | Note-taking, wiki edits, active editing |
| **Deferred** | ~5 minutes | Long writing sessions, periodic syncs |
| **Extended** | ~10 minutes | End-of-session snapshots, long-running activity |

Pick **Fast** for near-instant reactions and **Balanced** for most cases. The longer settings are for "wait until things settle, then act" — like saving a snapshot of your Obsidian notes only after you've stopped editing for a while.

## Settings

| Setting | Required | What it does |
|---|---|---|
| Name | Yes | The name shown on the card |
| Watched Folder | Yes | The folder to watch (chosen with **Browse**) |
| Instructions | Yes | The message sent to the AI when something changes |
| Agent | Yes | One of your agents, or a shared workspace agent, that does the task |
| Recursive | No | Also watch folders inside it (off by default) |
| Responsiveness | No | Fast / Balanced / Patient / Relaxed / Deferred / Extended |

Each time a watcher runs, the result is added to one chat with a **watcher** badge in your sidebar. All runs from the same watcher collect in that one chat, so you can look back at everything it did.

## What the agent sees

Every run works **in the watched folder itself**. Even if the agent normally works in its [Sandbox](/glossary#sandbox), a watcher run uses the watched folder as its [Working Folder](/glossary#working-folder), so it can reach the files that actually changed. The agent is told which folder it's watching and which files changed (up to 20, plus a count of the rest), along with your instructions.

If the folder can't be opened when the watcher runs — it was moved or deleted, or macOS blocked access — the run says so clearly instead of looking somewhere else and reporting the folder empty.

**Workspace agents** run on their owner's Mac with their own instructions, model, and tools. They get a description of what changed, but not the folder itself. If their Mac is offline, that change is skipped.

## Managing watchers

Click the **⋯** menu on a watcher's card:

| Action | What it does |
|---|---|
| Edit | Open the editor |
| Trigger Now | Run the watcher right away |
| Pause | Stop watching for now |
| Resume | Start watching again |
| Delete | Remove it for good (asks you to confirm) |

## Examples

### Downloads Organizer

- **Folder:** `~/Downloads`
- **Responsiveness:** Patient (files take time to download)
- **Instructions:**
  ```
  Organize new files by type into subfolders (Documents, Images,
  Videos, Archives, etc.). Skip files already in a subfolder.
  Don't move files currently downloading (look for .crdownload
  or .part extensions).
  ```

### Screenshot Manager

- **Folder:** `~/Desktop` (or wherever your screenshots go)
- **Responsiveness:** Fast (screenshots appear instantly)
- **Instructions:**
  ```
  Rename new screenshots with a descriptive name based on their
  content. Move them to ~/Pictures/Screenshots organized by date
  (YYYY-MM folders).
  ```

### Obsidian Auto-Commit

Saves a snapshot of your notes with Git (a tool that keeps a history of changes) after you stop editing.

- **Folder:** `~/Documents/ObsidianVault` (recursive)
- **Responsiveness:** Relaxed (~1 minute) — pick Deferred or Extended to wait longer
- **Instructions:**
  ```
  Stage all changes in the wiki repository and create a single
  commit. Generate a concise commit message that summarizes
  what changed (look at the diff). If there is nothing to commit,
  return without making changes.
  ```

### Dropbox Processor

- **Folder:** `~/Dropbox/Shared`
- **Responsiveness:** Balanced
- **Instructions:**
  ```
  When new files appear, analyze their contents and create a
  summary document. For spreadsheets, generate a brief data
  overview. For documents, create a one-paragraph summary.
  ```

## Tips

### Write instructions that are safe to repeat

A watcher may run more than once for the same files. Write instructions that give the same result whether they run once or many times:

- "Skip files already in a subfolder"
- "Only process files changed in the last 5 minutes"
- "Check whether a summary already exists before creating one"

Osaurus already reminds the agent not to redo files it has already organized, but clear instructions help.

## Troubleshooting

### The watcher doesn't run

- Check it isn't paused.
- Check the folder still exists and you can open it.
- If Osaurus has lost track of the folder, edit the watcher and pick the folder again with **Browse**.
- If the run says the folder couldn't be opened, check the folder exists and that Osaurus is allowed to use it. For protected folders, allow access in **System Settings → Privacy & Security**.
- Make sure the changes are actually inside the watched folder.
- If **Recursive** is off, changes in folders inside it won't trigger the watcher.

### The agent runs too often

- Choose a slower setting, like Patient, Relaxed, or longer.
- Make the instructions safe to repeat (see Tips).
- Check whether the agent's own file changes are setting the watcher off again.

### "Stale bookmark" warning

Osaurus has lost its saved permission for the folder. Edit the watcher and pick the folder again. Restart Osaurus if the warning stays.

---

## Under the hood

- **Folder access:** folders picked with **Browse** get a security-scoped bookmark (macOS's saved permission for a folder). Folders the Orchestrator adds by path get standard file access. A "stale bookmark" means that saved permission no longer resolves.
- **File access during runs:** a watcher run uses the watched folder as its working folder with host file access, even when the agent normally runs with the [sandbox](/sandbox) on.
- **Trigger prompt:** names the watched folder and lists up to 20 changed paths plus a count of the rest, alongside your instructions and built-in guidance to avoid re-processing already-organized files.
- **Chat tagging:** each run is saved to a chat session tagged `watcher`, keyed by the watcher's id.
- **Responsiveness timings:** Fast ~200 ms, Balanced ~1 s, Patient ~3 s, Relaxed ~1 minute, Deferred ~5 minutes, Extended ~10 minutes.

For the FSEvents pipeline, the convergence loop, the state machine, and how fingerprinting stays fast, see [Watcher Internals](/watcher-internals).

---

**Related:**

- [Schedules](/schedules) — run an agent on a clock (works alongside Watchers)
- [Tasks](/agent-loop) — what the agent actually does once a watcher fires
- [Agents](/agents) — choose which agent runs your watcher tasks
- [Watcher Internals](/watcher-internals) — the developer deep dive
