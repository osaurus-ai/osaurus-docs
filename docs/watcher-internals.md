---
title: Watcher Internals
sidebar_label: Watcher Internals
description: How a watcher fires — FSEvents detection, debounce, Merkle fingerprinting, dispatch, and the convergence loop that stops watchers from triggering themselves.
---

# Watcher Internals

This is the developer-facing companion to [Watchers](/watchers). The user-facing page covers what watchers are and how to set them up; this page covers how each one fires.

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
| Disabled | Manually paused | "Paused" (orange) |

## Why fingerprinting is fast

Fingerprints use a Merkle hash of file metadata only — path, size, modification time. No file contents are read during change detection. Even very large directories are fingerprinted in milliseconds.

## Smart exclusion of nested watchers

If you have a watcher on `~/Documents` and another on `~/Documents/Projects`, Osaurus automatically excludes the nested folder from the parent watcher's monitoring. No duplicate triggers.

## Storage

Watchers are stored as JSON, one file per watcher:

```
~/.osaurus/watchers/
├── {uuid-1}.json
├── {uuid-2}.json
└── ...
```

Each file contains the watcher's configuration with ISO 8601 dates.

## Sessions tagged `watcher`

Each triggered run is persisted as a chat session with `source = watcher`, keyed by the watcher's id. So all triggers from the same watcher accumulate into a single auditable session row in the chat sidebar — great for reviewing what happened over time.

## Folder access

Watchers use **security-scoped bookmarks** to persist folder access across app restarts. If a bookmark goes stale (folder moved or deleted), the watcher card shows a warning — edit it and re-select the folder.

---

**Related:**

- [Watchers](/watchers) — the user-facing view
- [Schedules](/schedules) — time-based automation
- [Architecture](/architecture) — where watchers fit in the bigger picture
