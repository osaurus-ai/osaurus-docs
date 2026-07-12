---
title: Watchers
sidebar_label: Watchers
description: Have your AI react to file changes — sort downloads as they arrive, rename screenshots, auto-commit your wiki when you stop editing.
---

# Watchers

Some tasks shouldn't wait for you to ask. Drop a file into Downloads and you want it sorted. Take a screenshot and you want it renamed and filed. Stop editing your wiki and you want a commit. Watchers do that.

A watcher keeps an eye on a folder, and when files appear or change, it hands the work to one of your agents.

Where [Schedules](/schedules) run on a clock, watchers react to the real world.

## Quick start

1. Open the Management window (`⌘ ,`) → **Watchers**
2. Click **Create Watcher**
3. Fill in:
   - **Name** — e.g. "Downloads Organizer"
   - **Watched Folder** — click **Browse** and pick a folder
   - **Instructions** — describe what the AI should do when changes happen
   - **Agent** *(optional)* — pick which agent runs the task
4. Configure:
   - **Recursive** — also monitor subfolders?
   - **Responsiveness** — how soon to react after a change (see below)
5. Click **Save**

The watcher starts immediately. The card shows a "Watching" badge.

## Responsiveness

How long should the watcher wait after detecting changes before firing? Pick the tier that matches your workflow:

| Setting | Reacts after | Best for |
|---|---|---|
| **Fast** | ~200 ms | Screenshots, single-file drops, quick edits |
| **Balanced** *(default)* | ~1 s | General-purpose monitoring |
| **Patient** | ~3 s | Large downloads, batch operations, multi-file drops |
| **Relaxed** | ~1 minute | Note-taking, wiki edits, active editing sessions |
| **Deferred** | ~5 minutes | Extended writing sessions, periodic syncs |
| **Extended** | ~10 minutes | End-of-session checkpoints, long-running activity |

Pick **Fast** for near-instant reactions and **Balanced** for most cases. The longer tiers are designed for "settle then act" workflows — like an automatic-commit watcher on an Obsidian wiki that should fire only after you've stopped editing for a while.

## Properties

| Property | Required | Description |
|---|---|---|
| Name | Yes | Display name |
| Watched Folder | Yes | Directory to monitor (selected via folder picker) |
| Instructions | Yes | Prompt sent to the AI when changes are detected |
| Agent | No | Agent to use for the task |
| Recursive | No | Monitor subdirectories (default: off) |
| Responsiveness | No | Fast / Balanced / Patient / Relaxed / Deferred / Extended |

Each triggered run is saved as a chat session tagged `watcher`, keyed by the watcher's id, so all triggers from the same watcher accumulate into one auditable thread in your sidebar.

## Managing watchers

The card's context menu (ellipsis):

| Action | What it does |
|---|---|
| Edit | Open the editor |
| Trigger Now | Run the watcher immediately |
| Pause | Temporarily stop monitoring |
| Resume | Re-enable a paused watcher |
| Delete | Remove permanently (confirmation required) |

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

- **Folder:** `~/Desktop` (or your screenshot location)
- **Responsiveness:** Fast (screenshots appear instantly)
- **Instructions:**
  ```
  Rename new screenshots with a descriptive name based on their
  content. Move them to ~/Pictures/Screenshots organized by date
  (YYYY-MM folders).
  ```

### Obsidian Auto-Commit

- **Folder:** `~/Documents/ObsidianVault` (recursive)
- **Responsiveness:** Relaxed (~1 minute) — pick Deferred or Extended for longer settle windows
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

### Write idempotent instructions

Watchers may fire repeatedly. Write instructions that produce the same result whether run once or many times:

- "Skip files already in a subfolder"
- "Only process files modified in the last 5 minutes"
- "Check if a summary already exists before creating one"

The watcher prompt automatically includes guidance to avoid re-processing already-organized files, but explicit instructions help.

## Troubleshooting

### Watcher not triggering

- Verify it's enabled (not paused)
- Check that the folder still exists and is accessible
- If the bookmark is stale, edit and re-select the folder
- Confirm the changes are actually inside the watched folder
- If `Recursive` is off, changes in subdirectories won't trigger it

### Agent runs too often

- Increase responsiveness to Patient, Relaxed, or longer
- Make instructions more idempotent
- Check whether the agent's file operations are causing a feedback loop

### Stale bookmark warning

Edit the watcher and re-select the folder. Restart Osaurus if the issue persists.

## Under the hood

Curious about the FSEvents pipeline, the convergence loop, the state machine, or how fingerprinting stays fast? See [Watcher Internals](/watcher-internals).

---

**Related:**

- [Schedules](/schedules) — time-based automation (complements Watchers)
- [Tasks](/agent-loop) — what the agent actually does once a watcher fires
- [Agents](/agents) — pick which agent runs your watcher tasks
- [Watcher Internals](/watcher-internals) — the developer-facing deep dive
