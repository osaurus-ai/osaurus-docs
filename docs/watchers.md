---
title: Watchers
sidebar_label: Watchers
description: Monitor folders for file changes and trigger AI agent tasks. Six responsiveness tiers from instant to "settle for 10 minutes".
sidebar_position: 11
---

# Watchers

Watchers monitor folders for file system changes and automatically trigger AI agent tasks. Where Schedules run on a clock, Watchers react to the real world — files arriving, being modified, or removed.

Useful for:

- **File organization** — sort and rename as files arrive
- **Content processing** — analyze or transform new files
- **Workflow automation** — multi-step AI tasks in response to drops
- **End-of-session checkpoints** — auto-commit a wiki after you stop editing

## Quick start

1. Open the Management window (`⌘ ⇧ M`) → **Watchers**
2. Click **Create Watcher**
3. Fill in:
   - **Name** — e.g. "Downloads Organizer"
   - **Watched Folder** — click **Browse** and pick a folder
   - **Instructions** — describe what the AI should do when changes are detected
   - **Agent** *(optional)* — pick which agent runs the task
4. Configure:
   - **Recursive** — monitor subdirectories?
   - **Responsiveness** — debounce window (see below)
5. Click **Save**

The watcher starts immediately. The card shows a "Watching" badge.

## How a watcher fires

```
1. FSEvents detects a change in the watched folder
2. Debouncing: rapid changes coalesce into a single trigger (per the responsiveness tier)
3. Fingerprinting: a Merkle hash of file metadata captures the current state
4. Dispatch: an AI agent task runs with your instructions and the folder context
5. Convergence: after the agent completes, re-fingerprint
   - If it changed (e.g. agent moved files), re-dispatch
   - If stable, return to idle (max 5 iterations)
```

The convergence loop matters: it lets the agent organize files without re-triggering itself endlessly.

## Responsiveness

Responsiveness controls how long the watcher waits after detecting changes before firing the AI task. Pick a tier that matches your workflow:

| Setting | Debounce window | Best for |
|---|---|---|
| **Fast** | ~200 ms | Screenshots, single-file drops, quick edits |
| **Balanced** *(default)* | ~1 s | General-purpose monitoring |
| **Patient** | ~3 s | Large downloads, batch operations, multi-file drops |
| **Relaxed** | ~1 minute | Note-taking, wiki edits, active editing sessions |
| **Deferred** | ~5 minutes | Extended writing sessions, periodic syncs |
| **Extended** | ~10 minutes | End-of-session checkpoints, long-running activity |

Choose **Fast** for near-instant reactions and **Balanced** for most cases. The longer tiers (Relaxed, Deferred, Extended) are designed for "settle then act" workflows — like an automatic-commit watcher on an Obsidian wiki that should fire only after you've stopped editing for a while.

## States

Each watcher operates as a small state machine:

```
┌──────┐     ┌────────────┐     ┌────────────┐     ┌──────────┐
│ idle │ ──▶ │ debouncing │ ──▶ │ processing │ ──▶ │ settling │
└──────┘     └────────────┘     └────────────┘     └──────────┘
   ▲                                                     │
   │                                                     │
   └─────────────────────────────────────────────────────┘
                    (fingerprint stable)
```

| State | Description | Card badge |
|---|---|---|
| Idle | Waiting for changes | "Watching" (green) |
| Debouncing | Coalescing rapid events | "Watching" (green) |
| Processing | Agent task running | "Running" (accent + spinner) |
| Settling | Waiting for self-caused FSEvents to flush | "Watching" (green) |
| Disabled | Manually paused | "Paused" (gray) |

## Properties

| Property | Required | Description |
|---|---|---|
| Name | Yes | Display name |
| Watched Folder | Yes | Directory to monitor (selected via folder picker) |
| Instructions | Yes | Prompt sent to the AI when changes are detected |
| Agent | No | Agent to use for the task |
| Recursive | No | Monitor subdirectories (default: off) |
| Responsiveness | No | Fast / Balanced / Patient / Relaxed / Deferred / Extended |

### Folder access

Watchers use **security-scoped bookmarks** to persist folder access across app restarts. If a bookmark goes stale (folder moved or deleted), the watcher card shows a warning — edit it and re-select the folder.

### Sessions tagged `watcher`

Each triggered run is persisted as a chat session with `source = watcher`, keyed by the watcher's id. So all triggers from the same watcher accumulate into a single auditable session row in the chat sidebar — great for reviewing what happened over time.

## Managing watchers

The card's context menu (ellipsis):

| Action | Description |
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

### Smart exclusion of nested watchers

If you have a watcher on `~/Documents` and another on `~/Documents/Projects`, Osaurus automatically excludes the nested folder from the parent watcher's monitoring. No duplicate triggers.

### Why fingerprinting is fast

Fingerprints use a Merkle hash of file metadata only — path, size, modification time. No file contents are read during change detection. Even very large directories are fingerprinted in milliseconds.

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

## Storage

Watchers are stored as JSON:

```
~/.osaurus/watchers/
├── {uuid-1}.json
├── {uuid-2}.json
└── ...
```

Each file contains the watcher's configuration with ISO 8601 dates.

---

**Related:**

- [Schedules](/schedules) — time-based automation (complements Watchers)
- [Agent Loop](/agent-loop) — the agent loop and folder context
- [Agents](/agents) — pick which agent runs your watcher tasks
